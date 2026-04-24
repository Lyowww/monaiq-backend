"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_models_1 = require("../../common/swagger/swagger.models");
const ai_dto_1 = require("./ai.dto");
const ai_chat_log_service_1 = require("./ai-chat-log.service");
const ai_finance_conversation_service_1 = require("./ai-finance-conversation.service");
const finance_assistant_service_1 = require("./finance-assistant.service");
const openrouter_llm_service_1 = require("./openrouter-llm.service");
const ocr_service_1 = require("./ocr.service");
const speech_service_1 = require("./speech.service");
const translation_service_1 = require("./translation.service");
let AiController = class AiController {
    ocrService;
    speechService;
    financeAssistant;
    aiChatLog;
    financeConversations;
    openRouter;
    translation;
    constructor(ocrService, speechService, financeAssistant, aiChatLog, financeConversations, openRouter, translation) {
        this.ocrService = ocrService;
        this.speechService = speechService;
        this.financeAssistant = financeAssistant;
        this.aiChatLog = aiChatLog;
        this.financeConversations = financeConversations;
        this.openRouter = openRouter;
        this.translation = translation;
    }
    async openRouterChatStream(_claims, res, dto) {
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.status(common_1.HttpStatus.OK);
        res.flushHeaders?.();
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
                    }
                    else if (part.kind === 'usage') {
                        res.write(`data: ${JSON.stringify({ type: 'usage', usage: part.usage })}\n\n`);
                    }
                }
                const outText = accText.length > 0 ? await this.translation.translate(accText.trim(), 'hy') : '';
                const outReasoning = accReasoning.length > 0 ? await this.translation.translate(accReasoning.trim(), 'hy') : '';
                const payload = { type: 'delta' };
                if (outText.length > 0) {
                    payload.text = outText;
                }
                if (outReasoning.length > 0) {
                    payload.reasoning = outReasoning;
                }
                if (outText.length > 0 || outReasoning.length > 0) {
                    res.write(`data: ${JSON.stringify(payload)}\n\n`);
                }
            }
            else {
                for await (const part of this.openRouter.streamUserMessage(messageForModel)) {
                    if (part.kind === 'delta') {
                        if (part.text.length === 0 && part.reasoning.length === 0) {
                            continue;
                        }
                        const payload = { type: 'delta' };
                        if (part.text.length > 0) {
                            payload.text = part.text;
                        }
                        if (part.reasoning.length > 0) {
                            payload.reasoning = part.reasoning;
                        }
                        res.write(`data: ${JSON.stringify(payload)}\n\n`);
                    }
                    else if (part.kind === 'usage') {
                        res.write(`data: ${JSON.stringify({ type: 'usage', usage: part.usage })}\n\n`);
                    }
                }
            }
            res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        }
        catch (err) {
            const message = httpExceptionOrErrorMessage(err, 'The AI service could not complete this request. Please try again.');
            res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
        }
        finally {
            res.end();
        }
    }
    async listFinanceConversations(claims) {
        const conversations = await this.financeConversations.listSummaries(claims.sub);
        return { conversations };
    }
    async getFinanceConversation(claims, id) {
        return this.financeConversations.getWithTurns(claims.sub, id);
    }
    async financeChat(claims, dto) {
        await this.aiChatLog.logUserMessage(claims.sub, dto.message);
        const replyLanguage = dto.replyLanguage === 'hy' ? 'hy' : 'en';
        const conv = dto.conversationId
            ? await this.financeConversations.requireForUser(claims.sub, dto.conversationId)
            : await this.financeConversations.create(claims.sub, this.financeConversations.previewTitle(dto.message));
        const priorMessages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
        const reply = await this.financeAssistant.answer(claims.sub, dto.message, replyLanguage, {
            priorMessages
        });
        await this.financeConversations.appendUserAssistantPair(conv._id, dto.message, reply);
        return { reply, conversationId: conv._id.toString() };
    }
    receiptOcr(dto) {
        return this.ocrService.extractReceiptFromRawText(dto.rawText);
    }
    async transcribe(file) {
        const transcript = await this.speechService.transcribeAudio(file.buffer, file.originalname, file.mimetype);
        return {
            transcript
        };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('openrouter/chat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Stream chat via OpenRouter (Gemma free stack with fallbacks); SSE with content + usage',
        description: 'Response is `text/event-stream`. Each line is `data: { "type": "delta" | "usage" | "done" | "error", ... }`.'
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'text/event-stream' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: false })),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, ai_dto_1.OpenRouterChatDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "openRouterChatStream", null);
__decorate([
    (0, common_1.Get)('finance/conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'List saved AI finance chat threads' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "listFinanceConversations", null);
__decorate([
    (0, common_1.Get)('finance/conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Load one AI finance chat thread with messages' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getFinanceConversation", null);
__decorate([
    (0, common_1.Post)('finance/chat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Finance-only assistant; uses your live balances and activity' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Plain-text reply and conversation id' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_dto_1.FinanceChatDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "financeChat", null);
__decorate([
    (0, common_1.Post)('ocr/receipt'),
    (0, swagger_1.ApiOperation)({ summary: 'Extract structured receipt data from OCR text' }),
    (0, swagger_1.ApiOkResponse)({ type: swagger_models_1.ReceiptOcrResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.ReceiptOcrDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "receiptOcr", null);
__decorate([
    (0, common_1.Post)('transcribe'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    (0, swagger_1.ApiOperation)({ summary: 'Transcribe a voice quick-action command' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiOkResponse)({ type: swagger_models_1.TranscriptResponseDto }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "transcribe", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ocr_service_1.OcrService,
        speech_service_1.SpeechService,
        finance_assistant_service_1.FinanceAssistantService,
        ai_chat_log_service_1.AiChatLogService,
        ai_finance_conversation_service_1.AiFinanceConversationService,
        openrouter_llm_service_1.OpenRouterLlmService,
        translation_service_1.TranslationService])
], AiController);
function httpExceptionOrErrorMessage(err, fallback) {
    if (err instanceof common_1.HttpException) {
        const r = err.getResponse();
        if (typeof r === 'string' && r.length > 0) {
            return r;
        }
        if (r && typeof r === 'object' && 'message' in r) {
            const m = r.message;
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
//# sourceMappingURL=ai.controller.js.map