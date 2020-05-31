// @flow

import injectErrorMarks from './injectErrorMarks.js'

function injectErrorMarksOverVerse(
  verse /*: string*/,
  userInput /*: string*/
) /*: string*/ {
  // Examples:
  // v: Jesus wept.
  // u: Jesus wept.
  // e: Jesus wept.

  // v: Jesus wept.
  // u: Jeses wept.
  // e: Jes{u}s wept.

  // v: Jesus wept.
  // u: AAAus wept.
  // e: {Jes}us wept.

  // v: Jesus wept.
  // u: AAA wept.
  // e: {Jesus} wept.

  // v: Jesus wept.
  // u: wept
  // e: {Jesu}s wept.

  // v: Jesus wept.
  // u: wept
  // e: {J}e{su}s wept.

  // v: Jesus wept.
  // u: w e
  // e: {J}esus {w}ept.

  verse = verse.replace(/[\[\]]/g, '') // remove all marks
  const verseWords = verse.split(' ') // versus are trimmed

  // userInput end is not trimmed, no double spaces, start trimmed
  // It is not possible for userInput to have more words than verse.
  const userWords = userInput.split(' ')

  const checkedWords = []
  for (let i = 0; i < verseWords.length; i++) {
    if (verseWords[i] === userWords[i]) {
      checkedWords[i] = verseWords[i]
      continue
    }
    checkedWords[i] = injectErrorMarks(verseWords[i], userWords[i] || '')
  }

  const naive = checkedWords.join(' ')
  const merged = naive.replace(/} {/g, ' ')
  return merged
}

export default injectErrorMarksOverVerse
