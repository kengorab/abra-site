import * as React from 'react'
import styled from 'styled-components'
import Codemirror from 'codemirror'
import 'codemirror/addon/runmode/runmode'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import '../abra-lang/abra-mode'

interface Props {
  children: string,
}

export default function Code({ children }: Props) {
  const ref = React.createRef<HTMLPreElement>()

  React.useLayoutEffect(() => {
    const code = unindent(children)

    // @ts-ignore: this function is an addon, and isn't present in the type definitions
    Codemirror.runMode(code, 'abra', ref.current)
  }, [ref, children])

  return <Pre ref={ref} className="CodeMirror cm-s-material"/>
}

function unindent(str: string): string {
  const lines = str.split('\n')

  let startIdx = 0
  for (; startIdx < lines.length; startIdx++) {
    if (lines[startIdx].trim()) break
  }
  let endIdx = lines.length - 1
  for (; endIdx >= 0; endIdx--) {
    if (lines[endIdx].trim()) break
  }

  const firstLine = lines[startIdx]
  if (!firstLine) return str
  const indentation = firstLine.search(/\S/)

  return lines.slice(startIdx, endIdx + 1)
    .map(line => line.substring(indentation))
    .join('\n')
}

const Pre = styled.pre`
  height: auto !important; // Need to override codemirror's default 300px height
  padding: 16px; 
  border-radius: 6px;
  max-width: 100%;
  max-height: 300px;
  overflow: scroll;
`
