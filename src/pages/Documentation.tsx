import * as React from 'react'
import { HashLink } from 'react-router-hash-link'
import { Section } from '../components/Layout'
import styled from 'styled-components'
import Code from '../components/Code'

export default function DocumentationPage() {
  return (
    <Section>
      <DocSection>
        <LinkedH2 hash="literals">Literals</LinkedH2>
        <p>
          <b>Abra</b> has all the literal types you'd expect: integer and floating-point numbers, booleans, strings, and
          arrays. (Objects are not yet implemented!).
        </p>
        <Code>
          {`
            val int = 24
            val float = 1.618
            val boolean = true
            val string = "Hello"
            val array = [1, 2, 3]
          `}
        </Code>
      </DocSection>

      <DocSection>
        <LinkedH2 hash="variables">Variables</LinkedH2>
        <p>
          You probably noticed that the variable declarations above have no type indicator. Abra is a
          statically-typed language, but the typechecker will infer a variable's type whenever it can.
          This saves you from cluttering your code with redundant type annotations.
        </p>
        <p>
          Of course you can always explicitly specify the type of a variable, either for the sake of clarity
          or if Abra is having a tough time figuring it out. If a type annotation conflicts with the actual
          type of the variable's assignment, then a type error will be raised at compile-time.
        </p>
        <Code>
          {`
            val favoriteNumber: Int = 24
            val pairs: Int[][] = [[0, 1], [2, 3], [4, 5]]

            val incorrectType: Int = "Not an integer!" // This would result in a type error 
          `}
        </Code>

        <LinkedH3 hash="variables-mutability">Mutability</LinkedH3>
        <p>
          Variables also have a built-in notion of <em>mutability</em>, which is expressed via the
          keywords <code>val</code> and <code>var</code>. Variables declared with a <code>var</code> can be reassigned
          to with no issues, but a compile error will be raised when trying to reassign to a variable declared
          with <code>val</code>. This is very helpful because it allows you to declare <em>intent</em> of a variable;
          when a variable is declared with <code>var</code> it means, "hey, keep an eye out for this, it may change in
          the future", versus a <code>val</code> which can be safely assumed to never change its value.
        </p>
        <Code>
          {`
            val favoriteNumber = 24
            favoriteNumber = 37 // This would result in a compilation error
            
            var favoriteColor = "blue"
            favoriteColor = "purple" // This works just fine
          `}
        </Code>

        <LinkedH3 hash="variables-destructuring">Destructuring</LinkedH3>
        <p>
          <code>// TODO: Variable declaration via destructuring is not yet implemented</code>
        </p>
      </DocSection>

      <DocSection>
        <LinkedH2 hash="types">Types</LinkedH2>
        <p>
          <b>Abra</b> has some built-in types, representing the standard literal kinds but beginning with a capital
          letter. In <b>Abra</b>, types must always begin with a capital letter To declare
          an <code>Array</code> of a certain type, you use the square brackets (<code>[]</code>) suffix.
        </p>
        <Code>
          {`
            Int     // eg. 24
            Float   // eg. 3.14
            String  // eg. "Hello"
            Bool    // eg. false
            
            Int[]   // eg. [1, 2, 3]
            Int[][] // eg. [[1, 2], [3, 4]]
          `}
        </Code>
        <p>
          There's another special type in <b>Abra</b> called the <code>Option</code> type, which is denoted with the
          question-mark (<code>?</code>) suffix. This represents a value that <em>may</em> contain a value of that type,
          or it may not. A good example of this arises when indexing into an array:
        </p>
        <Code>
          {`
            val myArray = ["a", "b", "c"]
            val firstLetter: String = myArray[0] // This will result in a type error
            
            val letterC: String? = myArray[2] // This works just fine
          `}
        </Code>
        <p>
          It's important to understand the purpose of an <code>Optional</code> type in this case; when extracting a
          value out of an array of strings, there's no way of knowing whether an item will exist at that index. Some
          languages use a sentinel value (like <code>undefined</code> or <code>null</code>) to denote when no value
          existed at such an index, and some languages throw an exception and give up.
        </p>
        <p>
          <b>Abra</b> takes the middle
          road: an array indexing operation will always succeed and will always return a "box", which may or may not
          contain a value. One way to "unbox" this value is to use the <em>coalescing</em> operator (<code>?:</code>),
          also called the "Elvis operator" in some languages. This operator will either unbox
          the <code>Optional</code> and return what's inside, or will provide a given fallback.
        </p>
        <Code>
          {`
            val letters = ["a", "b", "c"]
            val letter1: String = letters[0] ?: "d" // This will unbox the Optional; letter1 = "a"
            val letter2: String = letters[15] ?: "z" // This will use the provided default "z"
            
            letters[2] ?: 12 // Type error, since the default does not match the type of the Optional
            
            "hello" ?: "world" // Type error, since the left-hand side "hello" is not an Optional
          `}
        </Code>

        <LinkedH3 hash="types-creating">Creating Types</LinkedH3>
        <p>
          <code>// TODO: Creating types is not yet implemented</code>
        </p>
      </DocSection>

      <DocSection>
        <LinkedH2 hash="functions">Functions</LinkedH2>
        <p>
          <b>Abra</b> has standalone, top-level functions (functions not tied to any object or instance), and also
          (eventually) methods (functions attached to a given type instance). Functions have names, any number of
          arguments and a body. Arguments must have type annotations describing the type of that argument; a return type
          annotation for the function is optional (<b>Abra</b> will infer this if not specified).
        </p>
        <p>
          A function's body can be a block which consists of many statements/expressions, the last of which will be the
          return value for that function. If a function's body consists of only 1 expression, you don't need a block.
        </p>
        <Code>
          {`
            func greaterThan(num1: Int, num2: Int): Bool {
              val gt = num1 > num2
              gt
            }
            
            // The above function could also be written like this, omitting the return 
            // type annotation and condensing the function body into a single expression
            func greaterThan(num1: Int, num2: Int) = num1 > num2
          `}
        </Code>

        <p>
          Functions are called by using parentheses to pass in arguments, much like you'd expect. In <b>Abra</b>, you
          may take a <em>named-arguments</em> approach to provide additional clarity, but the arguments must be passed
          in the expected order (the attached argument names are just to enhance readability). Any number of arguments
          may be named (it's not all-or-nothing), and it's especially recommended to use named-arguments when passing in
          a literal value (as opposed to a variable, which can have some intent ascribed to it via its name).
        </p>
        <Code>
          {`
            func getFullName(firstName: String, lastName: String) = firstName + " " + lastName
            
            getFullName("Turanga", "Leela")
            
            // To help reduce ambiguity ("did the firstName parameter come first, or the 
            // lastName?"), you can use named-arguments
            getFullName(firstName: "Turanga", lastName: "Leela")
          `}
        </Code>

        <p>
          <b>Abra</b> has support for recursive functions, but the function must have an explicit return type
          annotation.
          For example:
        </p>
        <Code>
          {`
            func fib(n: Int): Int {
            //                ^ Without this, an error would be raised
              if (n == 0) {
                0
              } else if (n == 1) {
                1
              } else {
                fib(n - 2) + fib(n - 1)
              }
            }
          `}
        </Code>
      </DocSection>
      <DocSection>
        <LinkedH2 hash="control">Control Flow</LinkedH2>

        <LinkedH3 hash="control-ifelse">If/Else</LinkedH3>
        <p>
          Conditional branching logic works in <b>Abra</b> as you might expect, similarly to standard C-like languages:
          a <code>boolean</code> expression is evaluated for truth or falseness, and then the applicable branch is
          run. <b>Abra</b> does <em>not</em> have implicitly "truthy" or "falsey" values; a
          strict <code>boolean</code> type must be passed.
        </p>
        <Code>
          {`
            val value = 24
            
            if (value > 30) {
              // Do something
            } else if (value > 20) {
              // Do something else
            } else {
              // Fallback option
            }
          `}
        </Code>

        <p>
          Where <b>Abra</b> differs from some other languages is in its inclusion of if/else <em>expressions</em>. In
          other words, an if/else-block can be used anywhere an expression can be used, and the last expression in the
          block will be its final value (this is similar to functions' return values).
        </p>
        <p>
          When an if/else block is treated as an expression, all branches must result in values of the same type.
          Branches having different types will be raised in a type error.
        </p>
        <Code>
          {`
            val tempCelsius = 24
            val desc = if (tempCelsius > 30) {
              val emoji = "🥵"
              "Way too hot! " + emoji
            } else if (tempCelsius < 5) {
              val emoji = "🥶"
              "Too cold! " + emoji
            } else {
              "This is perfect!"
            }
            desc  // "This is perfect!"
            
            val errorExample = if (tempCelsius > 30) {
              "Too hot!"
            } else {
              tempCelsius + 1  // This will result in an error, since both branches have different types
            }
          `}
        </Code>

        <p>
          It's also allowed to have an if expression without an else clause. This will produce a value whose type is
          wrapped in an <code>Optional</code> (see <a href="#types">Types</a> for more detail), since we cannot be
          certain a value is indeed present.
        </p>
        <Code>
          {`
            val tempCelsius = 24
            val desc: String? = if (tempCelsius > 5 && tempCelsius < 30) {
              "Pretty good"
            }
          `}
        </Code>

        <LinkedH3 hash="control-loops">Loops</LinkedH3>
        <p>
          <code>// TODO: Loops are not yet implemented</code>
        </p>
      </DocSection>
    </Section>
  )
}

const DocSection = styled.section`
  margin-bottom: 24px;
`

function LinkedH2({ hash, children }: { hash: string, children: string | JSX.Element }) {
  return <h2 id={hash}><HashLink to={`#${hash}`}> {children} </HashLink></h2>
}

function LinkedH3({ hash, children }: { hash: string, children: string | JSX.Element }) {
  return <h3 id={hash}><HashLink to={`#${hash}`}> {children} </HashLink></h3>
}
