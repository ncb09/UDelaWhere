-- Create a table for storing leaderboard entries
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on username for faster lookups
CREATE INDEX IF NOT EXISTS leaderboard_username_idx ON leaderboard (username);

-- Create an index on score for faster sorting
CREATE INDEX IF NOT EXISTS leaderboard_score_idx ON leaderboard (score DESC);

-- Comment on the table and columns
COMMENT ON TABLE leaderboard IS 'Table for storing user high scores';
COMMENT ON COLUMN leaderboard.username IS 'Unique username for the player';
COMMENT ON COLUMN leaderboard.score IS 'Highest score achieved by the player';
COMMENT ON COLUMN leaderboard.created_at IS 'Timestamp when the score was first recorded';

-- Create a row level security policy to allow only reading of the leaderboard
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read the leaderboard (public access)
CREATE POLICY leaderboard_select_policy ON leaderboard FOR SELECT USING (true);

-- Only allow server-side inserts and updates (use service key in your application)
-- This ensures that scores cannot be manipulated by users
CREATE POLICY leaderboard_insert_policy ON leaderboard FOR INSERT WITH CHECK (false);
CREATE POLICY leaderboard_update_policy ON leaderboard FOR UPDATE USING (false);
CREATE POLICY leaderboard_delete_policy ON leaderboard FOR DELETE USING (false); 