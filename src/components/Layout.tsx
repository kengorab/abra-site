import * as React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../logo.svg'

const HEADER_HEIGHT = 40

export const Main = styled.main`
  flex: 1;
  max-width: 1000px;
  padding: calc(${HEADER_HEIGHT}px + 48px) 48px 48px;
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
`

export function Header() {
  return (
    <HeaderWrapper>
      <Container>
        <LogoWrapper>
          <LogoImg src={logo} alt="Abra Language Logo"/>
          <Title to="/" activeClassName="">Abra</Title>
        </LogoWrapper>
        <Nav>
          <NavItemLink exact activeClassName="active" to="/">Home</NavItemLink>
          {/*<NavItem href="/">Getting Started</NavItem>*/}
          <NavItemLink exact activeClassName="active" to="/docs">Documentation</NavItemLink>
          {/*<NavItemLink exact activeClassName="active" to="/try">Try It Out</NavItemLink>*/}
          <NavItem href="https://github.com/kengorab/abra-lang" target="_blank">Github</NavItem>
        </Nav>
      </Container>
    </HeaderWrapper>
  )
}

const Container = styled.div`
  max-width: 1200px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  height: ${HEADER_HEIGHT}px;
  background-color: #fff5c2;
  box-shadow: 0 2px 4px #654b472b;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
`

const Title = styled(NavItemLink)`
  margin-left: 6px;
  color: #925742;
  font-size: 1.5rem;
  font-family: "Roboto Slab", sans-serif;
`
