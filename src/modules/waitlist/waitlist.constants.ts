/** Short message returned in JSON (HY) — matches thank-you email tone */
export const WAITLIST_SUCCESS_MESSAGE_HY =
  'Շնորհակալություն՝ մեր հավելվածի սպասման ցուցակին միանալու համար։ Շուտով կկիսվենք նորություններով, իսկ մինչ այդ կարող եք հետևել մեզ Instagram-ում՝ հավելվածի մասին թարմացումներին ժամանակին տեղեկացված մնալու համար։';

export const WAITLIST_EMAIL_SUBJECT_HY =
  'Շնորհակալություն՝ MonAIQ-ի սպասման ցուցակին միանալու համար';

export function buildWaitlistThankYouEmailHtml(instagramUrl: string): string {
  const safeUrl = instagramUrl.trim() || 'https://www.instagram.com/';

  return `<!DOCTYPE html>
<html lang="hy">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${WAITLIST_EMAIL_SUBJECT_HY}</title>
</head>
<body style="margin:0;padding:24px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#1a1a1a;background:#f7f7f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px 32px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    <tr><td>
      <p style="margin:0 0 16px;">Ողջույն,</p>
      <p style="margin:0 0 16px;">Շնորհակալություն, որ միացաք <strong>MonAIQ</strong> հավելվածի սպասման ցուցակին։ Ձեր հետաքրքրությունը մեզ համար շատ կարևոր է, և մենք ակտիվորեն աշխատում ենք, որպեսզի հավելվածը շուտով Ձեզ հասանելի դարձնենք։</p>
      <p style="margin:0 0 16px;">Երբ հավելվածը պատրաստ լինի, կտեղեկացնենք Ձեզ էլեկտրոնային փոստով։</p>
      <p style="margin:0 0 8px;">Մինչ այդ կարող եք <strong>հետևել մեզ Instagram-ում</strong>՝ հավելվածի նորություններին, թարմացումներին և գործարկմանը վերաբերող հայտարարություններին ժամանակին տեղեկացված մնալու համար՝</p>
      <p style="margin:0 0 24px;"><a href="${safeUrl}" style="color:#2563eb;">Instagram</a></p>
      <p style="margin:0;color:#525252;font-size:14px;">Հարգանքով,<br />MonAIQ թիմ</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildWaitlistThankYouEmailText(instagramUrl: string): string {
  const safeUrl = instagramUrl.trim() || 'https://www.instagram.com/';
  return [
    'Ողջույն,',
    '',
    'Շնորհակալություն, որ միացաք Mon AIq հավելվածի սպասման ցուցակին։ Ձեր հետաքրքրությունը մեզ համար շատ կարևոր է, և մենք ակտիվորեն աշխատում ենք, որպեսզի հավելվածը շուտով Ձեզ հասանելի դարձնենք։',
    '',
    'Երբ հավելվածը պատրաստ լինի, կտեղեկացնենք Ձեզ էլեկտրոնային փոստով։',
    '',
    'Մինչ այդ կարող եք հետևել մեզ Instagram-ում՝ հավելվածի նորություններին և թարմացումներին ժամանակին տեղեկացված մնալու համար՝',
    safeUrl,
    '',
    'Հարգանքներով,',
    'Mon AIq թիմ'
  ].join('\n');
}
