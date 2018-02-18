// needs a `yarn build` before
const Benchmark = require('benchmark')
const glamorJss = require('../../lib/cjs/bundle').default
const { css: glamorCss } = require('glamor')
const { css: emotionCss } = require('emotion')

let count = 0

module.exports = options =>
  new Benchmark.Suite(options)
    .add('glamor-jss', () => {
      glamorJss([{ ':after': { width: count++ } }, { color: 'red' }], { fontWeight: 'bold' })
    })
    .add('glamor', () => {
      glamorCss([{ ':after': { width: count++ } }, { color: 'red' }], { fontWeight: 'bold' })
    })
    .add('Emotion', () => {
      emotionCss([{ ':after': { width: count++ } }, { color: 'red' }], { fontWeight: 'bold' })
    })
