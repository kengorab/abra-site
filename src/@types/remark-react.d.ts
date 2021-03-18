declare module 'remark-react' {
  import { Plugin } from 'unified'

  type RemarkReactOptions = any
  interface RemarkReact extends Plugin<[RemarkReactOptions?]> {}

  declare const remarkReact: RemarkReact
  export = remarkReact
}
