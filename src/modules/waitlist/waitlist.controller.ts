import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WaitlistJoinDto } from './waitlist.dto';
import { WaitlistService } from './waitlist.service';

@ApiTags('Waitlist')
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Join app waitlist (stores email, sends thank-you email in Armenian)' })
  async join(@Body() dto: WaitlistJoinDto): Promise<{ ok: true; message: string }> {
    const { message } = await this.waitlistService.register(dto.email);
    return { ok: true, message };
  }
}
