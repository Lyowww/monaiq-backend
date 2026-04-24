import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WAITLIST_EMAIL_SUBJECT_HY,
  WAITLIST_SUCCESS_MESSAGE_HY,
  buildWaitlistThankYouEmailHtml,
  buildWaitlistThankYouEmailText
} from './waitlist.constants';
import { WaitlistEntry, WaitlistEntryDocument } from './schemas/waitlist-entry.schema';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(
    @InjectModel(WaitlistEntry.name)
    private readonly waitlistModel: Model<WaitlistEntryDocument>,
    private readonly configService: ConfigService
  ) {}

  /**
   * Idempotent: existing emails get the same success message; thank-you email is sent only once.
   */
  async register(emailRaw: string): Promise<{ message: string }> {
    const email = emailRaw.trim().toLowerCase();
    const existing = await this.waitlistModel.findOne({ email }).exec();
    if (existing) {
      return { message: WAITLIST_SUCCESS_MESSAGE_HY };
    }

    await this.waitlistModel.create({ email });
    await this.sendThankYouEmail(email);
    return { message: WAITLIST_SUCCESS_MESSAGE_HY };
  }

  private async sendThankYouEmail(to: string): Promise<void> {
    const apiKey = this.configService.get<string>('RESEND_API_KEY')?.trim();
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not set; waitlist entry saved but no email was sent');
      return;
    }

    const fromRaw = this.configService.get<string>('WAITLIST_EMAIL_FROM')?.trim();
    const from = fromRaw?.length ? fromRaw : 'Mon AIq <onboarding@resend.dev>';

    const instagramUrl =
      this.configService.get<string>('WAITLIST_INSTAGRAM_URL')?.trim() ||
      'https://www.instagram.com/';

    const body = {
      from,
      to: [to],
      subject: WAITLIST_EMAIL_SUBJECT_HY,
      html: buildWaitlistThankYouEmailHtml(instagramUrl),
      text: buildWaitlistThankYouEmailText(instagramUrl)
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      this.logger.error(
        `Resend waitlist email failed: ${res.status} ${errText.slice(0, 500)}`
      );
    }
  }
}
