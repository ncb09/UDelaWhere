import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AboutContainer = styled.div`
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

const ContentCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Section = styled.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: #FFD200;
  font-size: 1.8em;
  margin-bottom: 15px;
  font-weight: 700;
`;

const Paragraph = styled.p`
  line-height: 1.7;
  font-size: 1.1em;
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Title>About UDelaWhere?</Title>
      <ContentCard>
        <Section>
          <SectionTitle>What is UDelaWhere?</SectionTitle>
          <Paragraph>
            UDelaWhere? is an interactive campus exploration game that helps you discover and learn about the University of Delaware campus locations through an engaging and fun gameplay experience.
          </Paragraph>
          <Paragraph>
            Whether you're a new student trying to familiarize yourself with the campus, a visitor looking to explore, or a UD veteran testing your knowledge, UDelaWhere? offers a unique way to engage with the university grounds.
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>How to Play</SectionTitle>
          <Paragraph>
            In Practice Mode, take your time to explore 360° views of campus locations and place your guess on the map. There's no time limit, allowing you to carefully study each location.
          </Paragraph>
          <Paragraph>
            Challenge Mode adds excitement with a 120-second time limit per location. Compete for points on the leaderboard by making quick, accurate guesses.
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>About the Developers</SectionTitle>
          <Paragraph>
            UDelaWhere? was created during the HenHack 2025 hackathon by a team of passionate University of Delaware students who wanted to make campus navigation more fun and interactive.
          </Paragraph>
        </Section>
      </ContentCard>
    </AboutContainer>
  );
};

export default About; 