export const SERVICE_TRANSLATIONS: Record<string, string> = {
  "Alivio tensión muscular 4 en 1: Masaje + Osteobalance + Kine + Feldenkrais": "Muscle Tension Relief 4 in 1",
  "Constelaciones": "Constellations",
  "Revisión 360°": "360° Review",
  "Sesión de Kinesiología": "Kinesiology Session",
  "Sesión de masaje": "Massage Session",
  "Rubí": "Rubí",
  "Barcelona": "Barcelona",
  "1h": "1h",
  "1h 30 mins": "1.5h",
  "1h 30mins": "1.5h",
  "Masaje relajante": "Relaxing Massage",
  "Masaje descontracturante": "Deep Tissue Massage",
};

export function translateText(text: string): string {
  if (!text) return text;
  // Direct match
  if (SERVICE_TRANSLATIONS[text]) return SERVICE_TRANSLATIONS[text];
  
  // Partial match replacement
  let translated = text;
  for (const [key, value] of Object.entries(SERVICE_TRANSLATIONS)) {
    translated = translated.replace(key, value);
  }
  return translated;
}
