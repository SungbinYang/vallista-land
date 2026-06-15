const fs = require('fs')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

// 마크다운 본문을 검색용 plain text로 변환
function stripMarkdown(md) {
  return (md || '')
    .replace(/```[\s\S]*?```/g, ' ') // 코드 블록
    .replace(/`[^`]*`/g, ' ') // 인라인 코드
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 -> 텍스트만
    .replace(/<[^>]+>/g, ' ') // HTML 태그
    .replace(/^\s{0,3}#{1,6}\s+/gm, ' ') // 헤딩 마커
    .replace(/^\s{0,3}>+/gm, ' ') // 인용 마커
    .replace(/[*_~>#|]/g, ' ') // 기타 마크다운 기호
    .replace(/\s+/g, ' ') // 공백 정리
    .trim()
}

// Babel 설정 시
// @babel/plugin-transform-react-jsx를 추가해야 emotion.jsx등 런타임을 확인해서 변경함
// <meta name="google-site-verification" content="XvzNE8apyl-vM_uWG7-FyOplYN_Evw6opjqSv9YX2e8" />
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-transform-react-jsx',
    options: {
      runtime: 'automatic'
    }
  })
}

// You can delete this file if you're not using it
exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions

  const postPage = path.resolve(`./src/template/post.tsx`)
  const errorPage = path.resolve(`./src/pages/404.tsx`)

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            series
          }
        }
      }
    }
  `)

  const posts = result.data.allMarkdownRemark.nodes

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      actions.createPage({
        path: post.fields.slug,
        component: postPage,
        context: {
          id: post.id,
          series: post.frontmatter.series || ''
        }
      })
    })
  }
}

// 검색 인덱스(search-index.json) 생성
// develop / build 양쪽에서 실행되도록 onPostBootstrap 사용
exports.onPostBootstrap = async ({ graphql, store, reporter }) => {
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        nodes {
          rawMarkdownBody
          fields {
            slug
          }
          frontmatter {
            title
            date
            tags
            draft
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('검색 인덱스 생성 실패', result.errors)
    return
  }

  const index = result.data.allMarkdownRemark.nodes.map((node) => ({
    slug: node.fields.slug,
    title: node.frontmatter.title,
    tags: node.frontmatter.tags || [],
    date: node.frontmatter.date,
    draft: Boolean(node.frontmatter.draft),
    body: stripMarkdown(node.rawMarkdownBody)
  }))

  const publicPath = path.join(store.getState().program.directory, 'public')
  fs.mkdirSync(publicPath, { recursive: true })
  fs.writeFileSync(path.join(publicPath, 'search-index.json'), JSON.stringify(index))

  reporter.info(`검색 인덱스 생성 완료: ${index.length}개 포스트`)
}

// 노드 환경 생성될 때
exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({
      node,
      getNode
    })

    createNodeField({
      node,
      name: 'slug',
      value: `${value}`
    })
  }
}
