#!/usr/bin/env node

const createSuite = require('./create-suite')

const Suite = createSuite('glamor-jss', {
  minSamples: 100,
  onStart() {
    console.log('Starting...')
  },
  onCycle(event) {
    console.log(String(event.target))
  },
  onComplete() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  },
})

Suite.run({ async: true })
