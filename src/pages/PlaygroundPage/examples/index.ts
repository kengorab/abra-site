import importsExports from './imports-exports'
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
  importsExports,
  greeting,
  fibonacci,
  fizzbuzz,
  linkedList,
  enums
]

export default codeExamples
