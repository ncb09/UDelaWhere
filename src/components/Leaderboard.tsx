import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getLeaderboard, LeaderboardEntry } from '../lib/supabase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LeaderboardContainer = styled.div`
  min-height: 100vh;
  background-color: #001B3D;
  color: white;
  padding: 40px;
  font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h1`
  color: #FFD200;
  font-size: 3em;
  text-align: center;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const LeaderboardTable = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`;

const LeaderboardHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  padding: 20px;
  background: rgba(0, 83, 159, 0.5);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(255, 210, 0, 0.3);
`;

const LeaderboardRow = styled.div<{ isCurrentUser: boolean }>`
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  padding: 20px;
  transition: all 0.3s ease;
  background: ${props => props.isCurrentUser ? 'rgba(255, 210, 0, 0.1)' : 'transparent'};
  border-left: ${props => props.isCurrentUser ? '4px solid #FFD200' : '4px solid transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const Rank = styled.div<{ rank: number }>`
  font-weight: 800;
  color: ${props => {
    if (props.rank === 1) return '#FFD200';
    if (props.rank === 2) return '#C0C0C0';
    if (props.rank === 3) return '#CD7F32';
    return 'white';
  }};
`;

const Score = styled.div`
  font-weight: 700;
  color: #FFD200;
  text-align: right;
`;

const Username = styled.div`
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 210, 0, 0.3);
  border-radius: 50%;
  border-top-color: #FFD200;
  animation: spin 1s ease-in-out infinite;
  margin: 30px auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #FF6B6B;
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  font-weight: 500;
`;

const NoDataMessage = styled.div`
  text-align: center;
  margin: 30px 0;
  padding: 40px 20px;
  opacity: 0.7;
  font-size: 1.2em;
`;

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser] = useState<string | null>(() => localStorage.getItem('username'));

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <LeaderboardContainer>
      <Title>Challenge Mode Leaderboard</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <div>Loading leaderboard data...</div>
        </div>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : leaderboard.length === 0 ? (
        <NoDataMessage>
          No scores on the leaderboard yet. Be the first to play and submit your score!
        </NoDataMessage>
      ) : (
        <LeaderboardTable>
          <LeaderboardHeader>
            <div>Rank</div>
            <div>Player</div>
            <div>Score</div>
          </LeaderboardHeader>
          {leaderboard.map((entry, index) => (
            <LeaderboardRow 
              key={entry.id || index} 
              isCurrentUser={entry.username === currentUser}
            >
              <Rank rank={index + 1}>#{index + 1}</Rank>
              <Username>{entry.username}</Username>
              <Score>{entry.score}</Score>
            </LeaderboardRow>
          ))}
        </LeaderboardTable>
      )}
    </LeaderboardContainer>
  );
};

export default Leaderboard; 