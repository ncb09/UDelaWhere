import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const GameModeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 40px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 210, 0, 0.1);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 210, 0, 0.1), rgba(0, 83, 159, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 210, 0, 0.3);

    &:before {
      opacity: 1;
    }

    h2 {
      transform: translateY(-5px);
      color: #FFD200;
    }

    p {
      transform: translateY(-3px);
      opacity: 0.9;
    }
  }
  
  @media (max-width: 480px) {
    min-height: 350px;
    padding: 30px 20px;
    
    &:hover {
      transform: translateY(-10px) scale(1.01);
    }
  }
`;

const Title = styled.h2`
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #FFD200;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 480px) {
    font-size: 2.2em;
    margin-bottom: 15px;
  }
`;

const Description = styled.p`
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  max-width: 80%;
  
  @media (max-width: 480px) {
    font-size: 1em;
    margin-bottom: 25px;
    max-width: 95%;
  }
`;

const Icon = styled.div`
  font-size: 4em;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  ${GameModeCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
  
  @media (max-width: 480px) {
    font-size: 3.5em;
    margin-bottom: 20px;
  }
`;

const StartButton = styled.button`
  padding: 15px 40px;
  font-size: 1.2em;
  background: #FFD200;
  color: #00539F;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(255, 210, 0, 0.3);

  &:hover {
    background: #FFE04C;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 210, 0, 0.4);
  }
  
  @media (max-width: 480px) {
    padding: 12px 30px;
    font-size: 1.1em;
  }
`;

interface GameModeProps {
  title: string;
  description: string;
  icon: string;
  mode: string;
}

const GameMode: React.FC<GameModeProps> = ({ title, description, icon, mode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${mode}`);
  };

  return (
    <GameModeCard onClick={handleClick}>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <StartButton>Start Game</StartButton>
    </GameModeCard>
  );
};

export default GameMode; 