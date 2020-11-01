import greeting from './greeting'
import fibonacci from './fibonacci'
import fizzbuzz from './fizzbuzz'
import linkedList from './linked-list'
import enums from './enums'

const codeExamples = {
  'greeting': { label: 'Greeting', code: greeting },
  'fibonacci': { label: 'Fibonacci', code: fibonacci },
  'fizzbuzz': { label: 'Fizzbuzz', code: fizzbuzz },
  'linked-list': { label: 'Linked List (ish)', code: linkedList },
  'enums': { label: 'Enums', code: enums }
}

export type Example = keyof typeof codeExamples

export default codeExamples
