import * as React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { getSettings, saveSettings } from '../util/local-storage'
import playButton from '../img/ui-play.svg'
import resetButton from '../img/refresh.svg'
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
  onRun: (code: string) => Promise<any>
}

export default function Editor({ value, onRun }: Props) {
  const [running, setRunning] = React.useState(false)
  const [code, setCode] = React.useState(value)
  const [useVimMode, setUseVimMode] = React.useState(getSettings().vimModeEnabled)

  // Reset code when props.value changes
  React.useEffect(() => void setCode(value), [value])

  return (
    <>
      <CodeMirrorStyles/>
      <CodeMirror
        value={code}
        autoCursor={false}
        options={{
          mode: 'abra',
          theme: 'material',
          lineNumbers: true,
          lineWrapping: true,
          autoCloseBrackets: true,
          matchBrackets: true,
          keyMap: useVimMode ? 'vim' : 'default',
          autofocus: true
        }}
        onChange={(_, __, value) => setCode(value)}
      />
      <Controls>
        <ButtonGroup>
          <Button
            onClick={async () => {
              setRunning(true)
              await onRun(code)
              setRunning(false)
            }}
            disabled={running}
          >
            <IconImg src={playButton} alt="Play button"/>
            <span>{running ? 'Running...' : 'Run code'}</span>
          </Button>
          <Button onClick={() => setCode(value)} disabled={running}>
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
              setUseVimMode(e.target.checked)
              saveSettings({ vimModeEnabled: e.target.checked })
            }}
          />
          Use vim mode
        </Label>
      </Controls>
    </>
  )
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
  transition: background-color 200ms ease-in-out;
  color: white;
  font-size: 12px;
  line-height: 12px;
  
  &:hover {
    background: rgba(255,255,255,.125);
  }
  
  &:disabled {
    cursor: not-allowed;
    
    &:hover {
      background: transparent;
    }
  }
`

const Label = styled.label`
  color: white;
  font-size: 12px;
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
  }
`
