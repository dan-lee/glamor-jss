// import 'es6-weak-map/implement'

import { create } from 'jss'
import preset from 'jss-preset-default'
import hashify from 'hash-it'
import memoize from 'memoize-weak'
import NormalizePseudoSelectorPlugin from './normalize-selector'
import { processDeclarations, isEmptyObject, cleanup, isFalsy } from './utils'
import Manager from './Manager'

const manager = new Manager()
export const renderToString = () => manager.registry.toString()
export const reset = () => manager.reset()
export const jss = create(preset())
export const getSheet = () => manager.getSheet()
const cache = {}

// Replace :hover with &:hover, etc.
jss.use(NormalizePseudoSelectorPlugin())

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

  // Pull out already declared rules
  const cleanedDecl = declarations.map(
    decl => (decl && 'values' in decl ? decl.values : decl)
  )

  const groupedDecl = processDeclarations(cleanedDecl)

  // Go through all grouped declarations → { media: { '@media (…)': {} }, pseudo: { ':hover': {}, …}
  // Add them as rule with the same name and return the selector by reducing it
  const selector = ['other', 'pseudo', 'media', 'supports'].reduce(
    (selector, key) => {
      const subDecl = groupedDecl[key]
      if (!isEmptyObject(subDecl)) {
        const cleanedDecl = cleanup(subDecl)
        const rule = manager.addRule(hash, cleanedDecl)
        return rule.selector
      }
      return selector
    },
    ''
  )

  const className = selector.substring(1)
  const result = { className }

  // Add these properties as non-enumerable so they don't pollute spreading {...css(…)}
  Object.defineProperties(result, {
    toString: {
      enumerable: false,
      value: () => className,
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

// @todo: Adding keyframes currently doesn't work
// let animationCount = 0
// css.keyframes = (name, declarations) => {
//   if (typeof name !== 'string') {
//     declarations = name
//     name = 'animation'
//   }
//
//   const uniqueName = `${name}-${animationCount++}`
//
//   return manager.addRule(uniqueName, {
//     [`@keyframes ${uniqueName}`]: declarations,
//   })
// }

export default css
