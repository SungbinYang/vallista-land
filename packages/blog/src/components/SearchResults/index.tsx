import { Container, Spacer, Text } from '@SungbinYang/vallista-core'
import { navigate } from 'gatsby'
import { Fragment, ReactNode, VFC } from 'react'

import { SearchResult } from '../../hooks/useSearch'
import * as Styled from './SearchResults.style'

interface SearchResultsProps {
  title: string
  keyword: string
  list: SearchResult[]
}

const MATCH_LABEL: Record<SearchResult['matchIn'], string> = {
  title: '제목',
  tag: '태그',
  body: '본문'
}

export const SearchResults: VFC<SearchResultsProps> = (props) => {
  const { title, keyword, list } = props

  return (
    <Container>
      <Styled._TitleWrapper>
        <Text as='h3' size={32} weight={800}>
          {title}
        </Text>
      </Styled._TitleWrapper>
      <Spacer y={1} />
      <Styled._List>
        {list.map((it) => (
          <Styled._ListItem key={it.slug} onClick={() => navigate(it.slug)}>
            <Styled._ItemHead>
              <Text as='span' size={16} weight={600}>
                {highlight(it.name, keyword)}
              </Text>
              <Styled._Meta>
                <Styled._Badge>{MATCH_LABEL[it.matchIn]}</Styled._Badge>
                <Text as='span' size={14} weight={300}>
                  {it.date}
                </Text>
              </Styled._Meta>
            </Styled._ItemHead>
            <Styled._Snippet>
              <Text as='span' size={14} weight={300}>
                {highlight(it.snippet, keyword)}
              </Text>
            </Styled._Snippet>
          </Styled._ListItem>
        ))}
      </Styled._List>
    </Container>
  )
}

// 검색어(공백 구분 다중 키워드 포함)와 일치하는 부분을 <mark>로 강조
function highlight(text: string, keyword: string): ReactNode {
  const terms = keyword
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  if (terms.length === 0) return text

  const lowerText = text.toLowerCase()
  const parts: ReactNode[] = []
  let cursor = 0

  while (cursor < text.length) {
    // 현재 위치 이후로 가장 먼저 등장하는 검색어를 찾는다.
    let nearest = -1
    let nearestLength = 0
    for (const term of terms) {
      const at = lowerText.indexOf(term, cursor)
      if (at !== -1 && (nearest === -1 || at < nearest)) {
        nearest = at
        nearestLength = term.length
      }
    }

    if (nearest === -1) {
      parts.push(<Fragment key={`tail-${cursor}`}>{text.slice(cursor)}</Fragment>)
      break
    }

    if (nearest > cursor) parts.push(<Fragment key={`t-${cursor}`}>{text.slice(cursor, nearest)}</Fragment>)
    const end = nearest + nearestLength
    parts.push(<Styled._Mark key={`m-${nearest}`}>{text.slice(nearest, end)}</Styled._Mark>)
    cursor = end
  }

  return parts
}
