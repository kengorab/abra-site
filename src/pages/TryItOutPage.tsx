import * as React from 'react'
import styled from 'styled-components'
import init, { runAsync, disassemble } from 'abra_wasm'
import { Section } from '../components/Layout'
import CodeMirrorEditor from '../components/CodeMirrorEditor'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Tabs from '../components/Tabs'
import Code from '../components/Code'

type Example = 'greeting' | 'fibonacci' | 'fizzbuzz'

const codeExamples: Record<Example, string> = {
  'greeting': `val greeting = "Hello"

func greet(recipient: String) = greeting + ", " + recipient

val languageName = "Abra"
greet(languageName)
`,
  'fibonacci': `func fib(n: Int): Int {
  if (n == 0) {
    0
  } else if (n == 1) {
    1
  } else {
    fib(n - 2) + fib(n - 1)
  }
}

fib(10)`,
  'fizzbuzz': `// Hint: Check the console for println outputs!

for a in range(1, 101) {
  if a % 15 == 0 {
    println("Fizzbuzz")
  } else if a % 3 == 0 {
    println("Fizz")
  } else if a % 5 == 0 {
    println("Buzz")
  } else {
    println(a)
  }
}`
}

const ExternalLink = ({ href, children }: { href: string, children: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>

let abraInitPromise: Promise<any> | null = null

export default function TryItOutPage() {
  const [output, setOutput] = React.useState(<span>Results will appear when code is run</span>)
  const [disassembled, setDisassembled] = React.useState('; The compiled bytecode will be displayed here when the "Run code" button is pressed')
  const [example, setExample] = React.useState<Example>('fizzbuzz')

  const runCode = React.useCallback(async (code: string) => {
    try {
      if (!abraInitPromise) {
        abraInitPromise = init('abra_wasm/abra_wasm_bg.wasm')
      }
      await abraInitPromise
    } catch (err) {
      setOutput(<span>
        There was an error initializing the abra wasm module. Please verify that your
        browser <ExternalLink href="https://caniuse.com/#feat=wasm">supports webassembly</ExternalLink>, or
        try again.
      </span>)
      console.error(err)
      return
    }

    const result = await runAsync(code)
    if (Array.isArray(result)) {
      setOutput(<span>{`[${result.join(', ')}]`}</span>)
    } else {
      setOutput(<span>{result}</span>)
    }

    const output = disassemble(code)
    if (output && output.success) {
      setDisassembled(output.disassembled)
    } else {
      setDisassembled('There was an error initializing the abra wasm module. Please verify that your browser supports webassembly, or try again.')
    }
  }, [])

  return (
    <Section>
      <h1>Try It Out</h1>
      <p>
        Press the 'Run code' button below to execute the example code. Results will appear in the result box beneath the
        editor. You can make any changes you wish to the code in the editor and run it, but keep in mind that the
        language is still very much a work-in-progress, and bugs / unexpected results may arise.
      </p>
      <p>
        Please also note that errors of any kind (syntax, type, etc) will currently <em>not</em> be surfaced in this
        editor. That feature is Coming&nbsp;Soon&nbsp;&trade;. Also note that any output of
        the <code>println</code> builtin will be sent to the console, so be sure to check there.
      </p>
      <ExampleDropdownContainer>
        <label>Example</label>
        <Dropdown
          value={example}
          options={[
            { value: 'greeting', label: 'Basic Greeting' },
            { value: 'fibonacci', label: 'Fibonacci' },
            { value: 'fizzbuzz', label: 'Fizzbuzz' }
          ]}
          onChange={({ value }) => setExample(value as Example)}
        />
      </ExampleDropdownContainer>

      <CodeMirrorEditor value={codeExamples[example]} onRun={runCode}/>

      <Tabs
        tabs={[
          {
            title: 'Results',
            renderContents: () => (
              <>
                <p>Note: Output of <code>println</code> will appear in the console, not in this results box</p>
                <ResultsView>
                  >&nbsp;{output}
                </ResultsView>
              </>
            )
          },
          {
            title: 'Bytecode',
            renderContents: () => (
              <>
                <p>Documentation for bytecode instructions can be found <a href="/docs/vm">here</a></p>
                <Code language="abrac" style={{ marginTop: 0 }}>
                  {disassembled}
                </Code>
              </>
            )
          }
        ]}
      />

      <h2>What's going on here?</h2>
      <p>
        This works because the entire language toolchain (lexer, parser, typechecker, compiler, and virtual machine) is
        compiled to <ExternalLink href="https://webassembly.org/">WebAssembly</ExternalLink>. The same code that powers
        the native compiler is also running here, with minor amounts of glue code needed to bridge the gap.
      </p>
    </Section>
  )
}

const ResultsView = styled.code`
  flex: 1;
  background-color: #2B2B2B;
  border-radius: 6px;
  color: white;
  padding: 24px;
  font-size: 12px;
  max-height: 100px;
  overflow: scroll;
  
  a, a:visited {
    color: lightskyblue;
    text-decoration: underline;
  }
`

const ExampleDropdownContainer = styled.div`
  margin-bottom: 12px;
  
  label {
    font-weight: bold;
    margin-right: 12px;
  }
`
