import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { ModalAnimationState, ModalContextStateWithProps } from '../type'
import {
  FadeIn,
  FadeInMobile,
  FadeInWithDown,
  FadeOut,
  FadeOutMobile,
  FadeOutWithUp,
  SlideBottomUp,
  SlideTopDown
} from './Modal.animation'

const isAnimationIdle = (state: ModalAnimationState): boolean => {
  return state === ModalAnimationState.IDLE
}

const isAnimationStart = (state: ModalAnimationState): boolean => {
  return state > ModalAnimationState.IDLE && state < ModalAnimationState.FADE_OUT
}

const isAnimationEnd = (state: ModalAnimationState): boolean => {
  return state === ModalAnimationState.FADE_OUT
}

const Wrap = styled.div<Pick<ModalContextStateWithProps, 'animationState'>>`
  ${({ animationState }) =>
    animationState === ModalAnimationState.IDLE &&
    css`
      visibility: hidden;
    `}
`

const animationOption = '0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards'

const BackDrop = styled.div<Pick<ModalContextStateWithProps, 'animationState' | 'onClickOutSide'>>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  pointer-events: none;
  animation: none;
  ${({ theme, animationState, onClickOutSide }) => css`
    z-index: ${theme.layers.MODAL - 1};
    background-color: ${theme.colors.PRIMARY.FOREGROUND};

    ${onClickOutSide &&
    css`
      pointer-events: all;
    `}

    ${isAnimationIdle(animationState) &&
    css`
      top: -${theme.layers.CONCEAL}px;
      left: -${theme.layers.CONCEAL}px;
    `}

  ${isAnimationStart(animationState) &&
    css`
      animation: ${FadeIn} ${animationOption};

      @media (max-width: 600px) {
        animation: ${FadeInMobile} ${animationOption};
      }
    `}

  ${isAnimationEnd(animationState) &&
    css`
      animation: ${FadeOut} ${animationOption};

      @media (max-width: 600px) {
        animation: ${FadeOutMobile} ${animationOption};
      }
    `}
  `};
`

const Container = styled.div<Pick<ModalContextStateWithProps, 'animationState'>>`
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
  height: 100vh;
  height: -webkit-fill-available;
  width: 100vw;
  animation: none;
  z-index: ${({ theme }) => theme.layers.MODAL};
  overflow: auto;
  border: none;
  outline: none;

  @media (max-width: 600px) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    flex-direction: column;
  }

  ${({ theme, animationState }) => css`
    ${isAnimationIdle(animationState) &&
    css`
      top: -${theme.layers.CONCEAL}px;
      left: -${theme.layers.CONCEAL}px;
    `}

    ${isAnimationStart(animationState) &&
    css`
      animation: ${FadeInWithDown} ${animationOption};

      @media (max-width: 600px) {
        animation: ${SlideBottomUp} ${animationOption};
      }
    `}

    ${isAnimationEnd(animationState) &&
    css`
      animation: ${FadeOutWithUp} ${animationOption};

      @media (max-width: 600px) {
        animation: ${SlideTopDown} ${animationOption};
      }
    `}
  `};
`

const Wrapper = styled.div`
  width: 420px;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  overflow-y: auto;
  outline: none;

  @media (max-width: 600px) {
    width: 100%;
  }

  ${({ theme }) => css`
    box-shadow: ${theme.shadows.LARGE};
    background-color: ${theme.colors.PRIMARY.BACKGROUND};
    color: ${theme.colors.PRIMARY.FOREGROUND};
  `};
`

const ModalContainer = styled.div`
  outline: 0;
`

export { Wrap, BackDrop, Container, Wrapper, ModalContainer }