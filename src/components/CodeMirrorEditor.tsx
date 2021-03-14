import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { ModuleReader } from '@kengorab/abra_wasm'
import { getSettings } from '../util/local-storage'
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

interface ModuleManager extends ModuleReader {
  update(moduleName: string, code: string): void
}

interface Props {
  value: string,
  moduleName: string,
  moduleReader: ModuleManager,
  onCheck: (error: 'wasm' | string | null) => void,
  onStdout: (input: string, kind?: 'success' | 'info') => void,
  onResult: (result: any, error: string | null, code: string) => void
}

interface State {
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
  autofocus: true,
  viewportMargin: Infinity
}

export default class AbraEditor extends React.Component<Props, State> {
  handle = 0
  marks: codemirror.TextMarker[] = []

  constructor(props: Props) {
    super(props)

    this.state = {
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
    const { moduleName, moduleReader, onStdout, onResult } = this.props
    const { code } = this.state

    onStdout(`Running ${moduleName}`, 'success')
    try {
      const result = await run(moduleName, moduleReader, { println: onStdout })
      if (result.success) {
        const { dataToString } = result
        onResult(dataToString, null, code)
      } else {
        onResult(null, result.errorMessage.trimStart(), code)
      }
    } catch (e) {
      console.error(e)
      onResult(null, 'Something went wrong, check console', code)
    }
  }

  typecheck = async (editor: codemirror.Editor, code: string) => {
    const { moduleName, moduleReader, onCheck } = this.props

    try {
      moduleReader.update(moduleName, code)
      const result = await typecheck(moduleName, moduleReader)
      if (result && !result.success) {
        this.setState({ isTypecheckError: true })
        onCheck(result.errorMessage.trimStart())

        if (result.error.range) {
          const { start, end } = result.error.range
          const from = { line: start[0] - 1, ch: start[1] - 1 }
          const to = { line: end[0] - 1, ch: end[1] }
          const mark = editor.getDoc().markText(from, to, { className: 'error-underline' })
          this.marks.push(mark)
        }
      } else {
        onCheck(null)
      }
    } catch {
      onCheck('wasm')
    }
  }

  onChange = (editor: codemirror.Editor, _: codemirror.EditorChange, value: string) => {
    this.marks.forEach(mark => mark.clear())

    this.setState({ isTypecheckError: false, code: value })

    clearTimeout(this.handle)
    this.handle = setTimeout(() => this.typecheck(editor, value), 500)
  }

  render() {
    const { code, useVimMode } = this.state

    return (
      <>
        <CodeMirrorStyles/>
        <CodeMirror
          value={code}
          autoCursor={false}
          options={{ ...codeMirrorOpts, keyMap: useVimMode ? 'vim' : 'default' }}
          onChange={this.onChange}
        />
      </>
    )
  }
}

const CodeMirrorStyles = createGlobalStyle`
  .react-codemirror2 {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .CodeMirror {
    flex: 1;
    padding-top: 12px;

    .error-underline {
      text-decoration: underline red;
      background: #ff000077;
    }
  }
`
