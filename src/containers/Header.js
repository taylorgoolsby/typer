// @flow

import { html, css } from '../unpkg.js'
import View from '../components/View.js'

const style = css`
  align-self: stretch;
  height: 80px;
`

const Header = () => {
  return html` <${View} className=${style}> </View> `
}

export default Header
