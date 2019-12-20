import { Rule, Style, SheetsRegistry, StyleSheet } from 'jss'
import { jss } from './index'

const IS_DEV = process.env.NODE_ENV !== 'production'

export const MAX_RULES = 65534

interface Options {
  sheetPrefix: string
  classNamePrefix: string
}

const defaultOptions = {
  sheetPrefix: 'glamor-jss',
  classNamePrefix: 'css',
} as Options

export default class Manager {
  registry = new SheetsRegistry()
  currentSheet: StyleSheet | null = null
  rulesCount = 0
  sheetCount = 0
  options: Options

  constructor(options?: Options) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  reset = () => {
    this.registry.reset()
    this.currentSheet = null
  }

  createSheet = (): StyleSheet => {
    const { sheetPrefix } = this.options

    const sheet = jss.createStyleSheet<string>(
      {},
      {
        generateId: (rule: Rule) =>
          `${this.options.classNamePrefix}-${rule.key}`,
        meta: `${sheetPrefix}-${this.sheetCount++}`,
      }
    )
    this.registry.add(sheet)

    return sheet
  }

  getSheet = () => {
    if (!this.currentSheet) {
      this.currentSheet = this.createSheet()
    }
    return this.currentSheet
  }

  addRule = (hash: string | number, declarations: Style, options?: any) => {
    const sheet = this.getSheet()

    // Detatch and attach again to make Chrome Dev Tools working
    // Similar to `speedy` from glamor: https://github.com/threepointone/glamor#speedy-mode
    if (IS_DEV) sheet.detach()
    const rule = sheet.addRule(String(hash), declarations, options)
    // https://blogs.msdn.microsoft.com/ieinternals/2011/05/14/stylesheet-limits-in-internet-explorer/
    if (++this.rulesCount % MAX_RULES === 0) {
      this.currentSheet = this.createSheet()
    }
    if (IS_DEV) sheet.attach()

    return rule
  }
}
