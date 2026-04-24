import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { UserPreferencesService } from '../users/user-preferences.service';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private ready = false;

  constructor(
    private readonly config: ConfigService,
    private readonly userPreferences: UserPreferencesService
  ) {}

  onModuleInit(): void {
    const raw = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    if (!raw?.trim()) {
      this.logger.log('FIREBASE_SERVICE_ACCOUNT_JSON not set; FCM delivery is disabled');
      return;
    }
    try {
      const cred = JSON.parse(raw) as admin.ServiceAccount;
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(cred)
        });
      }
      this.ready = true;
      this.logger.log('Firebase Admin initialized for FCM');
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      this.logger.warn(`Invalid FIREBASE_SERVICE_ACCOUNT_JSON; FCM disabled: ${m}`);
    }
  }

  isEnabled(): boolean {
    return this.ready;
  }

  /**
   * Sends a display notification via FCM. Android tokens from Expo are FCM registration tokens.
   * iOS tokens from `expo-notifications` are often APNs device tokens; FCM may reject them unless
   * the app uses Firebase iOS SDK for an FCM registration token.
   */
  async sendToDevice(
    userId: string,
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    if (!this.ready) {
      return;
    }
    const dataPayload =
      data &&
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]));
    try {
      await admin.messaging().send({
        token,
        notification: { title, body },
        ...(dataPayload && Object.keys(dataPayload).length > 0 ? { data: dataPayload } : {}),
        android: { priority: 'high' },
        apns: {
          payload: {
            aps: {
              alert: { title, body },
              sound: 'default'
            }
          }
        }
      });
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: unknown }).code)
          : '';
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`FCM send failed (${code || 'unknown'}): ${message}`);
      if (
        code === 'messaging/invalid-registration-token' ||
        code === 'messaging/registration-token-not-registered'
      ) {
        await this.userPreferences.clearFcmDeviceToken(userId);
      }
    }
  }
}
