// @flow

import { html, css } from '../unpkg.js'

/*::
type Props = {|
  class?: any,
  children?: any
|}
*/

const View = (props /*: Props*/) => {
  return html`
    <div class=${window.classNames(style, props.class)}>
      ${props.children}
    </div>
  `
}

const style = css`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 0 solid;
  box-sizing: border-box;
  flex: 0 1 auto;
  align-items: flex-start;
  align-self: auto;
  min-width: 0;
  min-height: 0;
`

export default View
