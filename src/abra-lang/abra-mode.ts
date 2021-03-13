// @ts-ignore (there's no definition in the .d.ts file for the lib/codemirror export, but it's there)
import CodeMirror from 'codemirror/lib/codemirror'
import { Mode, StringStream } from 'codemirror'

type HandlerFn = (stream: StringStream, state: ModeState) => string | null

interface ModeState {
  baseCol: number,
  indentDepth: number,
  current: HandlerFn,
  definedTypes: string[]
}

CodeMirror.defineMode('abra', () => {
  const keywords = ['val', 'var', 'func', 'if', 'else', 'for', 'in', 'while', 'break', 'type', 'None', 'self', 'enum', 'import', 'from', 'export']
  const indentTokens = ['{', '[', '(']
  const unindentTokens = ['}', ']', ')']

  function normal(stream: StringStream, state: ModeState) {
    const ch = stream.next()
    if (!ch) return null

    if (ch === '"') {
      state.current = string(ch)
      return state.current(stream, state)
    }
    if (ch === '/') {
      if (stream.eat('/')) {
        stream.skipToEnd()
        return 'comment'
      } else if (stream.eat('*')) {
        state.current = multiLineComment()
        return 'comment'
      }
    }
    if (/\d/.test(ch)) {
      stream.eatWhile(/\w.%/)
      return 'number'
    }
    if (/[\w_]/.test(ch)) {
      stream.eatWhile(/[\w\d_]/)
      if (stream.eat('(')) {
        stream.backUp(1)
        return 'qualifier'
      } else if (stream.eat('<')) {
        let backupNum = 1
        let ch = stream.peek()
        while (ch && ch !== '>') {
          ch = stream.next()
          backupNum++
        }
        if (stream.next() === '(') {
          stream.backUp(backupNum + 1)
          return 'qualifier'
        }
        stream.backUp(backupNum - 1)
      }

      return 'variable'
    }
    return null
  }

  function multiLineComment(): HandlerFn {
    return function (stream, state) {
      let ch = stream.next()
      while (ch) {
        if (ch === '*' && stream.eat('/')) {
          state.current = normal
          return 'comment'
        }
        ch = stream.next()
      }
      return 'comment'
    }
  }

  function string(quote: string): HandlerFn {
    return function (stream, state) {
      let escaped = false
      let ch: string | null
      while ((ch = stream.next()) != null) {
        if (ch === quote && !escaped)
          break
        escaped = !escaped && ch === '\\'
      }
      if (!escaped)
        state.current = normal
      return 'string'
    }
  }

  function type(stream: StringStream, state: ModeState) {
    const typeName = []
    let ch = stream.peek()
    while (ch && /\w/.test(ch)) {
      typeName.push(stream.next())
      ch = stream.peek()
    }
    state.definedTypes.push(typeName.join(''))
    state.current = normal
    return 'variable-2'
  }

  const mode: Mode<ModeState> = {
    startState() {
      return {
        baseCol: 0,
        indentDepth: 0,
        current: normal,
        definedTypes: ['Bool', 'Int', 'Float', 'String', 'Unit']
      }
    },
    token(stream, state) {
      if (stream.eatSpace()) return null
      const style = state.current(stream, state)
      const word = stream.current()

      if (word === 'type' || word === 'enum') {
        state.current = type
      }

      if (style === 'comment') return style

      if (style === 'variable') {
        if (keywords.includes(word)) return 'keyword'
        else {
          if (state.definedTypes.includes(word)) return 'variable-2'
          if (!word.includes('<')) return null

          const baseType = word.substring(0, word.indexOf('<'));
          if (state.definedTypes.includes(baseType)) {
            stream.backUp(word.length - baseType.length)
            return 'variable-2'
          }
        }
        return null
      }

      if (indentTokens.includes(word)) state.indentDepth++
      else if (unindentTokens.includes(word)) state.indentDepth--

      return style
    },
    indent(state, textAfter) {
      const indentUnit = 2
      const isClosing = unindentTokens.includes(textAfter)

      return state.baseCol + indentUnit * (state.indentDepth - (isClosing ? 1 : 0))
    },
    electricChars: ')]}',
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/'
  }
  return mode
})
