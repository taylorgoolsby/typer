// @flow

function mergeInjects(
  cursorInjected /*: string*/,
  errorInjected /*: string*/
) /*: string*/ {
  const cursorWords = cursorInjected.split(' ')
  const errorWords = errorInjected.split(' ')

  if (cursorWords.length !== errorWords.length) {
    console.error('uneven length')
  }

  const checkedWords = []
  for (let i = 0; i < cursorWords.length; i++) {
    if (cursorWords[i] === errorWords[i]) {
      // all equal
      checkedWords[i] = cursorWords[i]
    } else {
      const cword = cursorWords[i]
      const eword = errorWords[i]

      const cursorAtEnd = cword[cword.length - 1] === '|'
      if (cursorAtEnd) {
        checkedWords[i] = eword + '|'
      }
      const hasNoCursor = !cword.includes('|')
      if (hasNoCursor) {
        checkedWords[i] = eword
      }

      let ei = 0
      for (let ci = 0; ci < cword.length; ci++) {
        if (['[', ']', '{', '}'].includes(eword[ei + ci])) {
          ei++
        }
        if (cword[ci] === '|') {
          checkedWords[i] = eword.slice(0, ci + ei) + '|' + eword.slice(ci + ei)
          break
        }
      }
    }
  }

  return checkedWords.join(' ')
}

export default mergeInjects
