import { graphql } from 'gatsby'
import { useMemo, VFC } from 'react'
import { PageProps, PostQuery } from 'types/type'

import { Comment } from '../components/Comment'
import { Markdown } from '../components/Markdown'
import { PostHeader } from '../components/PostHeader'
import { Seo } from '../components/Seo'
import { Series } from '../components/Series'
import { useConfig } from '../hooks/useConfig'
import { AdSense } from '../components/Adsense'

const Post: VFC<PageProps<PostQuery>> = (props) => {
  const { profile } = useConfig()
  const { nodes } = props.data.allMarkdownRemark
  const { timeToRead, html } = props.data.markdownRemark
  const { title, date, image, tags, series } = props.data.markdownRemark.frontmatter

  const seriesPosts = useMemo(
    () => nodes.map((it) => ({ name: it.frontmatter.title, timeToRead: it.timeToRead, slug: it.fields.slug })),
    [nodes]
  )

  return (
    <div>
      <Seo name={title} image={image?.publicURL} isPost />
      <PostHeader
        title={title}
        date={date}
        image={image?.publicURL}
        tags={tags}
        timeToRead={timeToRead}
        author={profile.author}
      >
        {series && seriesPosts.length > 0 && <Series name={series} posts={seriesPosts} />}
      </PostHeader>
      <Markdown html={html} />
      <AdSense slotId="5104795204" />
      <section id='comments'></section>
      <Comment />
    </div>
  )
}

export default Post

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!, $series: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { series: { eq: $series, ne: "" } } }
      sort: { frontmatter: { date: ASC } }
    ) {
      nodes {
        fields {
          slug
        }
        timeToRead
        frontmatter {
          title
          series
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      timeToRead
      frontmatter {
        title
        tags
        date
        image {
          publicURL
        }
        series
      }
    }
  }
`
