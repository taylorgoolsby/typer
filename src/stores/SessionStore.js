// @flow

import { mobx, kjv } from '../unpkg.js'
import randomInt from '../functions/randomInt.js'
import injectErrorMarks from '../functions/injectErrorMarks.js'
import injectErrorMarksOverVerse from '../functions/injectErrorMarksOverVerse.js'
import injectCursor from '../functions/injectCursor.js'
import mergeInjects from '../functions/mergeInjects.js'
import mergeErrorInjects from '../functions/mergeErrorInjects.js'

const { decorate, observable, action, observe, computed } = mobx

const { verses, layout } = kjv

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

class SessionStore {
  prevVerseIndices /*: Array<number>*/
  verseIndex /*: number*/
  userInput /*: string*/

  constructor() {
    // Needed in order to make MobX re-render components:
    observe(this, () => {})
    observe(this, 'verseIndex', () => {
      this.clearUserInput()
    })

    this.prevVerseIndices = []
    this.verseIndex = 0
    this.userInput = ''

    window.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e /*: KeyboardEvent*/) {
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

  get verseKey() {
    return verseKeys[this.verseIndex]
  }

  get currentVerse() {
    let verse = verses[verseKeys[this.verseIndex]]
    if (verse[0] === '#') {
      // Remove new paragraph syntax because we are using layout to detect paragraphs
      verse = verse.slice(2)
    }

    return verse
  }

  get injectedVerse() {
    const verse = this.currentVerse
    const errorInjected = injectErrorMarksOverVerse(verse, this.userInput)
    const cursorInjected = injectCursor(verse, this.userInput)
    const injected = mergeInjects(
      cursorInjected,
      mergeErrorInjects(verse, errorInjected)
    )
    return injected
  }

  get verseWordCount() {
    return this.currentVerse.split(' ').length
  }

  get userInputWordCount() {
    return this.userInput.split(' ').length
  }
}

decorate(SessionStore, {
  verseIndex: observable,
  userInput: observable,
  handleKeyDown: action.bound,
  clearUserInput: action.bound,
  setRandomVerse: action.bound,
  setUndoVerse: action.bound,
  verseKey: computed,
  currentVerse: computed,
  injectedVerse: computed,
  verseWordCount: computed,
  userInputWordCount: computed,
})

const instance = new SessionStore()
export default instance
