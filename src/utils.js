const isObject = val =>
  Object.prototype.toString.call(val) === '[object Object]'

const flatten = arr => Array.prototype.concat(...arr)

const mergeValues = arr =>
  arr.reduce((prev, curr) => ({ ...prev, ...curr }), {})

const mergeDeep = (...objects) =>
  objects.reduce((prev, curr) => {
    Object.keys(curr).forEach(key => {
      const prevVal = prev[key]
      const currVal = curr[key]

      if (Array.isArray(prevVal) && Array.isArray(currVal)) {
        prev[key] = prevVal.concat(...currVal)
      } else if (isObject(prevVal) && isObject(currVal)) {
        prev[key] = mergeDeep(prevVal, currVal)
      } else {
        prev[key] = currVal
      }
    })

    return prev
  }, {})

export const isFalsy = value =>
  value === null ||
  value === undefined ||
  value === false ||
  (typeof value === 'object' && Object.keys(value).length === 0)

export const cleanup = declarations => {
  Object.keys(declarations).forEach(key => {
    if (isObject(declarations[key])) {
      cleanup(declarations[key])
    } else if (isFalsy(declarations[key])) {
      delete declarations[key]
    }
  })

  return declarations
}

export const isEmptyObject = obj => {
  for (const _ in obj) return false
  return true
}

export const groupByType = obj =>
  Object.keys(obj).reduce(
    (prev, curr) => {
      let key = 'other'
      if (curr.indexOf('@supports') === 0) key = 'supports'
      else if (curr.indexOf('@media') === 0) key = 'media'
      else if (curr.indexOf(':') === 0 || curr.indexOf('&:') === 0)
        key = 'pseudo'

      prev[key][curr] = obj[curr]
      return prev
    },
    { media: {}, supports: {}, pseudo: {}, other: {} }
  )

/**
 * This pulls out previous declared declarations,
 * flattens them, combines the values by taking the latest (mergeValues),
 * filters out falsy values and groups them in to @media/@support/pseudos and others
 * to give them precendence in the stylesheet
 */
export const processDeclarations = (declarations, cache) => {
  const flattened = declarations
    .map(d => (d && d.hash ? cache[d.hash].values : d))
    .map(d => (Array.isArray(d) ? mergeValues(flatten(d)) : d))
    .filter(d => d)

  const merged = mergeDeep(...flattened)

  return groupByType(merged)
}
