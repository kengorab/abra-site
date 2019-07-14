import * as React from 'react'
import init, { run } from 'abra_wasm'
import { Section } from '../components/Layout'

export default function TryItOutPage() {
  const [output, setOutput] = React.useState('Loading...')

  React.useEffect(() => {
    init('abra_wasm/abra_wasm_bg.wasm')
      .then(() => {
        const output = run('1 + 1')
        setOutput(output)
      })
      .catch((err: any) => {
        console.error(err)
        setOutput(err.toString())
      })

  }, [])

  return (
    <Section>
      <h1>Try It Out</h1>

      <code>
        <pre>{output}</pre>
      </code>
    </Section>
  )
}
