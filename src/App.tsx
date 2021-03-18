import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout, Header, Main } from './components/Layout'

const HomePage = React.lazy(() => import(/* webpackChunkName: "./pages/HomePage" */ './pages/HomePage'))
const Documentation = React.lazy(() => import(/* webpackChunkName: "./pages/Documentation" */ './pages/Documentation'))
const Manual = React.lazy(() => import(/* webpackChunkName: "./pages/Manual" */ './pages/Manual'))
const PlaygroundPage = React.lazy(() => import(/* webpackChunkName: "./pages/PlaygroundPage" */ './pages/PlaygroundPage'))

function PlaygroundPageWrapper() {
  return (
    <React.Suspense fallback={<div/>}>
      <PlaygroundPage/>
    </React.Suspense>
  )
}

export default function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/try" component={PlaygroundPageWrapper}/>
          <Route path="/">
            <Header/>
            <React.Suspense fallback={<div/>}>
              <Main>
                <Route path="/docs" component={Documentation}/>
                <Route path="/manual" component={Manual}/>
                <Route exact path="/" component={HomePage}/>
              </Main>
            </React.Suspense>
          </Route>
        </Switch>
      </Router>
    </Layout>
  )
}
