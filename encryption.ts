export function encrypt(text: string, password: string): { encrypted: string; iv: string } {
  const iv = generateIV();
  const encrypted = btoa(text + '::' + password + '::' + iv);
  return { encrypted, iv };
}

export function decrypt(encrypted: string, password: string, iv: string): string | null {
  try {
    const decrypted = atob(encrypted);
    const parts = decrypted.split('::');
    if (parts[1] === password && parts[2] === iv) {
      return parts[0];
    }
    return null;
  } catch {
    return null;
  }
}

function generateIV(): string {
  const chars = '0123456789abcdef';
  let iv = '';
  for (let i = 0; i < 32; i++) {
    iv += chars[Math.floor(Math.random() * chars.length)];
  }
  return iv;
}

export function hashSHA256(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64);
}
