import { ReactNode } from 'react'

import { AvailablePickedColor } from '../ThemeProvider/type'

export interface NoteProps {
  action: ReactNode
  label: boolean | string
  fill: boolean
  variant: 'standard' | 'contrast'
  type: NoteType
  size: 'small' | 'medium' | 'large'
  children?: ReactNode
}

export type NoteType = 'success' | 'error' | 'warning' | 'primary' | 'secondary'

export type NoteMapperType = Record<NoteType, Record<'background' | 'border' | 'color', AvailablePickedColor>>
