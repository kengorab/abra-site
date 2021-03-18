import * as React from 'react'
import { Link } from 'react-router-dom'
import Code from '../components/Code'
import { Section } from '../components/Layout'

const githubLink = 'https://github.com/kengorab/abra-lang/projects'

export default function HomePage() {
  return (
    <Section>
      <h1>Welcome to Abra!</h1>
      <p>
        <b>Abra</b> is an open-source programming language with a focus on type-safety, simplicity, and ergonomics.
      </p>
      <p>
        It is still <em>very much</em> a work in progress, and things should be expected to change/break frequently.
        (Not even all of what I'd consider to be table-stakes language features have been fully implemented yet.
        You can check the <a href={githubLink}>projects</a> pages in Github to watch progress)
      </p>

      <h2>What's it look like?</h2>
      <Code>
        {`
          val greeting = "Hello"

          func getMessage(greetee: String) {
            greeting + ", " + greetee
          }

          println(getMessage("World!")) // Prints "Hello, World!"
         `}
      </Code>
      <p>
        It should feel familiar to modern languages like Kotlin or Rust. See more about the language
        features and design decisions in the <Link to="/docs">Documentation</Link> section.
      </p>
    </Section>
  )
}
