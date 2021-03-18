import React from 'react'
import unified from 'unified'
import parse from 'remark-parse'
import remarkSlug from 'remark-slug'
import remark2react from 'remark-react'
import Code from './Code'

export function renderMarkdownToReact(markdown: string) {
  const markdownResult: any = unified()
    .use(parse)
    .use(remarkSlug)
    .use(remark2react, {
      remarkReactComponents: { code: Code },
      sanitize: { clobberPrefix: '' }
    })
    .processSync(markdown)
  return markdownResult.result
}

interface Props {
  contents: string
}

export default function MarkdownArticle({ contents }: Props) {
  const rendered = renderMarkdownToReact(contents)

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1 }}>
        {rendered}
      </div>
    </div>
  )
}
