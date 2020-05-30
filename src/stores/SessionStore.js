// @flow

import { mobx, kjv } from '../unpkg.js'
import randomInt from '../functions/randomInt.js'

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

class SessionStore {
  prevVerseIndices /*: Array<number>*/
  verseIndex /*: number*/
  userInput /*: string*/

  constructor() {
    // Needed in order to make MobX re-render components:
    observe(this, () => {})

    this.prevVerseIndices = []
    this.verseIndex = 0
    this.userInput = ''

    window.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e /*: KeyboardEvent*/) {
    if (/^[a-z0-9 \[\]{};:'",<.>/?|\\!@#$%^&*()_+\-=`~]$/i.test(e.key)) {
      this.userInput += e.key
    } else if (e.key === 'Backspace') {
      this.userInput = this.userInput.slice(0, -1)
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

  get verseKey() {
    return verseKeys[this.verseIndex]
  }

  get verse() {
    return verses[verseKeys[this.verseIndex]]
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
}

decorate(SessionStore, {
  verseIndex: observable,
  userInput: observable,
  handleKeyDown: action.bound,
  setRandomVerse: action.bound,
  setUndoVerse: action.bound,
  verseKey: computed,
  verse: computed,
})

const instance = new SessionStore()

console.log('instance', instance)

export default instance
