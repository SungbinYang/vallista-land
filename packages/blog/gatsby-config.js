const profile = require('./config/profile.json')
const defaultOpenGraphImage = '/og-image.png';

module.exports = {
  flags: {
    FAST_DEV: true
  },
  siteMetadata: {
    title: profile.title,
    titleTemplate: profile.titleTemplate,
    siteUrl: profile.siteUrl,
    description: profile.description,
    author: profile.author,
    url: profile.siteUrl,
    image: defaultOpenGraphImage,
    twitterUsername: ''
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: 'G-YLQTEB1PVV',
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        defer: false,
        // Any additional optional fields
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: 'sungbin.kr'
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title,
                description,
                siteUrl,
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map((node) => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: encodeURI(site.siteMetadata.siteUrl + node.fields.slug),
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ 'content:encoded': node.html }]
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            // 최종 rss feed파일 입니다. 디렉토리가 다르거나, 이름이 다른경우 설정 가능합니다.
            output: '/rss.xml',
            // 본인의 blog rss feed용 타이틀을 명시합니다.
            title: "Sungbin's Blog RSS Feed"
          }
        ]
      }
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-mdx',
    'gatsby-plugin-typescript',
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/'
      },
      __key: 'pages'
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1024,
              linkImagesToOriginal: false
            }
          },
          `gatsby-remark-gifs`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              showLineNumbers: true,
              noInlineHighlight: true
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `#9195F6`,
        // Disable the loading spinner.
        showSpinner: false
      }
    },
      {
      resolve: `gatsby-plugin-google-adsense`,
      options: {
        publisherId: `ca-pub-8854437638395695`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: profile.description,
        short_name: profile.author,
        start_url: `/`,
        icon: `static/favicons/favicon-96x96.png`,
        icons: [
          {
            src: '/favicons/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/favicons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    }
  ]
}
