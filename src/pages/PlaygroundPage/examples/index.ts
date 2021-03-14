import greeting from './greeting'
import fibonacci from './fibonacci'
import fizzbuzz from './fizzbuzz'
import linkedList from './linked-list'
import enums from './enums'

export interface ExampleModule {
  name: string,
  label: string,
  code: string
}

export interface Example {
  label: string,
  modules: ExampleModule[],
}

const codeExamples: Example[] = [
  {
    label: 'Greeting',
    modules: [
      { name: '.greeting', label: 'greeting.abra', code: greeting }
    ]
  },
  {
    label: 'Fibonacci',
    modules: [
      { name: '.fibonacci', label: 'fibonacci.abra', code: fibonacci }
    ]
  },
  {
    label: 'Fizzbuzz',
    modules: [
      { name: '.fizzbuzz', label: 'fizzbuzz.abra', code: fizzbuzz }
    ]
  },
  {
    label: 'Linked List (ish)',
    modules: [
      { name: '.linked_list', label: 'linked_list.abra', code: linkedList }
    ]
  },
  {
    label: 'Enums',
    modules: [
      { name: '.enums', label: 'enums.abra', code: enums }
    ]
  },
  {
    label: 'Imports/Exports',
    modules: [
      {
        name: '.main',
        label: 'main.abra',
        code: `
import Ship from .ship
import Person from .person
import prettyPrint from .util

val ship = Ship(
  name: "Planet Express Ship",
  crew: [
    Person(firstName: "Turanga", lastName: "Leela"),
    Person(firstName: "Phillip", middleInitial: "J", lastName: "Fry"),
    Person(firstName: "Bender", middleInitial: "B", lastName: "Rodriguez"),
  ]
)

println(prettyPrint(ship))
`.trimStart()
      },
      {
        name: '.person',
        label: 'person.abra',
        code: `
export type Person {
  firstName: String
  middleInitial: String? = None
  lastName: String
}
`.trimStart()
      },
      {
        name: '.ship',
        label: 'ship.abra',
        code: `
import Person from .person

export type Ship {
  name: String
  crew: Person[]
}
`.trimStart()
      },
      {
        name: '.util',
        label: 'util.abra',
        code: `
import Ship from .ship
import Person from .person

// Ugly prettyPrint function, nothing to see here 🙈
export func prettyPrint(ship: Ship): String {
  var str = "Ship(\\n"
  str += "  name: \\"\${ship.name}\\",\\n"
  str += "  crew: [\\n"
  for person, idx in ship.crew {
    str += prettyPrintPerson(person, "    ")
    if idx != ship.crew.length - 1 {
      str += ","
    }
    str += "\\n"
  }
  str += "  ]\\n"
  str += ")"
}

func prettyPrintPerson(person: Person, indent = ""): String {
  var str = "\${indent}Person(\\n"
  str += "$indent  firstName: \\"\${person.firstName}\\",\\n"
  if person.middleInitial |i| {
    str += "$indent  middleInitial: \\"$i\\",\\n"
  }
  str += "$indent  lastName: \\"\${person.lastName}\\",\\n"
  str += "$indent)"
}
`.trimStart()
      }
    ]
  }
]

export default codeExamples
