import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { registerAbracLang, registerAbraLang } from './prettier-languages'
import './index.css'

registerAbraLang()
registerAbracLang()

ReactDOM.render(<App/>, document.getElementById('root'))
