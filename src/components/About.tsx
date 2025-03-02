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
  font-style: italic;
  -webkit-text-stroke: 1px black;
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

const DeveloperList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const DeveloperCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CenteredCard = styled(DeveloperCard)`
  grid-column: 1 / -1;
  max-width: 250px;
  margin: 0 auto;
`;

const DeveloperName = styled.h3`
  color: #FFD200;
  margin-bottom: 5px;
  font-size: 1.2em;
`;

const DeveloperTitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9em;
  margin-bottom: 10px;
  font-style: italic;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
`;

const SocialLink = styled.a`
  color: white;
  font-size: 24px;
  transition: color 0.2s;
  
  &:hover {
    color: #FFD200;
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Title>About UDelaWhere??</Title>
      <ContentCard>
        <Section>
          <SectionTitle>What is UDelaWhere??</SectionTitle>
          <Paragraph>
            UDelaWhere?? is an interactive campus exploration game that helps you discover and learn about the University of Delaware campus locations through an engaging and fun gameplay experience.
          </Paragraph>
          <Paragraph>
            Whether you're a new student trying to familiarize yourself with the campus, a visitor looking to explore, or a UD veteran testing your knowledge, UDelaWhere?? offers a unique way to engage with the university grounds.
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
            UDelaWhere?? was created during the HenHack 2025 hackathon by a team of passionate University of Delaware students who wanted to make campus navigation more fun and interactive.
          </Paragraph>
          
          <DeveloperList>
            <DeveloperCard>
              <DeveloperName>Nathaniel Black</DeveloperName>
              <DeveloperTitle>Developer</DeveloperTitle>
              <SocialLinks>
                <SocialLink href="https://github.com/ncb09" target="_blank" title="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://www.linkedin.com/in/nathaniel-black-ab8a19329/" target="_blank" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </SocialLink>
              </SocialLinks>
            </DeveloperCard>
            
            <DeveloperCard>
              <DeveloperName>Marcos Diaz Vazquez</DeveloperName>
              <DeveloperTitle>Developer</DeveloperTitle>
              <SocialLinks>
                <SocialLink href="https://github.com/marcosdiazvazquez" target="_blank" title="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://www.linkedin.com/in/marcos-diaz-vazquez/" target="_blank" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </SocialLink>
              </SocialLinks>
            </DeveloperCard>
            
            <DeveloperCard>
              <DeveloperName>Dhruv Patel</DeveloperName>
              <DeveloperTitle>Developer</DeveloperTitle>
              <SocialLinks>
                <SocialLink href="https://github.com/rkdhruv" target="_blank" title="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://www.linkedin.com/in/rkdhruv/" target="_blank" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </SocialLink>
              </SocialLinks>
            </DeveloperCard>
            
            <CenteredCard>
              <DeveloperName>Anthony Baker-Espejo</DeveloperName>
              <DeveloperTitle>User Advocate</DeveloperTitle>
              <SocialLinks>
                <SocialLink href="https://www.linkedin.com/in/abespejo/" target="_blank" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </SocialLink>
              </SocialLinks>
            </CenteredCard>
          </DeveloperList>
        </Section>
      </ContentCard>
    </AboutContainer>
  );
};

export default About; 