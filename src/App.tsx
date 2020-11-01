import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout, Header, Main } from './components/Layout'
import HomePage from './pages/HomePage'
import Documentation from './pages/Documentation'
import PlaygroundPage from './pages/PlaygroundPage'

export default function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/try" component={PlaygroundPage}/>
          <Route path="/">
            <Header/>
            <Main>
              <Route path="/docs" component={Documentation}/>
              <Route exact path="/" component={HomePage}/>
            </Main>
          </Route>
        </Switch>
      </Router>
    </Layout>
  )
}
