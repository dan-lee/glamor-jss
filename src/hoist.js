const PACKAGE_NAME = 'glamor-jss'

module.exports = ({ types: t }) => ({
  visitor: {
    ImportDeclaration(path) {
      const { node } = path
      if (node.source && node.source.value === PACKAGE_NAME) {
        this.importName = node.specifiers[0].local.name
      }
    },
    CallExpression(path) {
      const { node } = path
      const { callee } = node

      if (
        t.isCallExpression(node) &&
        t.isIdentifier(callee) &&
        callee.name === 'require' &&
        node.arguments[0] &&
        node.arguments[0].value === PACKAGE_NAME &&
        t.isVariableDeclarator(path.parent)
      ) {
        // const css = require(...)
        this.importName = path.parent.id.name
      } else if (t.isIdentifier(callee) && callee.name === this.importName) {
        // <div {...css({…})} />
        const bindings = Object.keys(path.scope.bindings)
        const args = path.get('arguments')

        const hasScopedBinding = arg => bindings.indexOf(arg.node.name) > -1
        if (!args.some(hasScopedBinding)) {
          args.forEach(p => {
            if (p.isPure() && p.evaluate().confident) {
              p.hoist()
            }
          })
        }

        // const shouldHoist = args.every(
        //   arg => bindings.indexOf(arg.node.name) === -1 && arg.isPure() && arg.evaluate().confident
        // )
        //
        // shouldHoist && path.hoist()
      }
    },
  },
})
