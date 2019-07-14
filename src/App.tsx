import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout, Header, Main } from './components/Layout'
import HomePage from './pages/HomePage'
import Documentation from './pages/Documentation'
import TryItOutPage from './pages/TryItOutPage'

export default function App() {
  return (
    <Layout>
      <Router>
        <Header/>
        <Main>
          <Switch>
            <Route exact path="/try" component={TryItOutPage}/>
            <Route exact path="/docs" component={Documentation}/>
            <Route exact path="/" component={HomePage}/>
          </Switch>
        </Main>
      </Router>
    </Layout>
  )
}
