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
`;

const Logo = styled(Link)`
  color: #FFD200;
  text-decoration: none;
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
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
`;

const Navbar: React.FC = () => {
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">UDelaWhere?</Logo>
        <NavLinks>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/about">About</NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 