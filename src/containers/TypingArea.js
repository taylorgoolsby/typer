// @flow

import { html, css, kjv, mobx, mobxReact } from '../unpkg.js'
import View from '../components/View.js'
import SessionStore from '../stores/SessionStore.js'
import Text from '../components/Text.js'

const { observer } = mobxReact
const { verses } = kjv

const TypingArea = () => {
  const { verseKey, verse } = SessionStore

  return html`
    <${View}>
      <${Text}>
        ${verseKey}
      </Text>
      <${Text}>
        ${verse}
      </Text>
    </View>
  `
}

const style = css``

export default observer(TypingArea)
