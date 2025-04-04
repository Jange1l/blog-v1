import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fullWidth?: boolean
}

export default function SectionContainer({ children, fullWidth = false }: Props) {
  return <section className="w-full pl-20 pr-20">{children}</section>
}
