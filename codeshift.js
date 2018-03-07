// How to run:
// jscodeshift -t glamor-jss/codeshift.js src
module.exports = (file, api) => {
  const j = api.jscodeshift

  const root = j(file.source)

  root
    .find(j.ImportDeclaration)
    .filter(path => path.value.source.value === 'glamor')
    .forEach(path => (path.value.source.value = 'glamor-jss'))

  root.find(j.CallExpression).forEach(path => {
    if (
      path.value.callee.name === 'require' &&
      path.value.arguments[0].value === 'glamor'
    ) {
      path.value.arguments[0].value = 'glamor-jss'
    }
  })

  return root.toSource({ quote: 'single' })
}
