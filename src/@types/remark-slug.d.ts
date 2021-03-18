declare module 'remark-slug' {
  import { Plugin } from 'unified'

  type RemarkSlugOptions = any
  interface RemarkSlug extends Plugin<[RemarkSlugOptions?]> {}

  declare const remarkSlug: RemarkSlug
  export = remarkSlug
}
