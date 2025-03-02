import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

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

interface LeaderboardEntry {
  username: string;
  score: number;
  timestamp: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser] = useState<string | null>(() => localStorage.getItem('username'));

  useEffect(() => {
    // Load leaderboard data from localStorage
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
      const parsedLeaderboard = JSON.parse(storedLeaderboard);
      // Sort by score (highest first) and take top 10
      const sortedLeaderboard = parsedLeaderboard
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
        // Remove duplicates (keep highest score for each user)
        .filter((entry: LeaderboardEntry, index: number, self: LeaderboardEntry[]) =>
          index === self.findIndex((t) => t.username === entry.username)
        )
        .slice(0, 10);
      setLeaderboard(sortedLeaderboard);
    }
  }, []);

  return (
    <LeaderboardContainer>
      <Title>Challenge Mode Leaderboard</Title>
      <LeaderboardTable>
        <LeaderboardHeader>
          <div>Rank</div>
          <div>Player</div>
          <div>Score</div>
        </LeaderboardHeader>
        {leaderboard.map((entry, index) => (
          <LeaderboardRow 
            key={entry.username} 
            isCurrentUser={entry.username === currentUser}
          >
            <Rank rank={index + 1}>#{index + 1}</Rank>
            <Username>{entry.username}</Username>
            <Score>{entry.score}</Score>
          </LeaderboardRow>
        ))}
      </LeaderboardTable>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 