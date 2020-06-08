// @flow

import { html, css } from '../unpkg.js'
import themes from '../themes.js'
import Text from './Text.js'

const theme = themes[3]

export type MetaLetter = {
  italic: boolean,
  typed: boolean,
  error: boolean,
  extra: boolean,
  value: string,
}

type Props = {
  letter: MetaLetter,
}

const Letter = (props: Props) => {
  const { letter } = props
  return html`
  <${Text} className=${window.classNames(
    style,
    letter.italic && 'italic',
    letter.typed && 'typed',
    letter.error && 'error',
    letter.extra && 'extra'
  )}>
    ${letter.value}
  </Text>
  `
}

const style = css`
  transition: color 120ms ease-out;
  color: ${theme.untypedColor};
  text-shadow: -1px -1px 0 ${theme.backgroundColor},
    1px -1px 0 ${theme.backgroundColor}, -1px 1px 0 ${theme.backgroundColor},
    1px 1px 0 ${theme.backgroundColor};

  &.italic {
    font-style: italic;
  }

  &.typed {
    color: ${theme.typedColor};
  }

  &.error {
    color: ${theme.errorColor};
  }

  &.extra {
    color: ${theme.extraColor};
  }
`

export default Letter
