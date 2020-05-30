// @flow

import { React, ReactDOM, html } from './unpkg.js'
import App from './containers/App.js'

ReactDOM.render(html` <${App} />`, document.body)

// const Route = {
//   '/': React.lazy(() => import('./routes/home/index.js')),
//   '*': React.lazy(() => import('./routes/lost/index.js')),
// }
// ReactDOM.render(
//   html`
//     <${React.Suspense} fallback=${html`<div></div>`}>
//       <${Route[location.pathname] || Route['*']} />
//     <//>
//   `,
//   document.body
// )
