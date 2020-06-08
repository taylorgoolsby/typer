// @flow

import type { MetaWord } from '../stores/ScrollStore.js'
import { html, css } from '../unpkg.js'
import View from './View.js'
import Line from './Line.js'
import { LINE_LENGTH } from '../stores/ScrollStore.js'

type Props = {
  className?: ?string,
  verseWords?: Array<MetaWord>,
  verseString?: string,
}

function getLineLength(line: Array<MetaWord>): number {
  const joined = line.map((word) => word.original).join(' ')
  return joined.length
}

function splitVerseString(verse: string): Array<string> {
  const words = verse.split(' ')
  const lines: Array<Array<string>> = []
  let i = 0
  for (const word of words) {
    if (!Array.isArray(lines[i])) {
      lines[i] = []
    }

    const wordLength = word.length
    const lineLength = lines[i].join(' ').length
    if (lineLength + 1 + wordLength <= LINE_LENGTH) {
      // word can fit on current line
      lines[i].push(word)
    } else {
      // word can't fit on current line
      // add word to next line
      i++
      lines[i] = [word]
    }
  }
  return lines.map((line) => line.join(' '))
}

function splitVerseWords(verseWords: Array<MetaWord>): Array<Array<MetaWord>> {
  const lines: Array<Array<MetaWord>> = []
  let i = 0
  for (const word of verseWords) {
    if (!Array.isArray(lines[i])) {
      lines[i] = []
    }

    const wordLength = word.original.length
    const lineLength = getLineLength(lines[i])
    if (lineLength + 1 + wordLength <= LINE_LENGTH) {
      // word can fit on current line
      lines[i].push(word)
    } else {
      // word can't fit on current line
      // add word to next line
      i++
      lines[i] = [word]
    }
  }
  return lines
}

const Verse = (props: Props) => {
  const { className, verseWords, verseString } = props

  if (verseWords) {
    const lines = splitVerseWords(verseWords)
    return html`
      <${View} className=${window.classNames(style, className)}>
        ${lines.map((line) => html` <${Line} metaWords=${line} /> `)}
      </View>
    `
  } else if (verseString) {
    const lines = splitVerseString(verseString)
    return html`
      <${View} className=${window.classNames(
      style,
      'verse__offset',
      className
    )}>
        ${lines.map((line) => html` <${Line}>${line}</Line>`)}
      </View>
    `
  } else {
    return null
  }
}

const style = css`
  &.verse__offset {
    color: #1c1c1c;
  }
`

export default Verse
