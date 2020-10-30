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
import enums from './examples/enums'

type Example = 'greeting' | 'fibonacci' | 'fizzbuzz' | 'linked-list' | 'enums'

const codeExamples: Record<Example, string> = {
  'greeting': greeting,
  'fibonacci': fibonacci,
  'fizzbuzz': fizzbuzz,
  'linked-list': linkedList,
  'enums': enums
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

const defaultOutput = <span>Results will appear when code is run</span>

interface State {
  output: JSX.Element[],
  isError: boolean,
  disassembled: string,
  example: Example
}

export default class TryItOutPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      output: [defaultOutput],
      isError: false,
      disassembled: '; The compiled bytecode will be displayed here when the "Run code" button is pressed',
      example: 'linked-list'
    }
  }

  componentDidMount() {
    window.__abra_func__println = (...args: any[]) => {
      this.setState({
        output: [...this.state.output, <span>{args.join(' ')}</span>]
      })
    }
  }

  handleNoWasm = () => {
    this.setState({
      output: [noWasmMessage],
      disassembled: 'There was an error initializing the abra wasm module. Please verify that your browser supports webassembly, or try again.'
    })
  }

  handleCheckCode = async (error: 'wasm' | string | null) => {
    if (error === 'wasm') return this.handleNoWasm()

    // Don't modify output if there's no error now and there wasn't before
    if (!error && !this.state.isError) return

    const output = error ? <pre>{error}</pre> : defaultOutput
    this.setState({ output: [output], isError: !!error })
  }

  handleRunStart = () => this.setState({ output: [] })

  handleRunEnd = async (result: any, error: string | null, code: string) => {
    if (error) {
      this.setState({ output: ([<pre>{error}</pre>]) })
    } else if (result) {
      this.setState({ output: ([...this.state.output, <span>{JSON.stringify(result)}</span>]) })
    }

    const disassembly = await disassemble(code)
    if (disassembly && disassembly.success) {
      this.setState({ disassembled: disassembly.disassembled })
    }
  }

  render() {
    const { output, disassembled, example } = this.state

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
                  { value: 'linked-list', label: 'Linked List (ish)' },
                  { value: 'enums', label: 'Enums' }
                ]}
                onChange={({ value }) => {
                  this.setState({
                    example: value as Example,
                    output: [defaultOutput],
                    isError: false
                  })
                }}
              />
            </div>
          </ExampleDropdownContainer>
        </Title>

        <CodeMirrorEditor
          value={codeExamples[example]}
          onRunStart={this.handleRunStart}
          onRunEnd={this.handleRunEnd}
          onCheck={this.handleCheckCode}
        />

        <Tabs
          tabs={[
            {
              title: 'Results',
              renderContents: () => (
                <ResultsView>
                  {output.length
                    ? output.map(line => <div>{line}</div>)
                    : <div><span>&nbsp;</span></div>
                  }
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
          This works because the entire language toolchain (lexer, parser, typechecker, compiler, and virtual machine)
          is
          compiled to <ExternalLink href="https://webassembly.org/">WebAssembly</ExternalLink>. The same code that
          powers
          the native compiler is also running here, with minor amounts of glue code needed to bridge the gap.
        </p>
      </Section>
    )
  }
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
