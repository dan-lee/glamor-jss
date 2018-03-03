import React from 'react'
import express from 'express'
import ReactDOMServer from 'react-dom/server'
import { renderToString } from 'glamor-jss'
import CleanCss from 'clean-css'
import App from './App'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
// You can minify the CSS sent from the server to save some bytes
const clean = new CleanCss()
const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const html = ReactDOMServer.renderToString(<App />)
    const css = renderToString()
    const { styles } = clean.minify(css)

    res.status(200).send(
      `<!doctype html>
<html>
<head>
  <title>glamor-jss</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style id="ssr">${styles}</style>
  <link href="https://fonts.googleapis.com/css?family=Alegreya" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  ${
    process.env.NODE_ENV === 'production'
      ? `<script src="${assets.client.js}" defer></script>`
      : `<script src="${assets.client.js}" defer crossorigin></script>`
  }
</head>
<body>
  <div id="root">${html}</div>
</body>
</html>`
    )
  })

export default server
