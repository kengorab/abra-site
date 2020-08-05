import * as React from 'react'
import styled from 'styled-components'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { disassemble } from '../../abra-lang/wrapper'
import { Section } from '../../components/Layout'
import CodeMirrorEditor from '../../components/CodeMirrorEditor'
import Tabs from '../../components/Tabs'
import Code from '../../components/Code'
import greeting from './examples/greeting'
import fibonacci from './examples/fibonacci'
import fizzbuzz from './examples/fizzbuzz'
import linkedList from './examples/linked-list'

type Example = 'greeting' | 'fibonacci' | 'fizzbuzz' | 'linked-list'

const codeExamples: Record<Example, string> = {
  'greeting': greeting,
  'fibonacci': fibonacci,
  'fizzbuzz': fizzbuzz,
  'linked-list': linkedList
}

const ExternalLink = ({ href, children }: { href: string, children: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>

const noWasmMessage = (
  <span>
    There was an error initializing the abra wasm module. Please verify that your
    browser <ExternalLink href="https://caniuse.com/#feat=wasm">supports webassembly</ExternalLink>, or
    try again.
  </span>
)

export default function TryItOutPage() {
  const [output, setOutput] = React.useState(<span>Results will appear when code is run</span>)
  const [isError, setIsError] = React.useState(false)
  const [disassembled, setDisassembled] = React.useState('; The compiled bytecode will be displayed here when the "Run code" button is pressed')
  const [example, setExample] = React.useState<Example>('greeting')

  const handleNoWasm = React.useCallback(() => {
    setOutput(noWasmMessage)
    setDisassembled('There was an error initializing the abra wasm module. Please verify that your browser supports webassembly, or try again.')
  }, [])

  const onCheckCode = React.useCallback(async (error: 'wasm' | string | null) => {
    if (error === 'wasm') return handleNoWasm

    const output = error ? <pre>{error}</pre> : <span/>
    setOutput(output)
    setIsError(!!error)
  }, [handleNoWasm])

  const onRunCode = React.useCallback(async (result: any, error: string | null, code: string) => {
    const output = error ? <pre>{error}</pre> : <span>{JSON.stringify(result)}</span>
    setOutput(output)

    const disassembly = await disassemble(code)
    if (disassembly && disassembly.success) {
      setDisassembled(disassembly.disassembled)
    }
  }, [])

  return (
    <Section>
      <Title>
        Try It Out
        <ExampleDropdownContainer>
          <label>Example</label>
          <div style={{ width: 200 }}>
            <Dropdown
              className="dropdown"
              value={example}
              options={[
                { value: 'greeting', label: 'Basic Greeting' },
                { value: 'fibonacci', label: 'Fibonacci' },
                { value: 'fizzbuzz', label: 'Fizzbuzz' },
                { value: 'linked-list', label: 'Linked List (ish)' }
              ]}
              onChange={({ value }) => {
                setExample(value as Example)
                setOutput(<span/>)
                setIsError(false)
              }}
            />
          </div>
        </ExampleDropdownContainer>
      </Title>

      <CodeMirrorEditor
        value={codeExamples[example]}
        onRun={onRunCode}
        onCheck={onCheckCode}
      />

      <Tabs
        tabs={[
          {
            title: 'Results',
            renderContents: () => (
              <ResultsView>
                {!isError && '> '}{output}
              </ResultsView>
            )
          },
          {
            title: 'Bytecode',
            renderContents: () => (
              <Code language="abrac">
                {disassembled}
              </Code>
            )
          }
        ]}
      />

      <h4>What's going on here?</h4>
      <p>
        This works because the entire language toolchain (lexer, parser, typechecker, compiler, and virtual machine) is
        compiled to <ExternalLink href="https://webassembly.org/">WebAssembly</ExternalLink>. The same code that powers
        the native compiler is also running here, with minor amounts of glue code needed to bridge the gap.
      </p>
    </Section>
  )
}

const Title = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ResultsView = styled.code`
  flex: 1;
  background-color: #2B2B2B;
  border-radius: 6px;
  color: white;
  padding: 16px;
  max-height: 100px;
  overflow: scroll;
  margin: 1em 0;
  border: 1px solid #2B2B2B;
  font-size: 13px;
  
  a, a:visited {
    color: lightskyblue;
    text-decoration: underline;
  }
`

const ExampleDropdownContainer = styled.div`
  margin-bottom: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  
  label {
    font-weight: bold;
    margin-right: 12px;
  }
`
