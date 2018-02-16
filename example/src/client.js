import App from './App'
import React from 'react'
import { hydrate } from 'react-dom'

hydrate(<App />, document.getElementById('root'), () => {
  const ssr = document.getElementById('ssr')
  ssr.parentNode.removeChild(ssr)
})

if (module.hot) {
  module.hot.accept()
}
