import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import logo from '../img/logo.svg'

const HEADER_HEIGHT = 40
const MOBILE_WIDTH = 624

export const Main = styled.main`
  flex: 1;
  overflow-x: hidden;
  max-width: 1000px;
  padding: calc(${HEADER_HEIGHT}px + 48px) 48px 48px;
  
  @media(max-width: ${MOBILE_WIDTH}px) {
    max-width: 100%;
    padding: calc(${HEADER_HEIGHT}px + 24px) 12px 24px;
  }
`

export const MainFullWidth = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: calc(${HEADER_HEIGHT}px + 24px) 0 0;
  height: 100vh;
  box-sizing: border-box;
`

export const Section = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const Layout = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100vw;
`

interface HeaderProps {
  title?: string,
  darkMode?: boolean,
  fullWidth?: boolean
}

export function Header({ title = 'Abra', darkMode, fullWidth }: HeaderProps) {
  return (
    <HeaderWrapper dark={!!darkMode}>
      <Container fullWidth={!!fullWidth}>
        <LogoWrapper>
          {!fullWidth && <LogoImg src={logo} alt="Abra Language Logo"/>}
          <Title to="/" activeClassName="">{title}</Title>
        </LogoWrapper>

        <Navigation darkMode={darkMode}/>
      </Container>
    </HeaderWrapper>
  )
}

function Navigation({ darkMode }: { darkMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: MOBILE_WIDTH })

  const onClick = () => setIsOpen(false)
  const nav = (
    <Nav isMobile={isMobile} dark={darkMode}>
      <NavItemLink exact activeClassName="active" to="/" onClick={onClick}>Home</NavItemLink>
      <NavItemLink exact activeClassName="active" to="/docs" onClick={onClick}>Documentation</NavItemLink>
      <NavItemLink exact activeClassName="active" to="/try" onClick={onClick}>Try It Out</NavItemLink>
      <NavItem href="https://github.com/kengorab/abra-lang" target="_blank">Github</NavItem>
    </Nav>
  )

  if (isMobile) {
    return (
      <div style={{ position: 'relative' }}>
        <NavItem href="#" onClick={() => setIsOpen(!isOpen)}>
          <svg viewBox="0 0 10 8" width="24">
            <path d="M1 1h8 M1 4h8 M1 7h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </NavItem>

        {isOpen && nav}
      </div>
    )
  }

  return nav
}

const Container = styled.div<{ fullWidth: boolean }>`
  ${({ fullWidth }) => !fullWidth && 'max-width: 1200px'};
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderWrapper = styled.header<{ dark: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  height: ${HEADER_HEIGHT}px;
  background-color: ${({ dark }) => dark ? '#445f6f' : '#fff5c2'};
  ${({ dark }) => !dark && 'box-shadow: 0 2px 4px #654b472b'};
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  
  a {
    ${({ dark }) => dark && 'color: #c7c8e2 !important'};
    
    &:hover {
      ${({ dark }) => dark && 'color: #f7ece9 !important'};
    }
  }
  
  @media(max-width: ${MOBILE_WIDTH}px) {
    padding: 12px;
  }
`

const Nav = styled.nav<{ dark?: boolean, isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${({ isMobile, dark }) => isMobile && `
    flex-direction: column;
    position: fixed;
    top: ${HEADER_HEIGHT + 24}px;
    left: 0;
    right: 0;
    background: ${dark ? '#364c58' : '#e2d7a4'};
    padding: 12px;
    
    a {
      margin: 6px;
    }
  `}
`

const NavItemLink = styled(NavLink)`
  margin: 0 12px;
  font-size: 16px;
`

const NavItem = styled.a`
  margin: 0 12px;
  font-size: 16px;
`

const LogoWrapper = styled.aside`
  display: flex;
  align-items: center;
`

const LogoImg = styled.img`
  width: 41px;
  height: 36px;
  
  @media(max-width: ${MOBILE_WIDTH}px) {
    transform: scale(0.7);
  }
`

const Title = styled(NavItemLink)`
  color: #925742;
  font-size: 1.5rem;
  font-family: "Roboto Slab", sans-serif;
  
  @media(max-width: ${MOBILE_WIDTH}px) {
    margin: 0;
  }
`
