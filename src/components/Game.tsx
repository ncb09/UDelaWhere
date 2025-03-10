import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled, { keyframes } from 'styled-components';
import L from 'leaflet';
import ImageViewer360 from './ImageViewer360';
import locationsData from '../data/locations.json';
import { addScore, LeaderboardEntry as SupabaseLeaderboardEntry, isUsernameTaken } from '../lib/supabase';
import { processLocationImages, getUDFunFact } from '../lib/gemini';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Button = styled.button`
  padding: 16px 40px;
  background: #FFD200;
  color: #00539F;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(255, 210, 0, 0.3);

  &:hover:not(:disabled) {
    background: #FFE04C;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 210, 0, 0.4);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 14px 30px;
    font-size: 16px;
  }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #001B3D;
  color: white;
  font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
`;

const Timer = styled.div`
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 27, 61, 0.85);
  padding: 15px 30px;
  border-radius: 20px;
  border: 2px solid rgba(255, 210, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 1001;
  animation: ${fadeIn} 0.5s ease-out;
  text-align: center;
  pointer-events: none;
  
  .time {
    font-size: 2.5em;
    font-weight: 800;
    color: #FFD200;
    letter-spacing: 2px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .label {
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
    margin-bottom: 5px;
  }

  @media (max-width: 768px) {
    top: 80px;
    padding: 10px 20px;
    
    .time {
      font-size: 2em;
    }
    
    .label {
      font-size: 0.8em;
    }
  }
`;

const GameStats = styled.div`
  position: fixed;
  top: 100px;
  right: 40px;
  background: rgba(0, 27, 61, 0.85);
  padding: 15px 30px;
  border-radius: 20px;
  border: 2px solid rgba(255, 210, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 1001;
  animation: ${fadeIn} 0.5s ease-out;
  pointer-events: none;

  .stat {
    text-align: right;
    margin: 8px 0;
  }

  .label {
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
  }

  .value {
    font-size: 1.4em;
    font-weight: 800;
    color: #FFD200;
    letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  @media (max-width: 768px) {
    top: 80px;
    right: 20px;
    padding: 10px 20px;
    
    .label {
      font-size: 0.8em;
    }
    
    .value {
      font-size: 1.2em;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  background: rgba(0, 27, 61, 0.85);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s ease;
  z-index: 1002;
  backdrop-filter: blur(5px);

  &:hover {
    background: #00539F;
  }
`;

const MapWrapper = styled.div<{ isExpanded: boolean; isSlightlyExpanded: boolean }>`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: ${props => {
    if (props.isExpanded) return 'calc(100% - 80px)';
    if (props.isSlightlyExpanded) return '750px';
    return '400px';
  }};
  height: ${props => {
    if (props.isExpanded) return 'calc(100vh - 300px)';
    if (props.isSlightlyExpanded) return '450px';
    return '250px';
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transform-origin: bottom right;
  border: 2px solid ${props => props.isExpanded ? '#FFD200' : 'rgba(255, 210, 0, 0.3)'};

  &:hover:not([data-expanded="true"]) {
    width: 500px;
    height: 320px;
    transform: translateZ(0);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  }

  ${CloseButton}, .leaflet-control-zoom {
    opacity: ${props => props.isExpanded ? 1 : 0};
    transform: ${props => props.isExpanded ? 'translateX(0)' : 'translateX(20px)'};
    transition: all 0.3s ease;
  }

  .leaflet-container {
    width: 100%;
    height: 100%;
    z-index: 1;
    background: #1a1a1a;
  }

  .leaflet-control-container {
    z-index: 2;
  }

  .leaflet-control-zoom {
    margin: 15px;
    
    a {
      background: rgba(0, 83, 159, 0.9);
      color: white;
      border: none;
      
      &:hover {
        background: #00539F;
      }
    }
  }
  
  @media (max-width: 768px) {
    bottom: 100px;
    right: 20px;
    width: ${props => {
      if (props.isExpanded) return 'calc(100% - 40px)';
      if (props.isSlightlyExpanded) return 'calc(100% - 40px)';
      return 'calc(100% - 40px)';
    }};
    height: ${props => {
      if (props.isExpanded) return '300px';
      if (props.isSlightlyExpanded) return '300px';
      return '200px';
    }};
    
    &:hover:not([data-expanded="true"]) {
      width: calc(100% - 40px);
      height: 250px;
    }
  }
`;

const ToggleMapSizeButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1002;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const ImageViewer = styled.div`
  flex: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  pointer-events: auto;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(0,27,61,0.9) 0%, rgba(0,27,61,0) 100%);
    pointer-events: none;
  }
`;

const ScoreOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 27, 61, 0.98);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2000;
  padding: 40px;
  backdrop-filter: blur(10px);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const ResultInfo = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 30px;
  animation: ${slideUp} 0.5s ease-out;

  h2 {
    color: #FFD200;
    font-size: 3em;
    margin-bottom: 0.5em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  p {
    font-size: 1.4em;
    margin: 0.8em 0;
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    
    h2 {
      font-size: 2.2em;
    }
    
    p {
      font-size: 1.1em;
    }
  }
`;

const ResultMapContainer = styled.div`
  width: 85%;
  height: 65%;
  margin: 30px 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 3px solid #FFD200;
  animation: ${slideUp} 0.7s ease-out;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, rgba(0,83,159,0.4) 0%, rgba(0,83,159,0) 100%);
    pointer-events: none;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    width: 95%;
    height: 45%;
    margin: 15px 0;
  }
`;

const ScoreText = styled.div<{ score: number }>`
  font-size: 3.5em;
  font-weight: 800;
  color: #FFD200;
  margin: 25px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.8s ease-out;
  letter-spacing: 2px;
`;

const UserModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 27, 61, 0.98);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 3000;
  backdrop-filter: blur(10px);
`;

const UserForm = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  border: 2px solid rgba(255, 210, 0, 0.3);
  max-width: 400px;
  width: 90%;

  h2 {
    color: #FFD200;
    font-size: 2em;
    margin-bottom: 1em;
  }

  p {
    margin-bottom: 2em;
    opacity: 0.8;
    line-height: 1.6;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 20px;
  border: 2px solid rgba(255, 210, 0, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FFD200;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ErrorText = styled.div`
  color: #FF6B6B;
  font-size: 0.9em;
  margin-bottom: 15px;
  text-align: left;
  animation: ${slideUp} 0.3s ease-out;
`;

const GameEndScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 27, 61, 0.98);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(10px);
`;

const EndScreenContent = styled.div`
  text-align: center;
  animation: ${slideUp} 0.7s ease-out;
  max-width: 600px;
  width: 90%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 2px solid rgba(255, 210, 0, 0.3);

  h1 {
    color: #FFD200;
    font-size: 3.5em;
    margin-bottom: 0.5em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  p {
    font-size: 1.4em;
    margin: 0.8em 0;
    opacity: 0.9;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: center;
  }
`;

const NavigationButton = styled(Button)`
  min-width: 200px;
  
  @media (max-width: 768px) {
    min-width: 80%;
  }
`;

const GuessButton = styled(Button)`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 18px 50px;
  font-size: 20px;
  z-index: 1500;
  background: rgba(255, 210, 0, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  min-width: 220px;
  text-align: center;

  &:hover:not(:disabled) {
    background: #FFD200;
    transform: translateX(-50%) translateY(-4px);
    box-shadow: 0 8px 30px rgba(255, 210, 0, 0.4);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-50%);
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    padding: 16px 30px;
    font-size: 16px;
    min-width: 180px;
    width: calc(100% - 40px);
    max-width: 300px;
  }
  
  /* iOS Safari specific fix */
  @supports (-webkit-touch-callout: none) {
    /* Fix for iOS Safari's bottom bar */
    @media (max-width: 768px) {
      bottom: 30px; 
      padding-bottom: 16px;
    }
  }
`;

const ProcessingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 27, 61, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  backdrop-filter: blur(10px);
  text-align: center;
  padding: 40px;
  color: white;
`;

const ProcessingSpinner = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  border: 6px solid rgba(255, 210, 0, 0.3);
  border-radius: 50%;
  border-top-color: #FFD200;
  animation: spin 1.5s ease-in-out infinite;
  margin-bottom: 30px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ProcessingTitle = styled.h2`
  color: #FFD200;
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const ProcessingInfo = styled.p`
  font-size: 1.2em;
  max-width: 600px;
  margin: 0 auto 15px;
  line-height: 1.6;
  opacity: 0.9;
`;

const DebugInfo = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  max-width: 800px;
  text-align: left;
  font-family: monospace;
  font-size: 0.9em;
  max-height: 200px;
  overflow-y: auto;
  
  h3 {
    color: #FFD200;
    margin-bottom: 10px;
  }
  
  p {
    margin: 5px 0;
    line-height: 1.4;
  }
`;

const FunFactContainer = styled.div`
  background-color: rgba(255, 210, 0, 0.1);
  border-left: 4px solid #FFD200;
  padding: 15px;
  margin: 15px 0;
  border-radius: 0 8px 8px 0;
  position: relative;
`;

const FunFactText = styled.p`
  margin: 0;
  font-style: italic;
  line-height: 1.4;
`;

const FunFactIcon = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  background: #FFD200;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

interface LeaderboardEntry {
  username: string;
  score: number;
  timestamp: number;
}

interface Location {
  id: string;
  image: string;
  coordinates: [number, number];
  name: string;
  recognizability?: number; // 1-10 score from Gemini
}

interface GameState {
  currentRound: number;
  score: number;
  selectedLocation: [number, number] | null;
  timeRemaining: number | null;
  locations: Location[];
  usedLocationIds: string[];
  showingResult: boolean;
  lastGuessScore: number;
  lastGuessDistance: number;
  pastGuesses: Array<{
    guessed: [number, number];
    actual: [number, number];
    round: number;
    recognizability?: number;
  }>;
  username: string | null;
  showUsernameModal: boolean;
  gameEnded: boolean;
  locationsProcessed: boolean;
  funFact: string;
  isLoadingFunFact: boolean;
}

// Add this new component for handling map clicks
const MapEvents: React.FC<{ onClick: (e: L.LeafletMouseEvent) => void }> = ({ onClick }) => {
  const map = useMap();
  useEffect(() => {
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, onClick]);
  return null;
};

// Add this new hook for handling map resize
const MapResizer: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    
    const container = map.getContainer();
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
};

// Function to select random locations for the game
const getRandomLocations = (count: number): Location[] => {
  // Make a copy of the locations array to avoid modifying the original
  const availableLocations = [...(locationsData as Location[])];
  const selectedLocations: Location[] = [];
  const usedIndexes: number[] = [];
  
  // Check if we have enough locations
  if (availableLocations.length < count) {
    console.warn(`Not enough locations available. Requested ${count}, but only have ${availableLocations.length}`);
    return availableLocations; // Return all available if not enough
  }
  
  // Select random locations
  for (let i = 0; i < count; i++) {
    // Find an unused location index
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * availableLocations.length);
    } while (usedIndexes.includes(randomIndex));
    
    // Add to selected locations and mark as used
    selectedLocations.push(availableLocations[randomIndex]);
    usedIndexes.push(randomIndex);
  }
  
  return selectedLocations;
};

const Game: React.FC = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  
  // Initialize game with random locations
  const [gameState, setGameState] = useState<GameState>(() => {
    const gameLocations = getRandomLocations(5);
    return {
      currentRound: 1,
      score: 0,
      selectedLocation: null,
      timeRemaining: mode === 'challenge' ? 120 : null,
      locations: gameLocations,
      usedLocationIds: gameLocations.map(loc => loc.id),
      showingResult: false,
      lastGuessScore: 0,
      lastGuessDistance: 0,
      pastGuesses: [],
      username: localStorage.getItem('username'),
      showUsernameModal: false,
      gameEnded: false,
      locationsProcessed: false,
      funFact: "",
      isLoadingFunFact: false
    };
  });

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSlightlyExpanded, setIsSlightlyExpanded] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    // Check if we need to show the username modal
    if (mode === 'challenge' && !gameState.username) {
      setGameState(prev => ({ ...prev, showUsernameModal: true }));
    }
  }, [mode, gameState.username]);

  // Process locations with Gemini to get recognizability scores
  useEffect(() => {
    async function processLocations() {
      if (!gameState.locationsProcessed) {
        try {
          console.log("Processing locations with Gemini...");
          // Display debugging info in the console about the image paths
          gameState.locations.forEach((loc, index) => {
            const imageUrl = `${window.location.origin}${loc.image}px.jpg`;
            console.log(`Debug: Location ${index + 1} (${loc.id}): ${imageUrl}`);
          });
          
          const processedLocations = await processLocationImages(gameState.locations);
          setGameState(prevState => ({
            ...prevState,
            locations: processedLocations,
            locationsProcessed: true
          }));
          console.log("Locations processed:", processedLocations);
        } catch (error) {
          console.error("Error processing locations with Gemini:", error);
          // Still mark as processed to avoid infinite loops, but log the error
          setGameState(prevState => ({
            ...prevState,
            locationsProcessed: true
          }));
        }
      }
    }
    
    processLocations();
  }, [gameState.locations, gameState.locationsProcessed]);

  const handleUsernameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const usernameInput = event.currentTarget.elements.namedItem('username') as HTMLInputElement;
    const username = usernameInput.value.trim();
    
    if (!username) {
      setUsernameError('Username cannot be empty');
      return;
    }

    try {
      setIsCheckingUsername(true);
      setUsernameError(null);
      
      // Check if username already exists in Supabase
      const isTaken = await isUsernameTaken(username);
      
      if (isTaken) {
        setUsernameError('This username is already taken. Please choose another one.');
        setIsCheckingUsername(false);
        return;
      }
      
      // Username is available, save it
      localStorage.setItem('username', username);
      setGameState(prev => ({ 
        ...prev, 
        username,
        showUsernameModal: false 
      }));
      setIsCheckingUsername(false);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('An error occurred. Please try again.');
      setIsCheckingUsername(false);
    }
  };

  const submitScore = async (finalScore: number) => {
    if (mode === 'challenge' && gameState.username) {
      // Keep the localStorage version for backward compatibility
      const leaderboardEntry: LeaderboardEntry = {
        username: gameState.username,
        score: finalScore,
        timestamp: Date.now()
      };

      // Get existing leaderboard
      const existingLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
      
      // Add new score
      existingLeaderboard.push(leaderboardEntry);
      
      // Sort by score (highest first)
      const sortedLeaderboard = existingLeaderboard
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
        // Remove duplicates (keep highest score for each user)
        .filter((entry: LeaderboardEntry, index: number, self: LeaderboardEntry[]) =>
          index === self.findIndex((t) => t.username === entry.username)
        )
        .slice(0, 10);

      // Save back to localStorage
      localStorage.setItem('leaderboard', JSON.stringify(sortedLeaderboard));
      
      // Submit to Supabase
      try {
        await addScore({
          username: gameState.username,
          score: finalScore
        });
      } catch (error) {
        console.error('Error submitting score to Supabase:', error);
      }
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!gameState.showingResult) {
      setGameState(prev => ({
        ...prev,
        selectedLocation: [e.latlng.lat, e.latlng.lng],
      }));
    }
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 3959; // Earth's radius in miles
    const φ1 = point1[0] * Math.PI / 180;
    const φ2 = point2[0] * Math.PI / 180;
    const Δφ = (point2[0] - point1[0]) * Math.PI / 180;
    const Δλ = (point2[1] - point1[1]) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    // Return distance in feet (multiply miles by 5280)
    return R * c * 5280;
  };

  const handleGuess = () => {
    if (!gameState.selectedLocation) return;

    const currentLocation = gameState.locations[gameState.currentRound - 1];
    const distance = calculateDistance(gameState.selectedLocation, currentLocation.coordinates);
    
    // Get recognizability score (default to 5 if not available)
    const recognizability = currentLocation.recognizability || 5;
    
    // Calculate distance threshold based on recognizability
    // Higher recognizability = stricter threshold
    // For recognizability 10, max distance for points is 500 feet
    // For recognizability 1, max distance for points is 2000 feet
    const maxDistanceForPoints = 2000 - ((recognizability - 1) * 150);
    
    // New scoring system:
    // - Perfect score (5000) if distance is very small
    // - Linear decrease to 0 as distance approaches maxDistanceForPoints
    // - 0 points if distance exceeds maxDistanceForPoints
    let points = 0;
    
    if (distance <= maxDistanceForPoints) {
      // Calculate the minimum distance for perfect score based on recognizability
      const minDistanceForPerfect = 50 + (recognizability * 5); // 55-100 feet depending on difficulty
      
      if (distance <= minDistanceForPerfect) {
        // Perfect score
        points = 5000;
      } else {
        // Linear decrease from 5000 to 0
        const ratio = 1 - ((distance - minDistanceForPerfect) / (maxDistanceForPoints - minDistanceForPerfect));
        points = Math.round(5000 * Math.max(0, ratio));
      }
    }
    
    // Round to nearest 10 for cleaner scores
    points = Math.round(points / 10) * 10;

    const newGuess = {
      guessed: gameState.selectedLocation as [number, number],
      actual: currentLocation.coordinates,
      round: gameState.currentRound,
      recognizability: recognizability // Store for reference
    };

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      showingResult: true,
      lastGuessScore: points,
      lastGuessDistance: Number(distance.toFixed(0)),
      pastGuesses: [...prev.pastGuesses, newGuess],
      isLoadingFunFact: true
    }));

    // Fetch a fun fact about the location or general UD fact
    fetchFunFact(currentLocation.name);
  };

  const fetchFunFact = async (locationName?: string) => {
    try {
      const funFact = await getUDFunFact(locationName);
      setGameState(prev => ({
        ...prev,
        funFact,
        isLoadingFunFact: false
      }));
    } catch (error) {
      console.error("Error fetching fun fact:", error);
      setGameState(prev => ({
        ...prev,
        funFact: "Did you know? The University of Delaware's colors are blue and gold, representing the colors of the state's flag.",
        isLoadingFunFact: false
      }));
    }
  };

  const handleNextRound = () => {
    if (gameState.currentRound === 5) {
      // Game is complete, submit score and get a final fun fact
      submitScore(gameState.score);
      setGameState(prev => ({
        ...prev,
        gameEnded: true,
        showingResult: false,
        isLoadingFunFact: true
      }));
      
      // Get a general fun fact about UD for the end screen
      fetchFunFact();
      
      return;
    }
    
    // Reset map size to default small size
    setIsMapExpanded(false);
    setIsSlightlyExpanded(false);
    
    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      selectedLocation: null,
      showingResult: false,
      timeRemaining: mode === 'challenge' ? 120 : null
    }));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (mode === 'challenge' && gameState.timeRemaining !== null) {
      // Clear any existing timer
      if (timer) clearInterval(timer);
      
      timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining === null || prev.timeRemaining <= 0) {
            clearInterval(timer);
            // Auto-submit guess when time runs out
            if (!prev.showingResult && prev.selectedLocation) {
              handleGuess();
            }
            return prev;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [mode, gameState.currentRound, gameState.timeRemaining]);

  const handleMapToggle = () => {
    setIsMapExpanded(!isMapExpanded);
    // When fully expanding, ensure we're not in the slightly expanded state
    if (!isMapExpanded) {
      setIsSlightlyExpanded(false);
    }
  };

  const handleSlightToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSlightlyExpanded(!isSlightlyExpanded);
    // Make sure we're not in full expanded mode
    if (isMapExpanded) {
      setIsMapExpanded(false);
    }
  };

  return (
    <GameContainer>
      {gameState.gameEnded ? (
        <GameEndScreen>
          <EndScreenContent>
            <h1>Game Complete!</h1>
            <p>Your Final Score: {gameState.score}</p>
            <p>Maximum Possible: 25,000</p>
            <p>Accuracy: {Math.round((gameState.score / 25000) * 100)}%</p>
            {gameState.isLoadingFunFact ? (
              <FunFactContainer>
                <FunFactIcon>💡</FunFactIcon>
                <FunFactText>Loading fun fact...</FunFactText>
              </FunFactContainer>
            ) : (
              <FunFactContainer>
                <FunFactIcon>💡</FunFactIcon>
                <FunFactText>{gameState.funFact}</FunFactText>
              </FunFactContainer>
            )}
            <ButtonGroup>
              <NavigationButton onClick={() => navigate('/')}>
                Home
              </NavigationButton>
              <NavigationButton onClick={() => navigate('/leaderboard')}>
                Leaderboard
              </NavigationButton>
            </ButtonGroup>
          </EndScreenContent>
        </GameEndScreen>
      ) : (
        <>
          {!gameState.locationsProcessed && (
            <ProcessingOverlay>
              <ProcessingSpinner />
              <ProcessingTitle>Analyzing Locations</ProcessingTitle>
              <ProcessingInfo>
                Gemini AI is analyzing the recognizability of each location...
              </ProcessingInfo>
              <ProcessingInfo>
                This may take a few moments. Each location is being evaluated for how easily identifiable it is.
              </ProcessingInfo>
              <DebugInfo>
                <h3>Debug Information</h3>
                <p>URL Format: {window.location.origin + gameState.locations[0]?.image}px.jpg</p>
                <p>API Key Present: {process.env.REACT_APP_GEMINI_API_KEY ? "Yes" : "No"}</p>
                <p>Locations to Process: {gameState.locations.length}</p>
                <p>Current Environment: {process.env.NODE_ENV}</p>
              </DebugInfo>
            </ProcessingOverlay>
          )}
          <UserModal isVisible={gameState.showUsernameModal}>
            <UserForm>
              <h2>Welcome to Challenge Mode</h2>
              <p>Please enter your username to compete on the leaderboard.</p>
              <form onSubmit={handleUsernameSubmit}>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  maxLength={20}
                  required
                  disabled={isCheckingUsername}
                />
                {usernameError && <ErrorText>{usernameError}</ErrorText>}
                <Button type="submit" disabled={isCheckingUsername}>
                  {isCheckingUsername ? 'Checking...' : 'Start Game'}
                </Button>
              </form>
            </UserForm>
          </UserModal>
          {mode === 'challenge' && gameState.timeRemaining !== null && (
            <Timer>
              <div className="label">Time Remaining</div>
              <div className="time">
                {Math.floor(gameState.timeRemaining / 60)}:
                {(gameState.timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </Timer>
          )}
          <GameStats>
            <div className="stat">
              <div className="label">Round</div>
              <div className="value">{gameState.currentRound}/5</div>
            </div>
            <div className="stat">
              <div className="label">Total Score</div>
              <div className="value">{gameState.score}</div>
            </div>
          </GameStats>
          <ImageViewer>
            <ImageViewer360 objPath={gameState.locations[gameState.currentRound - 1].image} />
          </ImageViewer>

          <MapWrapper 
            isExpanded={isMapExpanded}
            isSlightlyExpanded={isSlightlyExpanded}
            data-expanded={isMapExpanded || isSlightlyExpanded ? "true" : "false"}
            onClick={(e) => {/* Prevent map from expanding to fullscreen when clicked */
              e.stopPropagation();
            }}
          >
            <CloseButton 
              onClick={(e) => {
                e.stopPropagation();
                if (isMapExpanded) handleMapToggle();
              }}
              style={{ opacity: isMapExpanded ? 1 : 0 }}
            >
              ×
            </CloseButton>
            <ToggleMapSizeButton
              onClick={handleSlightToggle}
              style={{ display: isMapExpanded ? 'none' : 'flex' }}
            >
              {isSlightlyExpanded ? '⊟' : '⊞'}
            </ToggleMapSizeButton>
            <MapContainer
              center={[39.686757, -75.755243] as [number, number]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              maxZoom={19}
              minZoom={13}
              maxBounds={[
                [39.666, -75.78],  // Expanded southwest corner
                [39.706, -75.73]   // Expanded northeast corner
              ]}
              maxBoundsViscosity={0.8}
              preferCanvas={true}
              zoomControl={true}
              scrollWheelZoom={true}
              dragging={true}
              doubleClickZoom={true}
            >
              <MapEvents onClick={handleMapClick} />
              <MapResizer />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxNativeZoom={19}
                maxZoom={19}
                keepBuffer={8}
                updateWhenZooming={false}
                updateWhenIdle={true}
              />
              {gameState.selectedLocation && (
                <Marker position={gameState.selectedLocation} />
              )}
              {gameState.pastGuesses.map((guess, index) => (
                <React.Fragment key={index}>
                  <Marker 
                    position={guess.actual}
                    icon={new L.Icon({
                      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41]
                    })}
                  >
                    <Popup>Round {guess.round}</Popup>
                  </Marker>
                  <Marker position={guess.guessed}>
                    <Popup>Your guess (Round {guess.round})</Popup>
                  </Marker>
                  <Polyline 
                    positions={[guess.guessed, guess.actual]}
                    color="#FF4444"
                    weight={2}
                    opacity={0.5}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </MapWrapper>

          <ScoreOverlay isVisible={gameState.showingResult}>
            <ResultInfo>
              <h2>Round {gameState.currentRound} Result</h2>
              <p>Distance: {gameState.lastGuessDistance} feet</p>
              <p>Location Recognizability: {
                gameState.locations[gameState.currentRound - 1]?.recognizability 
                  ? `${gameState.locations[gameState.currentRound - 1].recognizability}/10`
                  : 'Processing...'
              }</p>
              <ScoreText score={gameState.lastGuessScore}>
                +{gameState.lastGuessScore} points
              </ScoreText>
              <p>Total Score: {gameState.score}</p>
            </ResultInfo>
            
            <ResultMapContainer>
              <MapContainer
                center={gameState.locations[gameState.currentRound - 1].coordinates}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
                maxZoom={19}
                minZoom={14}
                preferCanvas={true}
              >
                <MapResizer />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  maxNativeZoom={19}
                  maxZoom={19}
                  keepBuffer={8}
                  updateWhenZooming={false}
                  updateWhenIdle={true}
                />
                {gameState.selectedLocation && (
                  <>
                    <Marker position={gameState.selectedLocation}>
                      <Popup>Your guess</Popup>
                    </Marker>
                    <Marker 
                      position={gameState.locations[gameState.currentRound - 1].coordinates}
                      icon={new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41]
                      })}
                    >
                      <Popup>Actual location</Popup>
                    </Marker>
                    <Polyline 
                      positions={[
                        gameState.selectedLocation,
                        gameState.locations[gameState.currentRound - 1].coordinates
                      ]}
                      color="#FF4444"
                      weight={3}
                      opacity={0.8}
                    />
                  </>
                )}
              </MapContainer>
            </ResultMapContainer>
            
            {gameState.isLoadingFunFact ? (
              <FunFactContainer>
                <FunFactIcon>💡</FunFactIcon>
                <FunFactText>Loading fun fact...</FunFactText>
              </FunFactContainer>
            ) : (
              <FunFactContainer>
                <FunFactIcon>💡</FunFactIcon>
                <FunFactText>{gameState.funFact}</FunFactText>
              </FunFactContainer>
            )}
            
            <Button onClick={handleNextRound}>
              Next Round
            </Button>
          </ScoreOverlay>

          <GuessButton
            onClick={gameState.showingResult ? handleNextRound : handleGuess}
            disabled={!gameState.showingResult && !gameState.selectedLocation}
          >
            {gameState.showingResult ? 'Next Round' : 'Confirm Guess'}
          </GuessButton>
        </>
      )}
    </GameContainer>
  );
};

export default Game; 