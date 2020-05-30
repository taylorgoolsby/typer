// @flow

import { html, css } from '../unpkg.js'
import View from '../components/View.js'

const style = css`
  align-self: stretch;
  height: 80px;
`

const Header = () => {
  return html` <${View} class=${style}> <//> `
}

export default Header
