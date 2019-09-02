import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout, Header, Main } from './components/Layout'
import HomePage from './pages/HomePage'
import Documentation from './pages/Documentation'
import TryItOutPage from './pages/TryItOutPage'
import VMDocumentation from './pages/VMDocumentation'

export default function App() {
  return (
    <Layout>
      <Router>
        <Header/>
        <Main>
          <Switch>
            <Route exact path="/try" component={TryItOutPage}/>
            <Route exact path="/docs" component={Documentation}/>
            <Route exact path="/docs/vm" component={VMDocumentation}/>
            <Route exact path="/" component={HomePage}/>
          </Switch>
        </Main>
      </Router>
    </Layout>
  )
}
