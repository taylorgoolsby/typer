// @flow

import { React, html, css, mobxReact } from '../unpkg.js'
import View from '../components/View.js'
import themes from '../themes.js'
import Header from './Header.js'
import Scroll from './Scroll.js'
import SessionStore from '../stores/SessionStore.js'

const theme = themes[1]

const { Provider } = mobxReact
const stores = {
  sessionStore: SessionStore,
}

// Define global styles here
css`
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: ${theme.back};
    color: ${theme.high};
    font-family: 'Source Code Pro', monospace;
  }
`
// TODO: apercu

const componentStyle = css`
  min-width: 100vw;
  min-height: 100vh;

  > .content {
    margin-left: auto;
    margin-right: auto;
    //width: 800px;
    flex: 1;
  }
`

const App = () => {
  return html`
    <${Provider} ...${stores}>
      <${View} className=${componentStyle}>
        <${View} className="content">
          <${Header} />
          <${Scroll} />
        </View>
      </View>
    </Provider>
  `
}

export default App
