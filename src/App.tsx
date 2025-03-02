import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

// Import your components (we'll create these next)
import Navbar from './components/Navbar';
import GameMode from './components/GameMode';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard'; 
import About from './components/About';

const HomePage = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;

  h1 {
    font-size: 3.5em;
    margin-bottom: 1em;
    color: #2196F3;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const GameModesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 40px;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <HomePage>
            <h1>UDelaWhere?</h1>
            <GameModesContainer>
              <GameMode
                title="Practice Mode"
                description="Take your time to explore and learn the campus. No time pressure, just pure exploration and learning."
                icon="🎓"
                mode="practice"
              />
              <GameMode
                title="Challenge Mode"
                description="Test your campus knowledge under pressure! 120 seconds per location. Can you beat the clock?"
                icon="⏱️"
                mode="challenge"
              />
            </GameModesContainer>
          </HomePage>
        } />
        <Route path="/game/:mode" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App; 