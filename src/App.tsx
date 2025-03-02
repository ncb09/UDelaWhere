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
  min-height: 100vh;
  background-color: #001B3D;
  color: white;
  padding: 40px 20px;
  font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-align: center;

  h1 {
    font-size: 3.5em;
    margin-bottom: 0.8em;
    color: #FFD200;
    text-transform: uppercase;
    letter-spacing: 2px;
    -webkit-text-stroke: 1px black;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p.subtitle {
    font-size: 1.4em;
    margin-bottom: 2em;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const GameModesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
`;

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <HomePage>
            <h1>UDelaWhere??</h1>
            <p className="subtitle">
              Test your knowledge of the University of Delaware campus in this interactive geolocation game. 
              Explore 360° views of locations and try to pinpoint them on the map!
            </p>
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