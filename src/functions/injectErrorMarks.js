// @flow

function injectErrorMarks(
  truth /*: string*/,
  attempt /*: string*/
) /*: string*/ {
  // userInput might be longer than verse. If that is the case,
  // then all characters longer than verse are errors.
  const length = Math.max(truth.length, attempt.length)
  let errorInjected = ''

  for (let i = 0; i < length; i++) {
    errorInjected += attempt[i] || truth[i]
  }

  // preppended false in order to catch case where first char is an error
  const diff = [false]
  for (let i = 0; i < length; i++) {
    // If userInput[i] doesn't exist, then there's no diff
    diff.push(truth[i] !== attempt[i] && !!attempt[i])
  }
  // errorInjected false in order to catch case where last char is an error
  diff.push(false)

  // Switches is the same length as errorInjected.
  // switches[i] implies a mark should be inserted into errorInjected at index i.
  const switches = []
  for (let i = 0; i < diff.length - 1; i++) {
    switches[i] = diff[i] !== diff[i + 1]
  }

  // marks contains the indices to insert into.
  const marks = []
  for (let i = 0; i < switches.length; i++) {
    if (switches[i]) {
      marks.push(i)
    }
  }

  // Break errorInjected into segments at each of the mark indices
  const segments = []
  for (let i = 0; i < marks.length; i++) {
    if (i === 0) {
      segments.push(errorInjected.slice(0, marks[i]))
    } else {
      segments.push(errorInjected.slice(marks[i - 1], marks[i]))
    }
  }
  // Add the rest as the final segment:
  segments.push(errorInjected.slice(marks[marks.length - 1] || 0))

  let startMark = true
  const markInjected = []
  for (let i = 0; i < segments.length; i++) {
    markInjected.push(segments[i])
    if (i !== segments.length - 1) {
      if (startMark) {
        markInjected.push('{')
        startMark = !startMark
      } else {
        markInjected.push('}')
        startMark = !startMark
      }
    }
  }

  return markInjected.join('')
}

export default injectErrorMarks
