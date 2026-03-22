import { ReactNode } from 'react'

export interface SelectProps {
  value: string
  onChange: (value: string) => void
  disabled: boolean
  icon: boolean | ReactNode
  children?: ReactNode
}

export type NeedSelectProps = Pick<SelectProps, 'disabled' | 'icon'>

export interface ReturningUseSelect {
  uniqueId: string
  isAnotherIcon: boolean
}
