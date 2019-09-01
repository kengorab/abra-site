import * as React from 'react'
import styled from 'styled-components'
import { VsCodeThemeStyles } from '../prettier-languages'
import 'code-prettify'
import 'code-prettify/src/run_prettify'

interface Props {
  children: string,
  language?: 'abra' | 'abrac',
  style?: React.CSSProperties
}

export default function Code({ children, style, language = 'abra' }: Props) {
  const pre = React.createRef<HTMLPreElement>()

  // Split into lines, removing any empty lines at start and end (but keeping empty lines in middle)
  const codeLines = children.trimEnd()
    .split('\n')
    .filter((line, idx) => idx !== 0 || line.length)
  const indentation = codeLines[0] ? codeLines[0].length - codeLines[0].trimStart().length : 0
  const code = codeLines.map(line => line.substring(indentation, line.length)).join('\n')

  React.useLayoutEffect(() => {
    if (pre.current) {
      pre.current.classList.remove('prettyprinted')
    }
    window.PR.prettyPrint()
  }, [pre, code])

  return (
    <>
      <VsCodeThemeStyles/>
      <Pre ref={pre} className={`prettyprint lang-${language}`} style={style || {}}>
        {code}
      </Pre>
    </>
  )
}

const Pre = styled.pre`
  padding: 16px !important; // Need to override prettyprint's default for padding
  border-radius: 6px;
  max-width: 100%;
  max-height: 300px;
  overflow: scroll;
`

