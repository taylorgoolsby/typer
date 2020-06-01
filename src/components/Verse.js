// @flow

import type { MetaWord } from '../stores/SessionStore.js'
import { html, css } from '../unpkg.js'
import View from './View.js'
import Line from './Line.js'

type Props = {
  className?: ?string,
  verseWords: Array<MetaWord>,
  verse: string,
  injectedVerse: string,
}

const LINE_LENGTH = 80

function getLineLength(line: Array<MetaWord>): number {
  const joined = line.map((word) => word.original).join(' ')
  return joined.length
}

function splitVerse(verseWords: Array<MetaWord>): Array<Array<MetaWord>> {
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
  const { className, verseWords } = props

  const lines = splitVerse(verseWords)

  return html`
    <${View} className=${window.classNames(className)}>
      ${lines.map((line) => html` <${Line} metaWords=${line} /> `)}
    </View>
  `
}

const style = css``

export default Verse
