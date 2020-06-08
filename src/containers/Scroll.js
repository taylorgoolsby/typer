// @flow

import { html, css, mobxReact } from '../unpkg.js'
import View from '../components/View.js'
import SessionStore from '../stores/ScrollStore.js'
import Text from '../components/Text.js'
import Verse from '../components/Verse.js'
import Line from '../components/Line.js'

const { observer } = mobxReact

const spaces = new Array(80 + 1).join(' ')

const Scroll = () => {
  const { verseKey, verseWords, getVerseOffset } = SessionStore

  return html`
    <${View} className=${style}>
      <${Text} className="spaces">
        ${spaces}
      </Text>
      <${Line}>
        ${verseKey}
      </Line>
      <${Verse} verseString=${getVerseOffset(-2)}/>
      <${Verse} verseString=${getVerseOffset(-1)}/>
      <${Verse} verseWords=${verseWords} />
      <${Verse} verseString=${getVerseOffset(1)}/>
      <${Verse} verseString=${getVerseOffset(2)}/>
      <${Verse} verseString=${getVerseOffset(3)}/>
      <${Verse} verseString=${getVerseOffset(4)}/>
      <${Verse} verseString=${getVerseOffset(5)}/>
    </View>
  `
}

const style = css`
  > .spaces {
    //user-select: none;
  }
`

export default observer(Scroll)
