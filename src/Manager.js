import { SheetsRegistry } from 'jss'
import { jss } from './index'

const IS_DEV = process.env.NODE_ENV !== 'production'

export const MAX_RULES = 65534

export default class Manager {
  registry = new SheetsRegistry()
  currentSheet = null
  rulesCount = 0
  sheetCount = 0

  constructor(options) {
    this.options = {
      sheetPrefix: 'glamor-jss',
      classNamePrefix: 'css',
      ...options,
    }
  }

  reset = () => {
    this.registry.reset()
    this.currentSheet = null
  }

  createSheet = () => {
    const { sheetPrefix } = this.options

    const sheet = jss.createStyleSheet(null, {
      generateClassName: rule => `${this.options.classNamePrefix}-${rule.key}`,
      meta: `${sheetPrefix}-${this.sheetCount++}`,
    })
    this.registry.add(sheet)

    return sheet
  }

  getSheet = () => {
    if (!this.currentSheet) {
      this.currentSheet = this.createSheet()
    }
    return this.currentSheet
  }

  addRule = (hash, declarations, options) => {
    const sheet = this.getSheet()

    // Detatch and attach again to make Chrome Dev Tools working
    // Similar to `speedy` from glamor: https://github.com/threepointone/glamor#speedy-mode
    if (IS_DEV) sheet.detach()
    const rule = sheet.addRule(hash, declarations, options)
    // https://blogs.msdn.microsoft.com/ieinternals/2011/05/14/stylesheet-limits-in-internet-explorer/
    if (++this.rulesCount % MAX_RULES === 0) {
      this.currentSheet = this.createSheet()
    }
    if (IS_DEV) sheet.attach()

    return rule
  }
}
