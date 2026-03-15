/**
 * Local fallback data for clinical protocols when Supabase is unavailable.
 */
export interface LocalProtocol {
  id: string;
  name: string;
  version: string;
  type: string;
  contentJson: Record<string, unknown>;
}

export async function getLocalFileProtocols(): Promise<LocalProtocol[]> {
  return [];
}
