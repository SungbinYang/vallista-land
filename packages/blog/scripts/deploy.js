const TOKEN = process.argv[2] || null

const ghpages = require('gh-pages')

ghpages.publish(
  'public',
  {
    branch: 'main',
    repo: TOKEN
      ? `https://SungbinYang:${TOKEN}@github.com/SungbinYang/SungbinYang.github.io.git`
      : 'https://github.com/SungbinYang/SungbinYang.github.io.git'
  },
  function (err) {
    console.log(err)
  }
)
