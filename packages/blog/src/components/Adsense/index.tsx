import { FC, useEffect } from 'react'

import * as Styled from './Adsense.style'

interface Props {
  slotId: string
}

export const AdSense: FC<Props> = ({ slotId }: Props) => {
  useEffect(() => {
    if (window) {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    }
  }, [])

  return (
    <Styled._Wrapper>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-8854437638395695'
        data-ad-slot={slotId}
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </Styled._Wrapper>
  )
}