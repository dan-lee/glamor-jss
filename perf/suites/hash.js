const Benchmark = require('benchmark')

const esHash = require('es-hash')
const hashIt = require('hash-it').default
const hashObject = require('hash-object')
const hashSum = require('hash-sum')
const objectHash = require('object-hash')

let count = 0
const obj = () => [
  {
    color: 'red',
    minWidth: 100,
    minHeight: 100,
    width: 600,
    fontWeight: 800,
    opacity: 0.5,
    WebkitFontSmoothing: 'antialiased',
    ':before': {
      content: count++,
      height: null,
    },
    '@media (min-width: 120px)': {
      ':hover': {
        color: 'green',
      },
    },
  },
  {
    color: 'red',
    height: 100,
  },
]

module.exports = options =>
  new Benchmark.Suite(options)
    .add('esHash', () => esHash(obj()))
    .add('hashIt', () => hashIt(obj()))
    .add('hashObject', () => hashObject(obj()))
    .add('hashSum', () => hashSum(obj()))
    .add('objectHash', () => objectHash(obj()))

/*
___Results___

_Chrome_:
esHash x 83,758 ops/sec ±1.55% (62 runs sampled)
hashIt x 113,960 ops/sec ±2.22% (59 runs sampled)
hashObject x 33,431 ops/sec ±3.02% (56 runs sampled)
hashSum x 86,848 ops/sec ±1.55% (58 runs sampled)
objectHash x 2,161 ops/sec ±1.08% (60 runs sampled)
Fastest is hashIt

_Safari_:
esHash x 13,611 ops/sec ±40.88% (15 runs sampled)
hashIt x 112,834 ops/sec ±2.64% (53 runs sampled)
hashObject x 12,062 ops/sec ±2.36% (52 runs sampled)
hashSum x 26,729 ops/sec ±31.82% (29 runs sampled)
objectHash x 1,377 ops/sec ±7.90% (33 runs sampled)
Fastest is hashIt

_Firefox_:
esHash x 78,155 ops/sec ±10.74% (52 runs sampled)
hashIt x 97,284 ops/sec ±3.85% (60 runs sampled)
hashObject x 23,247 ops/sec ±7.72% (56 runs sampled)
hashSum x 80,652 ops/sec ±1.21% (60 runs sampled)
objectHash x 2,741 ops/sec ±4.77% (59 runs sampled)
Fastest is hashIt

_Opera_:
esHash x 78,758 ops/sec ±2.23% (56 runs sampled)
hashIt x 116,101 ops/sec ±1.09% (63 runs sampled)
hashObject x 27,491 ops/sec ±6.90% (61 runs sampled)
hashSum x 84,259 ops/sec ±1.63% (62 runs sampled)
objectHash x 2,990 ops/sec ±1.39% (62 runs sampled)
Fastest is hashIt

_IE 11_:
esHash x 26,643 ops/sec 12.30% (56 runs sampled)
hashIt x 28,158 ops/sec 12.33% (61 runs sampled)
hashObject x 6,751 ops/sec 14.29% (57 runs sampled)
hashSum x 39,733 ops/sec 14.62% (58 runs sampled)
objectHash x 452 ops/sec 14.74% (52 runs sampled)
Fastest is hashSum

_Node_:
esHash x 82,251 ops/sec ±2.41% (80 runs sampled)
hashIt x 125,619 ops/sec ±1.20% (87 runs sampled)
hashObject x 125,687 ops/sec ±2.11% (83 runs sampled)
hashSum x 94,062 ops/sec ±1.28% (88 runs sampled)
objectHash x 8,683 ops/sec ±1.58% (86 runs sampled)
Fastest is hashIt

*/
