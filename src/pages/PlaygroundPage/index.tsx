import React from 'react'
import styled from 'styled-components'
import { Header, MainFullWidth } from '../../components/Layout'
import CodeMirrorEditor from '../../components/CodeMirrorEditor'
import examples, { Example, ExampleModule } from './examples'

const ExternalLink = ({ href, children }: { href: string, children: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>

interface State {
  example: Example,
  currentTab: ExampleModule,
  isRunning: boolean,
  output: JSX.Element[],
  isError: boolean,
}

const STARTING_EXAMPLE = examples[5]

export default class PlaygroundPage extends React.Component<{}, State> {
  editorRef = React.createRef<CodeMirrorEditor>()

  defaultOutput = <ConsoleMessage kind="info">Results will appear when code is run</ConsoleMessage>

  noWasmMessage = (
    <ConsoleMessage kind="error">
      There was an error initializing the abra wasm module.<br/>
      Please verify that your browser <ExternalLink href="https://caniuse.com/#feat=wasm">supports
      webassembly</ExternalLink>,
      or try again.
    </ConsoleMessage>
  )

  moduleReader = {
    readModule: (moduleName: string) => {
      const module = this.state.example.modules.find(m => m.name === moduleName)
      if (!module) return null
      return module.code
    },
    update: (moduleName: string, code: string) => {
      const example = this.state.example
      example.modules.find(m => m.name === moduleName)!.code = code

      this.setState({ example })
    }
  }

  state: State = {
    example: STARTING_EXAMPLE,
    currentTab: STARTING_EXAMPLE.modules[0],
    output: [this.defaultOutput],
    isRunning: false,
    isError: false
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardShortcut)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboardShortcut)
  }

  handleKeyboardShortcut = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.run()
    }
  }

  addOutput = (output: JSX.Element, clobber = false) => {
    const newOutput = clobber ? [output] : this.state.output.concat(output)
    this.setState({ output: newOutput })
  }

  handleCheckCode = async (error: 'wasm' | string | null) => {
    if (error === 'wasm') return this.addOutput(this.noWasmMessage, true)

    // Don't modify output if there's no error now and there wasn't before
    if (!error && !this.state.isError) return

    const output = error ? <ConsoleMessage kind="error">{error}</ConsoleMessage> : this.defaultOutput
    this.addOutput(output, true)
    this.setState({ isError: !!error })
  }

  run = () => {
    if (!this.editorRef.current) return

    this.setState({ output: [], isRunning: true }, () => {
      new Promise(res => setTimeout(res, 50)).then(() => {
        this.editorRef.current!.run()
      })
    })
  }

  handleStdout = (input: string, kind: 'success' | 'info' = 'info') => {
    this.addOutput(<ConsoleMessage kind={kind}>{input}</ConsoleMessage>)
  }

  handleResult = async (result: any, error: string | null) => {
    this.setState({ isRunning: false })

    if (error) {
      this.addOutput(<ConsoleMessage kind="error">{error}</ConsoleMessage>, true)
    } else {
      const msg = result
        ? <ConsoleMessage kind="normal">&gt; {result}</ConsoleMessage>
        : <ConsoleMessage kind="normal">&gt; (module returned no data)</ConsoleMessage>
      this.addOutput(msg)
    }
  }

  selectExample = (exampleName: string) => {
    const example = examples.find(ex => ex.label === exampleName)!

    this.addOutput(this.defaultOutput)
    this.setState({
      example,
      currentTab: Object.values(example.modules)[0],
      output: [this.defaultOutput]
    })
  }

  selectTab = (name: string) => {
    this.setState({
      currentTab: this.state.example.modules.find(m => m.name === name)!
    })
  }

  renderControlBar = () => {
    const { example, currentTab, isRunning, isError } = this.state

    return (
      <ControlBar>
        <TabsSection>
          {example.modules.map(({ name, label }) =>
            <Tab
              key={name}
              active={label === currentTab.label}
              onClick={() => this.selectTab(name)}
            >
              {label} <XButton style={{ marginLeft: 12 }}>⨉</XButton>
            </Tab>
          )}
          {/*<NewTabButton active={false}>+ New</NewTabButton>*/}
        </TabsSection>
        <ControlsSection>
          <ControlBarButton title="Hint: cmd+enter to run" onClick={this.run} disabled={isRunning || isError}>
            &#x25B6; Run
          </ControlBarButton>
          <div style={{ marginLeft: 12, marginRight: 12 }}>
            <label htmlFor="example" style={{ marginRight: 12, fontWeight: 'bold', fontSize: 14 }}>
              Example:
            </label>
            <Select
              id="example"
              value={this.state.example.label}
              onChange={e => this.selectExample(e.target.value)}
            >
              {examples.map(({ label }) =>
                <option key={label} value={label}>{label}</option>
              )}
            </Select>
          </div>
        </ControlsSection>
      </ControlBar>
    )
  }

  render() {
    const { currentTab, output } = this.state

    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <Header darkMode fullWidth title="Abra Playground"/>

        <MainFullWidth>
          <EditorPane>
            {this.renderControlBar()}

            <CodeMirrorEditor
              ref={this.editorRef}
              value={currentTab.code}
              moduleName={currentTab.name}
              moduleReader={this.moduleReader}
              onCheck={this.handleCheckCode}
              onStdout={this.handleStdout}
              onResult={this.handleResult}
            />
          </EditorPane>
          <ResultsPane>
            <ResultsView>
              {output.length
                ? output.map((line, idx) => <div key={idx}>{line}</div>)
                : <div><span>&nbsp;</span></div>
              }
            </ResultsView>
          </ResultsPane>
        </MainFullWidth>
      </div>
    )
  }
}

const XButton = styled.span`
  display: none; // TODO: Build functionality for this (and the NewTabButton)
  cursor: pointer;
  opacity: 0;
  transition: opacity 100ms ease-in-out;
`

const Tab = styled.div<{ active: boolean }>`
  user-select: none;
  display: flex;
  align-items: center;
  padding: 12px 18px;
  cursor: pointer;
  background: ${({ active }) => active ? '#263238' : 'transparent'};
  transition: background-color 100ms ease-in-out;

  &:hover {
    ${XButton} {
      opacity: 0.5;

      &:hover {
        opacity: 1;
      }
    }
  }
`

// const NewTabButton = styled(Tab)`
//   color: rgba(255, 255, 255, 0.75);
//   transition: color 100ms ease-in-out;
//
//   &:hover {
//     color: white;
//     background: #263238;
//   }
// `

const EditorPane = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
`

const ResultsPane = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #445f6f;
  overflow: scroll;
`

const Select = styled.select`
  margin-top: 2px;
  padding: 12px;
  outline: none;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 200ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.10);
  }
`

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #35424a;
  color: white;

  @media (max-width: 624px) {
    flex-direction: column-reverse;
  }
`

const TabsSection = styled.section`
  display: flex;
  overflow-x: scroll;
`

const ControlsSection = styled.section`
  display: flex;
  min-width: 300px;

  @media (max-width: 624px) {
    background: #4d7388;
    justify-content: space-between;
  }
`

const ControlBarButton = styled.button`
  padding: 12px;
  transition: background-color 200ms ease;
  background: ${({ disabled }) => disabled ? '#8d9287' : '#69a710'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  color: white;
  border: none;
  outline: none;

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

type ConsoleMessageKind = 'success' | 'info' | 'error' | 'normal'
const ConsoleMessage = styled.pre<{ kind: ConsoleMessageKind }>`
  margin: 0;
  white-space: pre-wrap;
  color: ${({ kind }) => ({
    success: 'limegreen',
    info: '#aaa',
    error: 'red',
    normal: 'white'
  })[kind]};
`
