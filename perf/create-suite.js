const suites = {
  hash: require('./suites/hash'),
  'glamor-jss': require('./suites/glamor-jss'),
}

module.exports = (name, options) => {
  if (!(name in suites)) {
    throw new Error(
      `Suite ${name} does not exist. Choose between: ${Object.keys(suites).join(', ')}`
    )
  }
  return suites[name](options)
}
