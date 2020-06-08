// @flow

import type { MetaWord } from '../stores/ScrollStore.js'
import { html, css } from '../unpkg.js'
import Text from './Text.js'
import Word from './Word.js'

type Props = {
  metaWords?: Array<MetaWord>,
  children?: any,
}

const Line = (props: Props) => {
  const { metaWords, children } = props

  if (children) {
    return html`
      <${Text} className=${style}>
        ${children}
      </Text>
    `
  } else if (metaWords) {
    const wordElements = metaWords.map((word) => html`<${Word} word=${word} />`)

    const interspaced = []
    for (let i = 0; i < wordElements.length; i++) {
      interspaced.push(wordElements[i])
      const hasNext = !!wordElements[i + 1]
      if (hasNext) {
        interspaced.push(' ')
      }
    }

    return html`
      <${Text} className=${style}>
        ${interspaced}
      </Text>
    `
  } else {
    return null
  }
}

const style = css`
  margin: 4px 0 6px;
  line-height: 1rem;
`

export default Line
