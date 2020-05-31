// @flow

import { html, css } from '../unpkg.js'
import View from './View.js'
import Text from './Text.js'
import themes from '../themes.js'

/*::
type Props = {
  line: string
}

type Segment = {
  text: string,
  typed: boolean,
  error: boolean,
  italic: boolean
}
*/

const theme = themes[3]

function splitLine(line /*: string*/) /*: Array<Segment>*/ {
  // New segments are started when:
  // * Entering italic phrase [
  // * Exiting italic phrase ]
  // * Entering user error {
  // * Exiting user error }
  // * Exiting user input |

  const marks /*: Array<{i: number, char: string}> */ = []
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char.match(/[\[\]{}|]/g)) {
      marks.push({ i, char })
    }
  }

  const segments = []

  let typed = false
  let error = false
  let italic = false

  // Figure out starting segment state
  if (line.includes('|') && line[0] !== '|') {
    // This line has started to be typed.
    typed = true
  }
  if (line[0] === '{') {
    // Line starts with error.
    error = true
  } else if (line.includes('}')) {
    // Previous line started error.
    const errorStart = line.indexOf('{')
    const errorEnd = line.indexOf('}')
    error = errorStart === -1 || errorEnd < errorStart
  }
  if (line[0] === '[') {
    italic = true
  } else if (line.includes(']')) {
    // Previous line started italic.
    const italicStart = line.indexOf('[')
    const italicEnd = line.indexOf(']')
    italic = italicStart === -1 || italicEnd < italicStart
  }

  // First segement:
  const text = marks.length ? line.slice(0, marks[0].i) : line
  segments.push({
    text,
    typed,
    error,
    italic,
  })

  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i]
    const nextMark = marks[i + 1]
    const text = nextMark
      ? line.slice(mark.i + 1, nextMark.i)
      : line.slice(mark.i + 1)

    switch (mark.char) {
      case '[':
        italic = true
        break
      case ']':
        italic = false
        break
      case '{':
        error = true
        break
      case '}':
        error = false
        break
      case '|':
        typed = false
        break
    }

    segments.push({
      text,
      typed,
      error,
      italic,
    })
  }

  return segments
}

const Line = (props /*: Props*/) => {
  const { line } = props

  const segments = splitLine(line)

  return html`
    <${Text} className=${style}>
      ${segments.map(
        (segment) =>
          html`
            <${Text} className=${window.classNames(
            segment.typed && 'typed',
            segment.error && 'error',
            segment.italic && 'italic'
          )}>
              ${segment.text}
            </Text>
          `
      )}
    </Text>
  `
}

const style = css`
  span.italic {
    font-style: italic;
  }

  span.typed {
    color: ${theme.typedColor};
  }

  span.error {
    color: ${theme.errorColor};
  }
`

export default Line
