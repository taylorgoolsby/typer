// @flow

import { html, css, mobxReact } from '../unpkg.js'
import View from '../components/View.js'
import SessionStore from '../stores/SessionStore.js'
import Text from '../components/Text.js'
import Verse from '../components/Verse.js'

const { observer } = mobxReact

const spaces = new Array(80 + 1).join(' ')

const Scroll = () => {
  const { verseKey, currentVerse, injectedVerse } = SessionStore

  return html`
    <${View} className=${style}>
      <${Text} className="spaces">
        ${spaces}
      </Text>
      <${Text}>
        ${verseKey}
      </Text>
      <${Verse} verse=${currentVerse} injectedVerse=${injectedVerse}/>
    </View>
  `
}

const style = css`
  > .spaces {
    user-select: none;
  }
`

export default observer(Scroll)
