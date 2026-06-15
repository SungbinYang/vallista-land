import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const _TitleWrapper = styled.header`
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.PRIMARY.ACCENT_4};
  `}
`

export const _List = styled.div``

export const _ListItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  border: none !important;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  margin: 0 -1.5rem;
  cursor: pointer;

  ${({ theme }) => css`
    color: ${theme.colors.PRIMARY.ACCENT_6} !important;

    &:hover {
      background: ${theme.colors.PRIMARY.ACCENT_2} !important;
      color: ${theme.colors.PRIMARY.FOREGROUND} !important;
    }
  `}
`

export const _ItemHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  & > span:first-of-type {
    max-width: 75%;
  }
`

export const _Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  ${({ theme }) => css`
    & > span {
      color: ${theme.colors.PRIMARY.ACCENT_3};
    }
  `}
`

export const _Badge = styled.span`
  flex-shrink: 0;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.4;

  ${({ theme }) => css`
    background: ${theme.colors.PRIMARY.ACCENT_2};
    color: ${theme.colors.PRIMARY.ACCENT_5};
  `}
`

export const _Snippet = styled.div`
  ${({ theme }) => css`
    & > span {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      color: ${theme.colors.PRIMARY.ACCENT_4};
    }
  `}
`

export const _Mark = styled.mark`
  background: transparent;
  font-weight: 700;

  ${({ theme }) => css`
    color: ${theme.colors.HIGHLIGHT.PINK};
  `}
`
