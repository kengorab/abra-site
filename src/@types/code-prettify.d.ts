declare module 'code-prettify' {
  type LexerRule = [string, RegExp] | [string, RegExp, null] | [string, RegExp, null, string | undefined]

  export class PR {
    prettyPrint()

    registerLangHandler(lexer: PRLexer, languages: string[])

    createSimpleLexer(
      shortcutStylePatterns: LexerRule[],
      fallthroughStylePatterns: LexerRule[]
    ): PRLexer

    PR_PLAIN: string
    PR_STRING: string
    PR_COMMENT: string
    PR_STRING: string
    PR_KEYWORD: string
    PR_LITERAL: string
    PR_TYPE: string
    PR_TAG: string
    PR_PLAIN: string
    PR_PUNCTUATION: string
  }

  declare global {
    interface Window {
      PR: PR
    }
  }

  interface PRLexer {
  }
}