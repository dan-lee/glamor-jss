import StyleRule from 'jss/lib/rules/StyleRule'

const NormalizePseudoSelectorPlugin = {
  onCreateRule: (name, decl, options) => {
    if (decl == null && typeof name !== 'string') {
      decl = name
      name = undefined
    }
    Object.keys(decl).forEach(key => {
      key = key.trim()
      if (key.indexOf(':') === 0 || key.indexOf('>') === 0) {
        decl[`&${key}`] = { ...decl[key] }
        delete decl[key]
      }
    })
    return new StyleRule(name, decl, options)
  },
}

export default NormalizePseudoSelectorPlugin
