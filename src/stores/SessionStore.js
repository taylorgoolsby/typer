// @flow

import { mobx, kjv } from '../unpkg.js'
import randomInt from '../functions/randomInt.js'

const { decorate, observable, action, observe, computed } = mobx
const { verses } = kjv

const verseKeys = Object.keys(verses)

class SessionStore {
  prevVerseIndices /*: Array<number>*/
  verseIndex /*: number*/
  userInput /*: string*/

  constructor() {
    observe(this, () => {})

    this.prevVerseIndices = []
    this.verseIndex = 0
    this.userInput = ''

    observe(this, 'userInput', ({ newValue }) => {
      console.log('newValue', newValue)
    })
    window.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e /*: KeyboardEvent*/) {
    if (e.key === 'Tab') {
      e.preventDefault()

      if (!e.shiftKey) {
        this.setRandomVerse()
      } else {
        this.setUndoVerse()
      }
    } else if (/^[a-z0-9 \[\]{};:'",<.>/?|\\!@#$%^&*()_+\-=`~]$/i.test(e.key)) {
      console.log(e.key)
    } else if (e.key === 'ArrowRight') {
      this.setNextVerse()
    } else if (e.key === 'ArrowLeft') {
      this.setPrevVerse()
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
