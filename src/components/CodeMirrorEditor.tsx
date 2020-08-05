import * as React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { getSettings, saveSettings } from '../util/local-storage'
import playButton from '../img/ui-play.svg'
import resetButton from '../img/refresh.svg'
import { run, typecheck } from '../abra-lang/wrapper'
import * as codemirror from 'codemirror'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/keymap/vim'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import '../abra-lang/abra-mode'

interface Props {
  value: string,
  onCheck: (error: 'wasm' | string | null) => void,
  onRun: (result: any, error: string | null, code: string) => void
}

interface State {
  isRunning: boolean,
  isTypecheckError: boolean,
  code: string,
  useVimMode: boolean
}

const codeMirrorOpts = {
  mode: 'abra',
  theme: 'material',
  lineNumbers: true,
  lineWrapping: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  autofocus: true
}

export default class AbraEditor extends React.Component<Props, State> {
  handle = 0
  marks: codemirror.TextMarker[] = []

  constructor(props: Props) {
    super(props)

    this.state = {
      isRunning: false,
      isTypecheckError: false,
      code: props.value,
      useVimMode: getSettings().vimModeEnabled
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.value !== prevProps.value) {
      this.setState({ code: this.props.value })
    }
  }

  run = async () => {
    const { code } = this.state

    this.setState({ isRunning: true })

    try {
      const result = await run(code)
      if (result.success) {
        const { data } = result
        this.props.onRun(data, null, code)
      } else {
        this.props.onRun(null, result.errorMessage.trimStart(), code)
      }
    } catch (e) {
      console.error(e)
      this.props.onRun(null, 'Something went wrong, check console', code)
    } finally {
      this.setState({ isRunning: false })
    }
  }

  typecheck = async (editor: codemirror.Editor, code: string) => {
    try {
      const result = await typecheck(code)
      if (result && !result.success) {
        this.setState({ isTypecheckError: true })
        this.props.onCheck(result.errorMessage.trimStart())

        if (result.error.range) {
          const { start, end } = result.error.range
          const from = { line: start[0] - 1, ch: start[1] - 1 }
          const to = { line: end[0] - 1, ch: end[1] }
          const mark = editor.getDoc().markText(from, to, { className: 'error-underline' })
          this.marks.push(mark)
        }
      } else {
        this.props.onCheck(null)
      }
    } catch {
      this.props.onCheck('wasm')
    }
  }

  onChange = (editor: codemirror.Editor, _: codemirror.EditorChange, value: string) => {
    this.marks.forEach(mark => mark.clear())

    this.setState({ isTypecheckError: false, code: value })

    clearTimeout(this.handle)
    this.handle = setTimeout(() => this.typecheck(editor, value), 1000)
  }

  render() {
    const { value } = this.props
    const { code, useVimMode, isRunning, isTypecheckError } = this.state

    return (
      <>
        <CodeMirrorStyles/>
        <CodeMirror
          value={code}
          autoCursor={false}
          options={{ ...codeMirrorOpts, keyMap: useVimMode ? 'vim' : 'default' }}
          onChange={this.onChange}
        />
        <Controls>
          <ButtonGroup>
            <Button
              onClick={this.run}
              disabled={isRunning || isTypecheckError}
            >
              <IconImg src={playButton} alt="Play button"/>
              <span>{isRunning ? 'Running...' : 'Run code'}</span>
            </Button>
            <Button onClick={() => this.setState({ code: value })} disabled={isRunning}>
              <IconImg src={resetButton} alt="Reset button"/>
              <span>Reset code</span>
            </Button>
          </ButtonGroup>
          <Label htmlFor="use-vim-mode">
            <input
              id="use-vim-mode"
              type="checkbox"
              checked={useVimMode}
              onChange={e => {
                this.setState({ useVimMode: e.target.checked })
                saveSettings({ vimModeEnabled: e.target.checked })
              }}
            />
            Use vim mode
          </Label>
        </Controls>
      </>
    )
  }
}

const Controls = styled.aside`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #3c3f41;
  border-top: solid 1px #515151;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`

const ButtonGroup = styled.div`
  display: flex;
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 2px;
  background: transparent;
  transition: all 200ms ease-in-out;
  color: white;
  font-size: 12px;
  line-height: 12px;
  
  &:hover {
    background: rgba(255,255,255,.125);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.75;
    
    &:hover {
      background: transparent;
    }
  }
`

const Label = styled.label`
  color: white;
  font-size: 12px;
  display: flex;
`

const IconImg = styled.img`
  width: 12px;
  margin-right: 4px;
`

const CodeMirrorStyles = createGlobalStyle`
  .CodeMirror {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding-top: 12px;
    
    .error-underline {
      text-decoration: underline red;
      background: #ff000077; 
    }
  }
`
