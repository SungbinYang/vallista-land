import { ReactNode } from 'react'

export interface FooterProps {
  subFooter?: ReactNode
  children?: ReactNode
}

export interface FooterGroupProps {
  title: string
  children?: ReactNode
}

export interface FooterLinkProps {
  href?: string
  custom?: boolean
  children?: ReactNode
}
