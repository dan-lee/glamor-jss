export interface NumberedIndexSignature<V = any> {
  [key: number]: V
}

export interface IndexSignature<V = any> {
  [key: string]: V
}

const isObject = (val: any) =>
  Object.prototype.toString.call(val) === '[object Object]'

const flatten = (arr: any[]) => Array.prototype.concat(...arr)

const mergeValues = (arr: any[]) =>
  arr.reduce((prev, curr) => ({ ...prev, ...curr }), {})

const mergeDeep = (...objects: IndexSignature[]) =>
  objects.reduce((prev, curr) => {
    Object.keys(curr).forEach((key: string) => {
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

export const isFalsy = (value: any) =>
  value === null ||
  value === undefined ||
  value === false ||
  (typeof value === 'object' && Object.keys(value).length === 0)

export const cleanup = (declarations: IndexSignature) => {
  Object.keys(declarations).forEach(key => {
    if (isObject(declarations[key])) {
      cleanup(declarations[key])
    } else if (isFalsy(declarations[key])) {
      delete declarations[key]
    }
  })

  return declarations
}

export const isEmptyObject = (obj: object) => {
  for (const _ in obj) return false
  return true
}

type XY = 'media' | 'supports' | 'pseudo' | 'other'

export const groupByType = (obj: Record<any, any>) =>
  Object.keys(obj).reduce<Record<string, any>>(
    (prev, curr) => {
      let key: XY = 'other'
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
export const processDeclarations = (
  declarations: IndexSignature,
  cache: IndexSignature
) => {
  const flattened = declarations
    .map((d: any) => (d && d.hash ? cache[d.hash].values : d))
    .map((d: any) => (Array.isArray(d) ? mergeValues(flatten(d)) : d))
    .filter(Boolean)

  const merged = mergeDeep(...flattened)

  return groupByType(merged)
}
