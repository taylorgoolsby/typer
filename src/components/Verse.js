// @flow

import { html, css } from '../unpkg.js'
import View from './View.js'
import Line from './Line.js'

/*::
type Props = {
  className?: ?string,
  verse: string,
  userInput: string,
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

// Note that there are no double spaces in the userInput nor the verses.
function splitUserInput(
  lines /*: Array<string>*/,
  userInput /*: string*/
) /*: Array<string>*/ {
  if (!userInput || userInput === ' ') return ['']

  const userWords = userInput.split(' ')
  return lines.map((line) => {
    const words = line.split(' ')

    // Match each word in the line to a word in the userInput
    let userLine = ''
    let addCount = 0
    for (const word of words) {
      if (userWords[0]) {
        userLine += userWords.shift() + ' '
        addCount++
      }
    }
    // Remove added space
    userLine = userLine.trim()

    if (userWords.length === 1 && userWords[0] === '') {
      // User ended input with a space.
      if (addCount === words.length) {
        // All words in the line were added
        // Space marks the end of the line but should not be added to the current line nor the next line.
        userWords.pop()
      } else {
        // User ended with a space in the middle of the line.
        userLine += ' '
      }
    }

    return userLine
  })
}

const Verse = (props /*: Props*/) => {
  const { className, verse, userInput } = props

  const lines = splitVerse(verse)
  const userLines = splitUserInput(lines, userInput)

  // console.log('lines', lines)
  // console.log('userLines', userLines)

  return html`
    <${View} className=${window.classNames(className)}>
      ${lines.map((line) => html` <${Line} line=${line} /> `)}
    </View>
  `
}

const style = css``

export default Verse
