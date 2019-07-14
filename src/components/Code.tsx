import * as React from 'react'
import styled from 'styled-components'
import { VsCodeThemeStyles } from '../abra-language'
import 'code-prettify'
import 'code-prettify/src/run_prettify'

interface Props {
  children: string,
  style?: React.CSSProperties
}

export default function Code({ children, style }: Props) {
  // Split into lines, removing any empty lines at start and end (but keeping empty lines in middle)
  const codeLines = children.trimEnd()
    .split('\n')
    .filter((line, idx) => idx !== 0 || line.length)
  const indentation = codeLines[0].length - codeLines[0].trimStart().length
  const code = codeLines.map(line => line.substring(indentation, line.length)).join('\n')

  React.useLayoutEffect(() => {
    window.PR.prettyPrint()
  }, [])

  return (
    <>
      <VsCodeThemeStyles/>
      <Pre className="prettyprint lang-abra" style={style || {}}>
        {code}
      </Pre>
    </>
  )
}

const Pre = styled.pre`
  padding: 16px !important; // Need to override prettyprint's default for padding
  border-radius: 6px;
  max-width: 100%;
  overflow: scroll;
`

