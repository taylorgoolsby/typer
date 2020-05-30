// @flow

import { html, css } from '../unpkg.js'

/*::
type Props = {|
  class?: any,
  children?: any
|}
*/

const Text = (props /*: Props*/) => {
  return html`
    <span class=${classNames(style, props.class)}>
      ${props.children}
    </span>
  `
}

const style = css`
  white-space: pre-wrap;
  position: relative;
`

export default Text
