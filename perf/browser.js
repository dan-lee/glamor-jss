import createSuite from './create-suite'
import Benchmark from 'benchmark'

window.Benchmark = Benchmark

const app = document.getElementById('app')

const clear = () => app.innerHTML = ''
const log =  text => {
  const div = document.createElement('div')
  div.innerText = text
  app.appendChild(div)
}

const Suite = createSuite('glamor-jss', {
  onStart() {
    this.reset()
    clear()
    log('Starting...')
  },
  onCycle(event) {
    log(String(event.target))
  },
  onComplete() {
    log('Fastest is ' + this.filter('fastest').map('name'))
  },
})

Suite.run({ async: true })
