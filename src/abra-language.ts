import { createGlobalStyle } from 'styled-components'

export const VsCodeThemeStyles = createGlobalStyle`
  pre.prettyprint { display: block; background-color: #1e1e1e; }
  pre .str { color: #ffa0a0; } // string
  pre .kwd { color: #569cd6; font-weight: bold; } // keyword
  pre .com { color: #6c9d5a; } // comment
  pre .typ { color: #4ec9b0; } // type
  pre .lit { color: #cd5c5c; } // literal
  pre .pun { color: #bfbfbf; } // punctuation
  pre .pln { color: #ffffff; } // plaintext / identifiers
  pre .dec { color: #b5cea8; } // decimal
`

export function registerAbraLang() {
  const { PR } = window
  const lexer = window.PR.createSimpleLexer(
    [
      // Whitespace
      [PR['PR_PLAIN'], /^[\t\n\r \xA0]+/, null, '\t\n\r \xA0']
    ],
    [
      // Single-line comments
      [PR['PR_COMMENT'], /^\/\/(?:.*)/],

      // Multi-line comments
      [PR['PR_COMMENT'], /^\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//],

      // Double-quoted strings
      [PR['PR_STRING'], /^r?"("|(?:[^\n\r\f])*?[^\\]")/],

      // Keywords for constants
      [PR['PR_KEYWORD'], /^\b(?:false|true)\b/i],

      // Other keywords
      [PR['PR_KEYWORD'], /^\b(?:func|type|val|var|if|else|for|in|while|break)\b/i],

      // Types are typically capitalized
      [PR['PR_TYPE'], /^[A-Z]\w*/],

      // Numbers
      [PR['PR_LITERAL'], /^\b\d+(?:\.\d*)?(?:e[+-]?\d+)?/i],

      // Identifiers
      [PR['PR_PLAIN'], /^[a-z_$][a-z0-9_]*/i],

      // Punctuation
      [PR['PR_PUNCTUATION'], /^[(){}[\],.:;=+\-*/]/]
    ]
  )

  PR.registerLangHandler(lexer, ['abra'])
}
