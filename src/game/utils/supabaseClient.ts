// Re-exports the existing Supabase client — no new connection created
import { supabase } from '../../../lib/supabase';
export { supabase };

export interface GameResultRow {
  id?: string;
  player_name: string;
  ending_type: 'A' | 'B' | 'C' | 'D';
  total_score: number;
  quality_score: number;
  cost_score: number;
  delivery_score: number;
  trust_score: number;
  played_at?: string;
}

export async function saveGameResult(result: Omit<GameResultRow, 'id' | 'played_at'>): Promise<void> {
  const { error } = await supabase.from('game_results').insert(result);
  if (error) console.error('saveGameResult error:', error.message);
}

export async function fetchRanking(limit = 10): Promise<GameResultRow[]> {
  const { data, error } = await supabase
    .from('game_results')
    .select('*')
    .order('total_score', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('fetchRanking error:', error.message);
    return [];
  }
  return (data as GameResultRow[]) ?? [];
}
