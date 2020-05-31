// @flow

function injectCursor(verse /*: string*/, userInput /*: string*/) /*: string*/ {
  const verseWords = verse.split(' ') // versus are trimmed

  // userInput end is not trimmed, no double spaces, start trimmed
  // It is not possible for userInput to have more words than verse.
  const userWords = userInput.split(' ')

  const checkedWords = []
  for (let i = 0; i < verseWords.length; i++) {
    const isLast = i === verseWords.length - 1
    const hasCurrent = userWords[i] || userWords[i] === ''
    const hasNext = userWords[i + 1] || userWords[i + 1] === ''
    if (verseWords[i] === userWords[i] && !isLast && hasNext) {
      checkedWords[i] = verseWords[i]
    } else if (hasCurrent && !hasNext) {
      checkedWords[i] =
        verseWords[i].slice(0, userWords[i].length) +
        '|' +
        verseWords[i].slice(userWords[i].length)
    } else {
      checkedWords[i] = verseWords[i]
    }
  }

  return checkedWords.join(' ')
}

export default injectCursor
