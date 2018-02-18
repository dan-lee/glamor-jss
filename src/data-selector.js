const isDataSelector = name => /\[data-css-.+\]/.test(name)

const DataSelectorPlugin = {
  onProcessRule: rule => {
    const { selectorText } = rule
    if (rule.type === 'style' && !isDataSelector(selectorText)) {
      rule.originalSelectorText = selectorText
      rule.classSelector = selectorText.substring(1)
      rule.dataSelector = `data-${rule.classSelector}`
      rule.selectorText = `${selectorText}, [${rule.dataSelector}]`
    }

    return rule
  },
}

export default DataSelectorPlugin
