// @flow

function mergeErrorInjects(
  original /*: string*/,
  errorInjected /*: string*/
) /*: string*/ {
  const verseWords = original.split(' ')
  const errorWords = errorInjected.split(' ')

  if (verseWords.length !== errorWords.length) {
    console.error('uneven length')
  }

  const checkedWords = []
  for (let i = 0; i < verseWords.length; i++) {
    if (verseWords[i] === errorWords[i]) {
      // all equal
      checkedWords[i] = verseWords[i]
    } else {
      const eword = errorWords[i]
      const vword = verseWords[i]
      checkedWords[i] = eword

      const start = vword[0] === '['
      const end = vword[vword.length - 1] === ']'
      if (start) {
        checkedWords[i] = '[' + checkedWords[i]
      }
      if (end) {
        checkedWords[i] = checkedWords[i] + ']'
      }
    }
  }

  return checkedWords.join(' ')
}

export default mergeErrorInjects
