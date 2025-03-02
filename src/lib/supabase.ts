import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anonymous key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeaderboardEntry {
  id?: number;
  username: string;
  score: number;
  created_at?: string;
}

// Function to get leaderboard data from Supabase
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  
  return data || [];
}

// Function to add a score to the leaderboard
export async function addScore(entry: Omit<LeaderboardEntry, 'id' | 'created_at'>): Promise<boolean> {
  // First check if username already exists
  const { data: existingUser } = await supabase
    .from('leaderboard')
    .select('id, score')
    .eq('username', entry.username)
    .single();
  
  // If user exists and has a higher score, don't update
  if (existingUser && existingUser.score >= entry.score) {
    return false;
  }
  
  // If user exists but has a lower score, update their score
  if (existingUser) {
    const { error } = await supabase
      .from('leaderboard')
      .update({ score: entry.score })
      .eq('id', existingUser.id);
    
    return !error;
  }
  
  // If user doesn't exist, insert new record
  const { error } = await supabase
    .from('leaderboard')
    .insert([entry]);
  
  return !error;
}

// Function to check if a username is already taken
export async function isUsernameTaken(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('username')
    .eq('username', username)
    .single();
  
  if (error) {
    // If error code is PGRST116, it means no rows were returned
    if (error.code === 'PGRST116') {
      return false; // Username is not taken
    }
    console.error('Error checking username:', error);
    throw error;
  }
  
  return !!data; // If data exists, username is taken
} 