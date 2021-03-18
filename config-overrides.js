module.exports = (webpackConfig) => {
  const { rules } = webpackConfig.module

  // I want to be able to import markdown files as strings, to avoid fetching them dynamically. To accomplish
  // this, I need to override the default webpack config and load .md files using `raw-loader`, rather than the
  // previously-used `file-loader`.
  rules.push({
    test: /\.md$/,
    use: 'raw-loader'
  })
  const catchall = rules[rules.length - 2]
  const fileLoaderConfig = catchall.oneOf.find(({ loader }) => loader && loader.includes('file-loader'))
  fileLoaderConfig.exclude.push(/\.md$/)

  return webpackConfig
}
