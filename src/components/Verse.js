// @flow

import { html, css } from '../unpkg.js'
import View from './View.js'
import Line from './Line.js'

/*::
type Props = {
  className?: ?string
  verse: string
}
*/

const lineLength = 80

function splitVerse(verse /*: string*/) /*: Array<string>*/ {
  const words = verse.split(' ')
  const lines = ['']
  let i = 0
  for (const word of words) {
    // Do not count [italic] syntax as part of word length
    const wordLength = word.replace(/(\[|\])/g, '').length

    if (lines[i].length + wordLength + 1 <= lineLength + 1) {
      lines[i] = lines[i] + word + ' '
    } else {
      // word can't fit on current line
      lines[i] = lines[i].trim()
      i++
      lines[i] = word + ' '
    }
    if (lines[i].length === lineLength + 1) {
      // line completely full
      lines[i] = lines[i].trim()
      i++
      lines[i] = ''
    }
  }
  lines[i] = lines[i].trim()
  return lines
}

const Verse = (props /*: Props*/) => {
  const { className, verse } = props

  const lines = splitVerse(verse)

  return html`
    <${View} className=${window.classNames(className)}>
      ${lines.map((line) => html` <${Line} line=${line} /> `)}
    </View>
  `
}

const style = css``

export default Verse
