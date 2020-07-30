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
          arrays.
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
        <LinkedH3 hash="types-option">Option Type</LinkedH3>
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
          <b>Abra</b> takes the middle road: an array indexing operation will always succeed and will always return a
          "box", which may or may not contain a value. One way to "unbox" this value is to use the <em>coalescing</em>
          operator (<code>?:</code>), also called the "Elvis operator" in some languages. This operator will either unbox
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
        <p>
          There's another operator that makes it convenient to work with <code>Optional</code> types: the <code>?.</code>
          operator. This allows for an <code>Optional</code>-safe way of accessing properties of variables without manually
          "unwrapping" the value. For example, if we wanted to get the length of a string contained within an array:
        </p>
        <Code>
          {`
            val names = ["Brian", "Ken", "Meg"]
            
            val brian: String? = names[0] // The type of brian is an Optional String
            val wrongLength = brian.length // Type error, since the property "length" does not exist on String?
            val rightLength = brian?.length // This is correct
          `}
        </Code>
        <p>
          The <code>rightLength</code> variable will be of type <code>Int?</code>. Essentially, what happens here is
          this: since the code can't be sure if the variable <code>brian</code> holds a value or not, we can use the
          <code>Optional</code>-safe operator (<code>?.</code>) to access its <code>length</code> property. If the variable
          holds a value, it will get the <code>length</code> property off of the variable; if it does <i>not</i> hold a
          value, it will just short-circuit and produce the value of <code>None</code>.
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
          Functions can also be declared with default argument values. This makes those parameters optional when
          calling that function; if no value for that parameter is passed, the default value will be provided to the function
          body. Arguments with default values will have their type be inferred from the default value, if no type
          annotation is present. Note that all optional (aka default-valued) parameters must come at the end of the
          argument list; there can be no required (aka <em>non</em>-default-valued) parameters among the optional ones.
        </p>
        <Code>
          {`
          func add(a: Int, b: Int = 2, c = 3) = a + b + c
          
          add(1)  // 6
          add(1, 10)  // 14
          add(1, 10, 100)  // 111
          
          // Note that here ▾ there is no type annotation; it's inferred from the default value 2
          func add2(a: Int, b = 2, c: Int) = a + b + c
          // This is an error here ^ since required params 
          // cannot come after optional ones
          `}
        </Code>

        <LinkedH3 hash="functions-calling">Calling Functions</LinkedH3>
        <p>
          Functions are called by using parentheses to pass in arguments, much like you'd expect. In <b>Abra</b>, you
          may take a <em>named-arguments</em> approach to provide additional clarity. These named arguments may be passed
          in any order, but you cannot mix named and unnamed parameters (it's all or nothing). It's especially helpful
          to use named-arguments when passing in a literal value (as opposed to a variable, which can have some intent
          ascribed to it via its name).
        </p>
        <p>
          Parameters with default values will be set to those values upon calling the function. The default value will
          be provided if not enough positional arguments were passed (if calling with unnamed arguments), or if no value
          is provided as a named argument for that parameter.
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

        <LinkedH3 hash="functions-lambdas">Lambda Functions</LinkedH3>
        <p>
          There's also a syntax for anonymous lambda functions in <b>Abra</b>, which follows after Typescript's arrow
          function syntax. Arguments are in parentheses followed by their type annotations, then an arrow (<code>=></code>)
          and then either a single expression or a block.
        </p>
        <Code>
          {`
          val add = (a: Int, b: Int) => a + b
          val mult = (a: Int, b: Int) => {
            var product = a
            for i in range(0, b) {
              product = product + a
            }
            product
          }
          `}
        </Code>
        <p>
          Functions in <b>Abra</b> are first-class citizens, so they can be passed as arguments to other functions. When
          passing lambdas as arguments, the type annotations for arguments are optional.
        </p>
        <p>
          It's also important to note that regular named functions can also be passed as parameters!
        </p>
        <Code>
          {`
          func call(fn: (Int) => Int, number: Int) = fn(number)
          
          call(x => x + 1, 23) // Returns 24
          
          func increment(value: Int) = value + 1
          call(increment, 23) // Also returns 24
          `}
        </Code>
        <p>
          A function will satisfy a function type signature if all of its <i>required</i> arguments match; any optional
          arguments are not typechecked against the type signature:
        </p>
        <Code>
          {`
          func call(fn: (Int) => Int, number: Int) = fn(number)
          
          call((x, y = 1) => x + y + 1, 22) // Returns 24
          //       ^ The argument y will always be set to the default value
          `}
        </Code>

        <LinkedH3 hash="functions-recursion">Recursive Functions</LinkedH3>
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
        <LinkedH2 hash="types-creating">Creating Types</LinkedH2>
        <p>
          You can create your own type in <b>Abra</b> by using the <code>type</code> keyword, giving it a name, and
          defining its shape. Here we can see a type representing a person, with 2 fields, <code>firstName</code> and
          <code>lastName</code>, each of type <code>String</code>.
        </p>
        <Code>
          {`
            type Person {
              firstName: String
              lastName: String
            }
          `}
        </Code>
        <p>
          When a type is declared in this way, there will also be a function declared with the same name as the type, which
          has arguments that match that type's fields. This is like a <i>constructor</i> in other languages, and is used to
          create new instances of that type. Much like how regular function work (see the section above on Functions), these
          parameters can be passed in any order.
        </p>
        <Code>
          {`
            val leela = Person(firstName: "Turanga", lastName: "Leela")
          `}
        </Code>
        <p>
          You can also specify default values for a type's fields. These will become optional arguments in
          the <i>constructor</i> function for that type.
        </p>
        <Code>
          {`
            type Person {
              firstName: String = "Turanga"
              lastName: String
            }
            
            val leela = Person(lastName: "Leela")
            println(leela.firstName) // Prints "Turanga", the default value
          `}
        </Code>
        <p>
          Fields on an instance of a type can be accessed using the dot operator, much like you may be used to from other
          languages. You can also use the same idea to update an instance's fields.
        </p>
        <Code>
          {`
            val leela = Person(firstName: "turanga", lastName: "leela")
            val fullName = leela.firstName + " " + leela.lastName
            
            leela.firstName = "Turanga"
            leela.lastName = "Leela"
          `}
        </Code>

        <LinkedH3 hash="types-creating-methods">Methods on Types</LinkedH3>
        <p>
          Methods can also be declared within a <code>type</code> declaration. Functions with <code>self</code> as the first
          parameter will be <i>instance methods</i>, and functions without <code>self</code> will be <i>static methods</i>.
        </p>
        <Code>
          {`
            type Person {
              name: String
              
              func yellName(self) = self.name.toUpper() + "!"
              
              func isLeela(name: String) = name == "Leela" || name == "Turanga Leela"
            }
            
            val leela = Person(name: "Leela")
            println(leela.yellName()) // Prints "LEELA!"
            
            Person.isLeela(leela.name) // true
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
        <LinkedH4 hash="control-loops-while">While Loops</LinkedH4>
        <p>
          <b>Abra</b> has <code>while</code>-loops, which encapsulate a block of logic that is meant to run until a
          given condition is no longer <code>true</code>. This is identical to how <code>while</code>-loops function in
          other C-like languages. The <code>break</code> keyword can be used to exit a loop early, even if the loop
          condition may still be true.
        </p>
        <Code>
          {`
            var a = 0
            while a < 10 {
              a = a + 1
            }
            a  // 10
            
            var b = 0
            while b < 10 {
              b = b + 1
              if b == 3 {
                break
              }
            }
            b  // 3
          `}
        </Code>
        <LinkedH4 hash="control-loops-for">For Loops</LinkedH4>
        <p>
          <b>Abra</b> has <code>for</code>-loops, which encapsulate a block of logic that is meant to run for each item
          in a specified collection. The collection can either be specified statically, or as any other expression.
          The <code>range</code> builtin function comes in handy here:
        </p>
        <Code>
          {`
            var sum = 0
            for num in [1, 2, 3, 4] {
              sum = sum + num
            }
            sum  // 10
            
            var product = 0
            for num in range(1, 5) {
              product = product * num
            }
            product  // 24
          `}
        </Code>
        <p>
          In addition to specifying the <em>iteratee</em> variable (<code>num</code> in the above example), you can also
          specify an <em>index</em> binding. The index binding will be a number equal to the number of times the loop
          has repeated (zero-indexed).
        </p>
        <Code>
          {`
            /*
              This loop will print the following:
              Number: 5, index: 0
              Number: 6, index: 1
              Number: 7, index: 2
            */
            for num, i in range(5, 8) {
              println("Number: " + num + ", index: " + i)
            }
          `}
        </Code>
        <p>
          Much like the <code>while</code>-loop, the <code>break</code> keyword can be used to exit a loop early, even
          if the collection hasn't been fully iterated through.
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

function LinkedH4({ hash, children }: { hash: string, children: string | JSX.Element }) {
  return <h4 id={hash}><HashLink to={`#${hash}`}> {children} </HashLink></h4>
}
