import { transform as babelTransform } from 'babel-core'
import hoist from './hoist'

const transform = src => babelTransform(src, { plugins: [hoist] }).code

describe('Babel plugin', () => {
  test('Import', () => {
    const result = transform(`
      import css from 'glamor-jss'
      () => css({ color: 'blanchedalmond' })
    `)

    expect(result).toMatchSnapshot()
  })

  test('Changed default import', () => {
    const result = transform(`
      import spill from 'glamor-jss'
      () => {
        spill({ color: 'blanchedalmond' })
        css({ color: 'lavenderblush' })
      }
    `)

    expect(result).toMatchSnapshot()
  })

  test('Named import', () => {
    const result = transform(`
      import { css } from 'glamor-jss'
      () => css({ color: 'papayawhip' })
    `)

    expect(result).toMatchSnapshot()
  })

  test('Named import with alias', () => {
    const result = transform(`
      import { css as myCss } from 'glamor-jss'
      () => myCss({ color: 'papayawhip' })
    `)

    expect(result).toMatchSnapshot()
  })

  test('Require', () => {
    const result = transform(`
      const css = require('glamor-jss');
      () => css({ color: 'blanchedalmond' })
    `)
    expect(result).toMatchSnapshot()
  })

  test('Hoisting', () => {
    const result = transform(`
      import css from 'glamor-jss'

      const _static = 100
      const scope = something => {
        const hoist = css({ color: 'peachpuff' })
        const plsHoist = css({ color: 'peachpuff', width: _static })
        
        const noHoist = css({ color: something && 'papayawhip' })
        const plsNoHoist = css({ color: () => this.otherThing && 'papayawhip' })
      }
    `)

    expect(result).toMatchSnapshot()
  })
})
