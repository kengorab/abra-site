import React from 'react'
import styled from 'styled-components'
import { Header, MainFullWidth } from '../../components/Layout'
import CodeMirrorEditor from '../../components/CodeMirrorEditor'
import examples, { Example } from './examples'

const defaultOutput = <span>Results will appear when code is run</span>

const ExternalLink = ({ href, children }: { href: string, children: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>

const noWasmMessage = (
  <span>
    There was an error initializing the abra wasm module. Please verify that your
    browser <ExternalLink href="https://caniuse.com/#feat=wasm">supports webassembly</ExternalLink>, or
    try again.
  </span>
)

interface State {
  example: Example,
  isRunning: boolean,
  output: JSX.Element[],
  isError: boolean,
}

export default class TryItOutPage2 extends React.Component<{}, State> {
  editorRef = React.createRef<CodeMirrorEditor>()

  state: State = {
    example: 'fizzbuzz',
    output: [defaultOutput],
    isRunning: false,
    isError: false
  }

  handleNoWasm = () => this.setState({ output: [noWasmMessage] })

  handleCheckCode = async (error: 'wasm' | string | null) => {
    if (error === 'wasm') return this.handleNoWasm()

    // Don't modify output if there's no error now and there wasn't before
    if (!error && !this.state.isError) return

    const output = error ? <pre>{error}</pre> : defaultOutput
    this.setState({ output: [output], isError: !!error })
  }

  run = () => {
    if (!this.editorRef.current) return

    this.setState({ output: [], isRunning: true })
    this.editorRef.current.run()
  }

  handleStdout = (...args: any[]) => {
    this.setState({
      output: [...this.state.output, <span>{args.join(' ')}</span>]
    })
  }

  handleResult = async (result: any, error: string | null) => {
    this.setState({ isRunning: false })

    if (error) {
      this.setState({ output: ([<pre>{error}</pre>]) })
    } else if (result) {
      this.setState({ output: ([...this.state.output, <span>{JSON.stringify(result)}</span>]) })
    }
  }

  renderControlBar = () => {
    const { isRunning, isError } = this.state

    return (
      <ControlBar>
        <ControlBarButton onClick={this.run} disabled={isRunning || isError}>
          &#x25B6; Run
        </ControlBarButton>

        <div>
          <label htmlFor="example" style={{ marginRight: 12, fontWeight: 'bold', fontSize: 14 }}>
            Example:
          </label>
          <Select
            id="example"
            value={this.state.example}
            onChange={e => this.setState({ example: e.target.value as Example })}
          >
            {Object.entries(examples).map(([value, { label }]) =>
              <option key={value} value={value}>{label}</option>
            )}
          </Select>
        </div>
      </ControlBar>
    )
  }

  render() {
    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <Header darkMode fullWidth title="Abra Playground"/>

        <MainFullWidth>
          <TwoColumnView>
            <EditorPane>
              {this.renderControlBar()}

              <CodeMirrorEditor
                ref={this.editorRef}
                value={examples[this.state.example].code}
                onCheck={this.handleCheckCode}
                onStdout={this.handleStdout}
                onResult={this.handleResult}
              />
            </EditorPane>
            <ResultsPane>
              <ResultsView>
                {this.state.output.length
                  ? this.state.output.map((line, idx) => <div key={idx}>{line}</div>)
                  : <div><span>&nbsp;</span></div>
                }
              </ResultsView>
            </ResultsPane>
          </TwoColumnView>
        </MainFullWidth>
      </div>
    )
  }
}

const TwoColumnView = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const EditorPane = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
`

const ResultsPane = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #445f6f;
  border-top: none;
  overflow: scroll;
  
  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid #445f6f;
  }
`

const Select = styled.select`
  margin: -12px;
  padding: 12px;
  outline: none;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 200ms ease;
  
  &:hover {
    background: rgba(255,255,255,0.10);
  }
`

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #35424a;
  color: white;
  padding: 12px;
`

const ControlBarButton = styled.button`
  padding: 12px;
  transition: background-color 200ms ease;
  background: ${({ disabled }) => disabled ? '#8d9287' : '#69a710'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  color: white;
  border: none;
  outline: none;
  margin: -12px;
  
  &:hover {
    background: ${({ disabled }) => disabled ? '#8d9287' : '#72b111'};
  }
  
  &:active {
    background: #588c0f;
  }
`

const ResultsView = styled.code`
  flex: 1;
  background-color: #2B2B2B;
  color: white;
  padding: 16px;
  overflow: scroll;
  font-size: 13px;
  
  a, a:visited {
    color: lightskyblue;
    text-decoration: underline;
  }
`
