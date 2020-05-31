// @flow

import { html, css } from '../unpkg.js'
import View from './View.js'
import Line from './Line.js'

/*::
type Props = {
  className?: ?string,
  verse: string,
  injectedVerse: string,
}
*/

const LINE_LENGTH = 80

function splitVerse(verse /*: string*/) /*: Array<string>*/ {
  const words = verse.split(' ')
  const lines = ['']
  let i = 0
  for (const word of words) {
    // Do not count syntax as part of word length
    const wordLength = word.replace(/[\[\]{}|]/g, '').length
    let lineLength = lines[i].replace(/[\[\]{}|]/g, '').length

    if (lineLength + wordLength + 1 <= LINE_LENGTH + 1) {
      lines[i] = lines[i] + word + ' '
    } else {
      // word can't fit on current line
      lines[i] = lines[i].trim()
      i++
      lines[i] = word + ' '
    }

    lineLength = lines[i].replace(/[\[\]{}|]/g, '').length

    if (lineLength === LINE_LENGTH + 1) {
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
  const { className, verse, injectedVerse } = props

  const lines = splitVerse(verse)
  const injectedLines = splitVerse(injectedVerse)

  return html`
    <${View} className=${window.classNames(className)}>
      ${injectedLines.map((line) => html` <${Line} line=${line} /> `)}
    </View>
  `
}

const style = css``

export default Verse
