import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const GameModeCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 20px 40px rgba(33, 150, 243, 0.2);

    &:before {
      opacity: 1;
    }

    h2 {
      transform: translateY(-5px);
      color: #1976D2;
    }

    p {
      transform: translateY(-3px);
      opacity: 0.9;
    }
  }
`;

const Title = styled.h2`
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #2196F3;
  transition: all 0.3s ease;
`;

const Description = styled.p`
  font-size: 1.2em;
  color: #666;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  max-width: 80%;
`;

const Icon = styled.div`
  font-size: 4em;
  margin-bottom: 30px;
  color: #2196F3;
  transition: all 0.3s ease;

  ${GameModeCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const StartButton = styled.button`
  padding: 15px 40px;
  font-size: 1.2em;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);

  &:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
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