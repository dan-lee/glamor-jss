import { Rule } from 'jss'

const isDataSelector = (name: string) => /\[data-css-.+\]/.test(name)

export type DataSelectorRule = CSSStyleRule &
  Rule & {
    originalSelectorText: string
    classSelector: string
    dataSelector: string
  }

const DataSelectorPlugin = {
  onProcessRule: (rule: DataSelectorRule) => {
    const { selectorText, type, options } = rule

    const parent = options.parent as DataSelectorRule

    if (
      type === 'style' &&
      parent &&
      !parent.type &&
      !isDataSelector(selectorText)
    ) {
      rule.originalSelectorText = selectorText
      rule.classSelector = selectorText.substring(1)
      rule.dataSelector = `data-${rule.classSelector}`
      rule.selectorText = `${selectorText}, [${rule.dataSelector}]`
    }

    return rule
  },
}

export default DataSelectorPlugin
