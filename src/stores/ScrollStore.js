// @flow

import { mobx, kjv } from '../unpkg.js'
import randomInt from '../functions/randomInt.js'
import injectErrorMarksOverVerse from '../functions/injectErrorMarksOverVerse.js'
import injectCursor from '../functions/injectCursor.js'
import mergeInjects from '../functions/mergeInjects.js'
import mergeErrorInjects from '../functions/mergeErrorInjects.js'

const { decorate, observable, action, observe, computed } = mobx

const { verses, layout } = kjv

export const LINE_LENGTH = 80

const keyToLayout = {}
for (let i = 0; i < layout.length; i++) {
  const line = layout[i]
  if (line[0] === 'VERSE') {
    keyToLayout[line[1]] = i
  }
}

const verseKeys = Object.keys(verses)
const keyToIndex = {}
for (let i = 0; i < verseKeys.length; i++) {
  const key = verseKeys[i]
  keyToIndex[key] = i
}

// look for special characters:
// { := error start
// } := error end
// | := end of user input
// for (const line of layout) {
//   if (line[0] === 'TXT') {
//     const matches = line[1].match(/[{}|]/g)
//     if (matches) {
//       console.error('Special character in use: ' + matches)
//     }
//   } else if (line[0] === 'VERSE') {
//     const matches = verses[line[1]].match(/[{}|]/g)
//     if (matches) {
//       console.error('Special character in use: ' + matches)
//     }
//   } else if (line[0] === 'PARAGRAPH') {
//   } else if (line[0] === 'CHAPTER') {
//   } else if (line[0] === 'BOOK') {
//   } else {
//     console.log('line', line)
//   }
// }

// Look for double spaces:
// for (const line of layout) {
//   if (line[0] === 'TXT') {
//     const matches = line[1].match(/  /g)
//     if (matches) {
//       console.error('Special character in use: ' + matches)
//     }
//   } else if (line[0] === 'VERSE') {
//     const matches = verses[line[1]].match(/  /g)
//     if (matches) {
//       console.error('Special character in use: ' + matches)
//     }
//   } else if (line[0] === 'PARAGRAPH') {
//   } else if (line[0] === 'CHAPTER') {
//   } else if (line[0] === 'BOOK') {
//   } else {
//     console.log('line', line)
//   }
// }

export type MetaWord = {
  original: string,
  input: string,
  italic: boolean,
  complete: boolean,
}

class ScrollStore {
  prevVerseIndices: Array<number>
  verseIndex: number
  userInput: string

  constructor() {
    // Needed in order to make MobX re-render components:
    observe(this, () => {})
    observe(this, 'verseIndex', () => {
      this.clearUserInput()
    })

    this.prevVerseIndices = []
    this.verseIndex = keyToIndex['John 1:1']
    this.userInput = ''

    window.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e: KeyboardEvent) {
    // TODO: new lines accepted as a space only if it's the last character.
    if (/^[a-z0-9 \[\];:'",<.>/?\\!@#$%^&*()_+\-=`~]$/i.test(e.key)) {
      const doubleSpace =
        this.userInput[this.userInput.length - 1] === ' ' && e.key === ' '
      const startSpace = !this.userInput.length && e.key === ' '
      if (
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !doubleSpace &&
        !startSpace
      ) {
        // TODO: Performance profiling
        const noMoreSpace =
          this.userInputWordCount >= this.verseWordCount && e.key === ' '
        if (noMoreSpace) {
          // Going to next verse will clear userInput
          this.setNextVerse()
        } else {
          this.userInput += e.key
        }
      }
    } else if (e.key === 'Enter') {
      const noMoreSpace =
        this.userInputWordCount >= this.verseWordCount &&
        this.userInput[this.userInput.length - 1] !== ' '
      if (noMoreSpace) {
        this.setNextVerse()
      }
    } else if (e.key === 'Backspace') {
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        this.userInput = this.userInput.slice(0, -1)
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()

      if (!e.shiftKey) {
        this.setRandomVerse()
      } else {
        this.setUndoVerse()
      }
    } else if (e.key === 'ArrowRight') {
      this.setNextVerse()
    } else if (e.key === 'ArrowLeft') {
      this.setPrevVerse()
    } else if (e.key === 'ArrowDown') {
      this.setNextChapter()
    } else if (e.key === 'ArrowUp') {
      this.setPrevChapter()
    }
  }

  clearUserInput() {
    this.userInput = ''
  }

  setRandomVerse() {
    this.prevVerseIndices.push(this.verseIndex)
    this.verseIndex = randomInt(0, verseKeys.length - 1)
  }

  setUndoVerse() {
    if (!this.prevVerseIndices.length) return
    this.verseIndex = this.prevVerseIndices.pop()
  }

  setNextVerse() {
    if (this.verseIndex >= verseKeys.length - 1) return

    this.prevVerseIndices.push(this.verseIndex)
    this.verseIndex++
  }

  setPrevVerse() {
    if (this.verseIndex <= 0) return

    this.prevVerseIndices.push(this.verseIndex)
    this.verseIndex--
  }

  setNextChapter() {
    let layoutIndex = keyToLayout[this.verseKey]
    while (
      layoutIndex < layout.length - 1 &&
      layout[layoutIndex][0] !== 'CHAPTER'
    ) {
      layoutIndex++
    }

    if (layoutIndex === layout.length - 1) {
      return
    }

    while (layout[layoutIndex][0] !== 'VERSE') {
      layoutIndex++
    }
    const verseKey = layout[layoutIndex][1]
    this.prevVerseIndices.push(this.verseIndex)
    this.verseIndex = keyToIndex[verseKey]
  }

  /* TODO: Unable to go back to Genesis 1:1 if current chapter is Genesis 1*/
  setPrevChapter() {
    let layoutIndex = keyToLayout[this.verseKey]
    while (layoutIndex > 0 && layout[layoutIndex][0] !== 'CHAPTER') {
      layoutIndex--
    }

    if (layoutIndex === 0) {
      return
    }

    layoutIndex--

    while (layoutIndex > 0 && layout[layoutIndex][0] !== 'CHAPTER') {
      layoutIndex--
    }

    if (layoutIndex === 0) {
      return
    }

    while (layout[layoutIndex][0] !== 'VERSE') {
      layoutIndex++
    }
    const verseKey = layout[layoutIndex][1]
    this.prevVerseIndices.push(this.verseIndex)
    this.verseIndex = keyToIndex[verseKey]
  }

  getVerseOffset = (offset: number): ?string => {
    if (this.verseIndex + offset < 0) {
      return null
    }
    if (this.verseIndex + offset > verseKeys.length - 1) {
      return null
    }
    let verse = verses[verseKeys[this.verseIndex + offset]].replace(
      /[\[\]]/g,
      ''
    )
    if (verse[0] === '#') {
      // Remove new paragraph syntax because we are using layout to detect paragraphs
      verse = verse.slice(2)
    }
    return verse
  }

  get verseKey() {
    return verseKeys[this.verseIndex]
  }

  get verseWords(): Array<MetaWord> {
    // userInput end is not trimmed, no double spaces, start trimmed
    // It is not possible for userInput to have more words than verse.
    const userInput = this.userInput

    // split userInput, but keep spaces.
    const userWords: Array<string> = userInput.match(/[^ ]+(\s|$)/g) || []

    let verse = verses[verseKeys[this.verseIndex]]
    if (verse[0] === '#') {
      // Remove new paragraph syntax because we are using layout to detect paragraphs
      verse = verse.slice(2)
    }

    const words = verse.split(' ')

    let italic = false
    const metaWords: Array<MetaWord> = words.map((word) => {
      const userWord: string = userWords.shift() || ''
      if (word[0] === '[') {
        italic = true
      }
      const metaWord: MetaWord = {
        original: word.replace(/[\[\]]/g, ''),
        input: userWord.trim(),
        italic,
        complete: userWord[userWord.length - 1] === ' ',
      }
      if (word[word.length - 1] === ']') {
        italic = false
      }
      return metaWord
    })

    return metaWords
  }

  get verseWordCount() {
    return this.verseWords.length
  }

  get userInputWordCount() {
    return this.userInput.split(' ').length
  }
}

decorate(ScrollStore, {
  verseIndex: observable,
  userInput: observable,
  handleKeyDown: action.bound,
  clearUserInput: action.bound,
  setRandomVerse: action.bound,
  setUndoVerse: action.bound,
  verseKey: computed,
  verseWords: computed,
  verseWordCount: computed,
  userInputWordCount: computed,
})

const instance = new ScrollStore()
export default instance
