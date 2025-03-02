import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #001B3D;
  padding: 1rem;
  color: white;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 480px) {
    padding: 0 10px;
    flex-wrap: wrap;
  }
`;

const Logo = styled(Link)`
  color: #FFD200;
  text-decoration: none;
  font-size: 28px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  -webkit-text-stroke: 1px black;
  text-shadow: 
    0 2px 4px rgba(0,0,0,0.5), 
    0 0 10px rgba(255, 210, 0, 0.3);
  position: relative;
  display: inline-block;
  transition: transform 0.2s ease, text-shadow 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    text-shadow: 0 4px 8px rgba(0,0,0,0.6), 0 0 15px rgba(255, 210, 0, 0.5);
  }
  
  /* Creates a subtle 3D effect */
  &::after {
    content: 'UDelaWhere??';
    position: absolute;
    left: 2px;
    top: 2px;
    color: rgba(0, 27, 61, 0.6);
    -webkit-text-stroke: 0;
    z-index: -1;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
    
    &::after {
      left: 1px;
      top: 1px;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition: color 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    color: #FFD200;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Navbar: React.FC = () => {
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">UDelaWhere??</Logo>
        <NavLinks>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/about">About</NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;