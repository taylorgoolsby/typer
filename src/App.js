import React from 'https://unpkg.com/es-react'
import htm from 'https://unpkg.com/htm?module'
import css from 'https://unpkg.com/csz?module'
import { kjv } from './imports.js'

// console.log('createGlobalStyle', createGlobalStyle)

const html = htm.bind(React.createElement)
const { verses } = kjv

const className = css`
  :global(body) {
    font-family: 'Ubuntu Mono', monospace;
  }
`

const App = () => {
  return html`
    <div class="${className}">
      ${verses['John 3:16']}
    </div>
  `
}

export default App
