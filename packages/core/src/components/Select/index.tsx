import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ChangeEvent, FC } from 'react'

import { SelectProps } from './type'
import { useSelect } from './useSelect'

/**
 * # Select
 */
export const Select: FC<Partial<SelectProps>> = (props) => {
  const { children, onChange, icon, ...otherProps } = useSelect(props)

  const isAnotherIcon = icon && typeof icon !== 'boolean'

  return (
    <_Wrapper {...otherProps}>
      <_Select {...otherProps} onChange={handleChange}>
        {children}
      </_Select>
      <_IconWrapper>
        {isAnotherIcon ? (
          icon
        ) : (
          <svg
            viewBox='0 0 24 24'
            width='18'
            height='18'
            stroke='currentColor'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
            fill='none'
            shape-rendering='geometricPrecision'
          >
            <path d='M6 9l6 6 6-6' />
          </svg>
        )}
      </_IconWrapper>
    </_Wrapper>
  )

  function handleChange(e: ChangeEvent<HTMLSelectElement>): void {
    const { selectedIndex, options } = e.target
    onChange?.(options?.[selectedIndex]?.innerText)
  }
}

const _Wrapper = styled.div<Partial<Pick<SelectProps, 'disabled'>>>`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  transition: border 0.2s, color 0.2s ease-out, box-shadow 0.2s ease;
  white-space: nowrap;
  line-height: 0;
  height: calc(9 * 4px);
  width: auto;
  min-width: 160px;
  display: inline-flex;
  outline: none;
  appearance: none;
  box-sizing: border-box;

  ${({ theme, disabled }) => css`
    color: ${theme.colors.PRIMARY.FOREGROUND};
    background: ${theme.colors.PRIMARY.BACKGROUND};
    border: 1px solid ${theme.colors.PRIMARY.ACCENT_2};
    text-transform: uppercase;
    user-select: none;
    font-weight: 100;

    ${disabled
      ? css`
          background: ${theme.colors.PRIMARY.ACCENT_1};

          & > select {
            color: ${theme.colors.PRIMARY.ACCENT_4};
            cursor: not-allowed;
          }
        `
      : css`
          &:hover,
          &:focus-within {
            border-color: ${theme.colors.PRIMARY.ACCENT_5};
          }
        `}
  `}
`

const _Select = styled.select`
  height: 100%;
  border: none;
  box-shadow: none;
  outline: none;

  ${({ theme }) => css`
    color: ${theme.colors.PRIMARY.FOREGROUND};
    background: ${theme.colors.PRIMARY.BACKGROUND};
    font-size: 14px;
    margin-right: -20px;
    width: calc(100% + 20px);
    padding: 0 12px;
    text-transform: none;
    box-sizing: border-box;
  `}
`

const _IconWrapper = styled.div`
  width: 30px;
  height: 100%;
  position: absolute;
  right: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.2s;
  box-sizing: inherit;

  ${({ theme }) => css`
    background: ${theme.colors.PRIMARY.BACKGROUND};
  `}

  & > svg {
    box-sizing: border-box;
    transform-origin: 0 0;
  }
`

const Svg = styled.svg``