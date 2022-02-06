import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ThemeProvider, useTheme } from '@vallista-land/core'
import React, { useEffect, useState } from 'react'

import { onChangeThemeEvent, isDarkMode, localStorage } from './src/utils'

import { Layout } from './src/components/Layout'

/**
 * 클라이언트 랜더링이 첫 시작될 때
 *
 * - Modal Root를 생성한다. 이 root는 모달을 관리하는데 쓰인다.
 */
export function onInitialClientRender() {
  let modalRoot = document?.getElementById('modal-root') || null

  if (!modalRoot) {
    modalRoot = document.createElement('div')
    modalRoot.id = 'modal-root'
    document.body.appendChild(modalRoot)
  }
}

/** 서버사이드에서 전체 틀 요소를 제작할 때 호출 */
export function wrapRootElement({ element }) {
  return (
    <ThemeProvider>
      <Loader>{element}</Loader>
    </ThemeProvider>
  )
}

/** 클라이언트 사이드에서 페이지 단위로 요소를 제작할 때 호출 */
export function wrapPageElement({ element }) {
  return <InitializeElement element={element} />
}

const Loader = ({ children }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  return <Loading loading={loading}>{children}</Loading>
}

const Loading = styled.div`
  transition: opacity 0.2s ease;
  opacity: 0;

  ${({ loading }) => css`
    ${loading &&
    css`
      opacity: 1;
    `}
  `}
`

const InitializeElement = ({ element }) => {
  const theme = useTheme()

  if (!localStorage.get('theme') && isDarkMode()) {
    localStorage.set('theme', 'dark')
  }

  onChangeThemeEvent((themeType) => {
    localStorage.set('theme', themeType)
    changeTheme(theme)
  })

  changeTheme(theme)

  return <Layout>{element}</Layout>
}

const changeTheme = (theme) => {
  if (typeof window === 'undefined') return

  if (localStorage.get('theme') === 'light') {
    document.body.style.backgroundColor = '#fff'
    theme.state.changeTheme('light')
  } else {
    document.body.style.backgroundColor = '#000'
    theme.state.changeTheme('dark')
  }
}
