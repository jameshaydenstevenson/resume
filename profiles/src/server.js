import App from './App'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
const server = express()

function renderHTML(markup, assets) {
  return `
    <!doctype html>
    <html lang="">
    <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Paw Call  - All paws in all places give Dr. Scott a call.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
        <script src="${assets.client.js}" defer></script>
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
    </html>`
}

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))

server.get('/*', (req, res) => {
  const markup = renderToString(
    <StaticRouter location={req.url} context={{}}>
      <App />
    </StaticRouter>
  )
  res.send(renderHTML(markup, assets))
})

export default server