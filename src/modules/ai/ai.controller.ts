import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AccessTokenClaims } from '../auth/auth.types';
import {
  ReceiptOcrResponseDto,
  TranscriptResponseDto
} from '../../common/swagger/swagger.models';
import { FinanceChatDto, OpenRouterChatDto, ReceiptOcrDto } from './ai.dto';
import { AiChatLogService } from './ai-chat-log.service';
import { AiFinanceConversationService } from './ai-finance-conversation.service';
import { FinanceAssistantService } from './finance-assistant.service';
import { OpenRouterLlmService } from './openrouter-llm.service';
import { OcrService } from './ocr.service';
import { SpeechService } from './speech.service';
import { TranslationService } from './translation.service';

@ApiTags('AI')
@ApiBearerAuth('bearer')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly speechService: SpeechService,
    private readonly financeAssistant: FinanceAssistantService,
    private readonly aiChatLog: AiChatLogService,
    private readonly financeConversations: AiFinanceConversationService,
    private readonly openRouter: OpenRouterLlmService,
    private readonly translation: TranslationService
  ) {}

  @Post('openrouter/chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Stream chat via OpenRouter (Gemma free stack with fallbacks); SSE with content + usage',
    description:
      'Response is `text/event-stream`. Each line is `data: { "type": "delta" | "usage" | "done" | "error", ... }`.'
  })
  @ApiOkResponse({ description: 'text/event-stream' })
  async openRouterChatStream(
    @CurrentUser() _claims: AccessTokenClaims,
    @Res({ passthrough: false }) res: Response,
    @Body() dto: OpenRouterChatDto
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(HttpStatus.OK);
    (res as Response & { flushHeaders?: () => void }).flushHeaders?.();

    try {
      const replyLanguage = dto.replyLanguage === 'hy' ? 'hy' : 'en';
      let messageForModel = dto.message;
      if (replyLanguage === 'hy') {
        messageForModel = await this.translation.translate(dto.message, 'en');
      }

      if (replyLanguage === 'hy') {
        let accText = '';
        let accReasoning = '';
        for await (const part of this.openRouter.streamUserMessage(messageForModel)) {
          if (part.kind === 'delta') {
            accText += part.text;
            accReasoning += part.reasoning;
          } else if (part.kind === 'usage') {
            res.write(`data: ${JSON.stringify({ type: 'usage', usage: part.usage })}\n\n`);
          }
        }
        const outText = accText.length > 0 ? await this.translation.translate(accText.trim(), 'hy') : '';
        const outReasoning =
          accReasoning.length > 0 ? await this.translation.translate(accReasoning.trim(), 'hy') : '';
        const payload: Record<string, string> = { type: 'delta' };
        if (outText.length > 0) {
          payload.text = outText;
        }
        if (outReasoning.length > 0) {
          payload.reasoning = outReasoning;
        }
        if (outText.length > 0 || outReasoning.length > 0) {
          res.write(`data: ${JSON.stringify(payload)}\n\n`);
        }
      } else {
        for await (const part of this.openRouter.streamUserMessage(messageForModel)) {
          if (part.kind === 'delta') {
            if (part.text.length === 0 && part.reasoning.length === 0) {
              continue;
            }
            const payload: Record<string, string> = { type: 'delta' };
            if (part.text.length > 0) {
              payload.text = part.text;
            }
            if (part.reasoning.length > 0) {
              payload.reasoning = part.reasoning;
            }
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
          } else if (part.kind === 'usage') {
            res.write(`data: ${JSON.stringify({ type: 'usage', usage: part.usage })}\n\n`);
          }
        }
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    } catch (err) {
      const message = httpExceptionOrErrorMessage(
        err,
        'The AI service could not complete this request. Please try again.'
      );
      res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
    } finally {
      res.end();
    }
  }

  @Get('finance/conversations')
  @ApiOperation({ summary: 'List saved AI finance chat threads' })
  async listFinanceConversations(@CurrentUser() claims: AccessTokenClaims): Promise<{
    conversations: { id: string; title: string; updatedAt: string }[];
  }> {
    const conversations = await this.financeConversations.listSummaries(claims.sub);
    return { conversations };
  }

  @Get('finance/conversations/:id')
  @ApiOperation({ summary: 'Load one AI finance chat thread with messages' })
  async getFinanceConversation(
    @CurrentUser() claims: AccessTokenClaims,
    @Param('id') id: string
  ): Promise<{
    id: string;
    title: string;
    updatedAt: string;
    messages: { role: 'user' | 'assistant'; content: string; at: string }[];
  }> {
    return this.financeConversations.getWithTurns(claims.sub, id);
  }

  @Post('finance/chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finance-only assistant; uses your live balances and activity' })
  @ApiOkResponse({ description: 'Plain-text reply and conversation id' })
  async financeChat(
    @CurrentUser() claims: AccessTokenClaims,
    @Body() dto: FinanceChatDto
  ): Promise<{ reply: string; conversationId: string }> {
    await this.aiChatLog.logUserMessage(claims.sub, dto.message);
    const replyLanguage = dto.replyLanguage === 'hy' ? 'hy' : 'en';

    const conv = dto.conversationId
      ? await this.financeConversations.requireForUser(claims.sub, dto.conversationId)
      : await this.financeConversations.create(
          claims.sub,
          this.financeConversations.previewTitle(dto.message)
        );

    const priorMessages = conv.messages.map((m) => ({ role: m.role, content: m.content }));

    const reply = await this.financeAssistant.answer(claims.sub, dto.message, replyLanguage, {
      priorMessages
    });

    await this.financeConversations.appendUserAssistantPair(conv._id, dto.message, reply);

    return { reply, conversationId: conv._id.toString() };
  }

  @Post('ocr/receipt')
  @ApiOperation({ summary: 'Extract structured receipt data from OCR text' })
  @ApiOkResponse({ type: ReceiptOcrResponseDto })
  receiptOcr(@Body() dto: ReceiptOcrDto) {
    return this.ocrService.extractReceiptFromRawText(dto.rawText);
  }

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiOperation({ summary: 'Transcribe a voice quick-action command' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['audio'],
      properties: {
        audio: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiOkResponse({ type: TranscriptResponseDto })
  async transcribe(
    @UploadedFile()
    file: { buffer: Buffer; originalname: string; mimetype: string }
  ) {
    const transcript = await this.speechService.transcribeAudio(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    return {
      transcript
    };
  }
}

function httpExceptionOrErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpException) {
    const r = err.getResponse();
    if (typeof r === 'string' && r.length > 0) {
      return r;
    }
    if (r && typeof r === 'object' && 'message' in r) {
      const m = (r as { message: string | string[] }).message;
      if (Array.isArray(m) && m[0]) {
        return m[0];
      }
      if (typeof m === 'string' && m.length > 0) {
        return m;
      }
    }
  }
  if (err instanceof Error && err.message.length > 0) {
    return err.message;
  }
  return fallback;
}
