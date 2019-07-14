declare module 'react-snapshot' {
  import { ReactElement } from 'react'

  export function render<P>(
    element: ReactElement<P>,
    container: Element | null,
    callback?: () => void
  )
}