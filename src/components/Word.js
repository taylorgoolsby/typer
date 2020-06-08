// @flow

import { html, css } from '../unpkg.js'
import Text from './Text.js'
import type { MetaWord } from '../stores/ScrollStore.js'
import themes from '../themes.js'
import type { MetaLetter } from './Letter.js'
import Letter from './Letter.js'

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

function splitIntoLetters(word: MetaWord): Array<MetaLetter> {
  const letters: Array<MetaLetter> = []
  const wordLength = Math.max(word.original.length, word.input.length)
  for (let i = 0; i < wordLength; i++) {
    const error = !!word.input[i] && word.input[i] !== word.original[i]
    const extra = !word.original[i]
    letters.push({
      italic: word.italic,
      typed: !!word.input[i],
      error,
      extra,
      value:
        error && !extra ? word.original[i] : word.input[i] || word.original[i],
    })
  }
  return letters
}

const Word = (props: Props) => {
  const { word } = props

  // const untyped = !word.input
  // if (untyped) {
  //   return html`
  //     <${Text} className=${window.classNames(style, word.italic && 'italic')}>
  //       ${word.original}
  //     </Text>
  //   `
  // }
  //
  // const typed = word.original === word.input
  // if (typed) {
  //   return html`
  //     <${Text} className=${window.classNames(
  //     style,
  //     word.italic && 'italic',
  //     'typed'
  //   )}>
  //       ${word.original}
  //     </Text>
  //   `
  // }

  // // Words with mixed styles:
  //
  // const segments = splitErrorWord(word)

  const letters = splitIntoLetters(word)
  const hasError = !!letters.find(
    (letter) => letter.error || (word.complete && !letter.typed)
  )

  return html`
  <${Text} className=${window.classNames(style, hasError && 'error')}>
    ${letters.map((letter) => html`<${Letter} letter=${letter} />`)}
  </Text>
  `
}

const style = css`
  box-sizing: border-box;
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  color: ${theme.untypedColor};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 2px solid rgba(0, 0, 0, 0);
    transition: border-bottom-color 120ms ease-out;
  }

  &.error::before {
    border-bottom: 2px solid ${theme.errorColor};
  }
`

export default Word
