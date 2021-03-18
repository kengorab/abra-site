import React from 'react'
import { Section } from '../../components/Layout'
import MarkdownArticle from '../../components/MarkdownArticle'
import manual from './manual.md'

export default function Manual() {
  return (
    <Section>
      <MarkdownArticle contents={manual}/>
    </Section>
  )
}
