import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { registerAbraLang } from './abra-language'
import './index.css'

registerAbraLang()

ReactDOM.render(<App/>, document.getElementById('root'))
