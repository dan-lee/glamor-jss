const isDataSelector = name => /\[data-css-.+\]/.test(name)

const DataSelectorPlugin = {
  onProcessRule: rule => {
    const { selectorText, type, options: { parent } } = rule

    if (type === 'style' && !parent.type && !isDataSelector(selectorText)) {
      rule.originalSelectorText = selectorText
      rule.classSelector = selectorText.substring(1)
      rule.dataSelector = `data-${rule.classSelector}`
      rule.selectorText = `${selectorText}, [${rule.dataSelector}]`
    }

    return rule
  },
}

export default DataSelectorPlugin
