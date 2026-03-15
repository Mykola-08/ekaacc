import crypto from 'crypto';

export function validateTelegramWebAppData(
  initData: string,
  botToken: string
): { isValid: boolean; parsedData?: Record<string, string> } {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) {
      return { isValid: false };
    }

    urlParams.delete('hash');

    // Sort keys alphabetically
    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckString = keys.map((key) => `${key}=${urlParams.get(key)}`).join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const generatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (generatedHash === hash) {
      const parsedData: Record<string, string> = {};
      for (const [key, value] of urlParams.entries()) {
        parsedData[key] = value;
      }
      return { isValid: true, parsedData };
    }

    return { isValid: false };
  } catch (error) {
    console.error('Error validating Telegram WebApp initData:', error);
    return { isValid: false };
  }
}
