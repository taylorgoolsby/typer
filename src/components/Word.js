// @flow

import { html, css } from '../unpkg.js'
import Text from './Text.js'
import type { MetaWord } from '../stores/SessionStore.js'
import themes from '../themes.js'

const theme = themes[3]

type Props = {
  word: MetaWord,
}

type Segment = {
  text: string,
  typed: boolean,
  error: boolean,
  extra: boolean,
  italic: boolean,
}

function isSimilar(a: Segment, b: Segment) {
  return (
    a.italic === b.italic &&
    a.typed === b.typed &&
    a.error === b.error &&
    a.extra === b.extra
  )
}

function splitErrorWord(word: MetaWord): Array<Segment> {
  const segments: Array<Segment> = []

  // make a segment for each letter
  const wordLength = Math.max(word.original.length, word.input.length)
  for (let i = 0; i < wordLength; i++) {
    const error = !!word.input[i] && word.input[i] !== word.original[i]
    const extra = !word.original[i]
    segments.push({
      text:
        error && !extra ? word.original[i] : word.input[i] || word.original[i],
      italic: word.italic,
      typed: !!word.input[i],
      error,
      extra,
    })
  }

  // Merge similar neighbor segments
  const mergedSegments = []
  for (const segment of segments) {
    const current = mergedSegments[mergedSegments.length - 1]
    if (!current) {
      mergedSegments.push(segment)
      continue
    }

    if (isSimilar(current, segment)) {
      current.text += segment.text
    } else {
      mergedSegments.push(segment)
    }
  }

  return mergedSegments
}

const Word = (props: Props) => {
  const { word } = props

  const untyped = !word.input
  if (untyped) {
    return html`
      <${Text} className=${window.classNames(style, word.italic && 'italic')}>
        ${word.original}    
      </Text>
    `
  }

  const typed = word.original === word.input
  if (typed) {
    return html`
      <${Text} className=${window.classNames(
      style,
      word.italic && 'italic',
      'typed'
    )}>
        ${word.original}
      </Text>
    `
  }

  // Words with mixed styles:

  const segments = splitErrorWord(word)
  const hasError = !!segments.find(
    (segment) => segment.error || (word.complete && !segment.typed)
  )

  return html`
    <${Text} className=${window.classNames(
    style,
    word.italic && 'italic',
    hasError && 'error'
  )}>
      ${segments.map(
        (segment) =>
          html`
          <${Text} className=${window.classNames(
            segment.typed && 'typed',
            segment.error && 'error',
            segment.extra && 'extra'
          )}>
            ${segment.text}
          </Text>
        `
      )}
    </Text>
  `
}

const style = css`
  box-sizing: border-box;
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  color: ${theme.untypedColor};
  line-height: 1rem;

  &.italic {
    font-style: italic;
  }

  &.typed {
    color: ${theme.typedColor};
  }

  &.error {
    border-bottom: 2px solid ${theme.errorColor};
  }

  > span.typed {
    color: ${theme.typedColor};
  }

  > span.error {
    color: ${theme.errorColor};
  }

  > span.extra {
    color: ${theme.extraColor};
  }
`

export default Word
