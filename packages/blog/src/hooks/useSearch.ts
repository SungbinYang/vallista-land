import { Document } from 'flexsearch'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getTime } from '../utils'

// pathPrefix를 사용하지 않으므로 절대경로로 충분하다.
const SEARCH_INDEX_PATH = '/search-index.json'

interface SearchDoc {
  slug: string
  title: string
  tags: string[]
  date: string
  draft: boolean
  body: string
}

export interface SearchResult {
  slug: string
  name: string
  date: string
  /** 매칭된 위치 주변의 본문 일부 */
  snippet: string
  /** 매칭이 일어난 영역 */
  matchIn: 'title' | 'tag' | 'body'
}

// FlexSearch 인덱싱 필드 → 결과 배지. 우선순위 순서이기도 하다(제목 > 태그 > 본문).
const FIELDS = ['title', 'tagsText', 'body'] as const
type Field = (typeof FIELDS)[number]
const FIELD_TO_MATCH: Record<Field, SearchResult['matchIn']> = {
  title: 'title',
  tagsText: 'tag',
  body: 'body'
}

const SNIPPET_PADDING = 60

// FlexSearch 기본 검색 결과 형태: [{ field, result: id[] }]
type RawResults = Array<{ field?: string; result: Array<number | string> }>

// draft는 localhost(개발/미리보기)에서만 노출
function isVisible(doc: SearchDoc): boolean {
  if (!doc.draft) return true
  if (typeof window === 'undefined') return false
  return window.location.host.includes('localhost')
}

// FlexSearch는 접두사/토큰 단위로 느슨하게 매칭하므로, 본문에 검색어 원형이 없을 수 있다.
// 전체 검색어 → 첫 단어 → 본문 앞부분 순으로 스니펫 기준 위치를 찾는다.
function makeSnippet(body: string, keyword: string): string {
  const lower = body.toLowerCase()
  let matchIndex = lower.indexOf(keyword.toLowerCase())
  let matchLength = keyword.length

  if (matchIndex === -1) {
    const firstWord = keyword.split(/\s+/)[0]
    matchIndex = lower.indexOf(firstWord.toLowerCase())
    matchLength = firstWord.length
  }

  if (matchIndex === -1) return body.slice(0, SNIPPET_PADDING * 2)

  const start = Math.max(0, matchIndex - SNIPPET_PADDING)
  const end = Math.min(body.length, matchIndex + matchLength + SNIPPET_PADDING)

  return `${start > 0 ? '…' : ''}${body.slice(start, end)}${end < body.length ? '…' : ''}`
}

/**
 * # useSearch
 *
 * FlexSearch 기반 전문 검색. 검색어가 처음 입력될 때 search-index.json을 한 번만 lazy-load 하고
 * 인메모리로 인덱스를 구성한다. 제목 > 태그 > 본문 순으로 관련도순 결과를 반환한다.
 */
export function useSearch(query: string): { results: SearchResult[]; loading: boolean } {
  const indexRef = useRef<Document | null>(null)
  const docsRef = useRef<SearchDoc[]>([])
  const requested = useRef(false)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  const keyword = query.trim()

  useEffect(() => {
    if (keyword.length === 0 || requested.current) return

    requested.current = true
    setLoading(true)

    fetch(SEARCH_INDEX_PATH)
      .then((res) => res.json())
      .then((data: SearchDoc[]) => {
        const docs = data.filter(isVisible)
        const index = new Document({
          tokenize: 'forward',
          document: { id: 'id', index: [...FIELDS] }
        })

        docs.forEach((doc, id) => {
          index.add({ id, title: doc.title, tagsText: (doc.tags || []).join(' '), body: doc.body })
        })

        docsRef.current = docs
        indexRef.current = index
        setReady(true)
      })
      .catch(() => {
        docsRef.current = []
        setReady(true)
      })
      .finally(() => setLoading(false))
  }, [keyword])

  const results = useMemo<SearchResult[]>(() => {
    const index = indexRef.current
    if (!ready || !index || keyword.length === 0) return []

    const raw = index.search(keyword, { limit: 100 }) as unknown as RawResults
    const seen = new Set<number>()
    const out: SearchResult[] = []

    // 필드 우선순위(제목 > 태그 > 본문)대로 순회하며 중복 제거.
    // 각 필드 내부는 FlexSearch가 이미 관련도순으로 정렬해 준다.
    for (const field of FIELDS) {
      const group = raw.find((it) => it.field === field)
      if (!group) continue

      for (const rawId of group.result) {
        const id = Number(rawId)
        if (seen.has(id)) continue
        seen.add(id)

        const doc = docsRef.current[id]
        if (!doc) continue

        const [, month, day] = getTime(doc.date)
        out.push({
          slug: doc.slug,
          name: doc.title,
          date: `${Number(month)}월 ${Number(day)}일`,
          snippet: makeSnippet(doc.body, keyword),
          matchIn: FIELD_TO_MATCH[field]
        })
      }
    }

    return out
  }, [ready, keyword])

  return { results, loading: loading && !ready }
}
