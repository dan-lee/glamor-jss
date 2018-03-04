import 'es6-weak-map/implement'
import { create } from 'jss'
import preset from 'jss-preset-default'
import hashify from 'hash-it'
import memoize from 'memoize-weak'
import NormalizePseudoSelectorPlugin from './normalize-selector'
import DataSelectorPlugin from './data-selector'
import { processDeclarations, isEmptyObject, cleanup, isFalsy } from './utils'
import Manager from './Manager'

const manager = new Manager()
export const renderToString = () => manager.registry.toString()
export const reset = () => manager.reset()
export const jss = create(preset())
export const getSheet = () => manager.getSheet()
const cache = {}

// render data selectors instead of classNames (like glamor)
jss.use(DataSelectorPlugin)

// Replace :hover with &:hover, etc.
jss.use(NormalizePseudoSelectorPlugin)

// First layer of caching
export const css = memoize(cssImpl)

function cssImpl(...declarations) {
  // Second layer of caching
  const hash = hashify(declarations)

  // Third layer of caching
  if (hash in cache) {
    return cache[hash]
  }

  if (isFalsy(declarations)) return
  const grouped = processDeclarations(declarations, cache)

  // Go through all grouped declarations → { media: { '@media (…)': {} }, pseudo: { ':hover': {}, …}
  // Add them as rule with the same name and return the selector by reducing it
  const rule = ['other', 'pseudo', 'media', 'supports'].reduce(
    (selector, key) => {
      const subDecl = grouped[key]
      if (!isEmptyObject(subDecl)) {
        const cleanedDecl = cleanup(subDecl)
        return manager.addRule(hash, cleanedDecl)
      }
      return selector
    },
    ''
  )

  const result = { [rule.dataSelector]: '' }

  // Add these properties as non-enumerable so they don't pollute spreading {...css(…)}
  Object.defineProperties(result, {
    toString: {
      enumerable: false,
      value: () => rule.classSelector,
    },
    hash: {
      enumerable: false,
      value: hash,
    },
    values: {
      enumerable: false,
      value: declarations,
    },
  })

  cache[hash] = result

  return result
}

let animationCount = 0
css.keyframes = (name, declarations) => {
  if (typeof name !== 'string') {
    declarations = name
    name = 'animation'
  }

  const uniqueName = `${name}-${animationCount++}`
  manager.addRule(`@keyframes ${uniqueName}`, declarations)

  return uniqueName
}

export default css
