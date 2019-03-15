// content of index.js
const port = process.env.PORT || 3000

var express = require('express')
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic('docs', {'index': ['index.html','default.html', 'default.htm']}))
app.listen(port)

console.log(`Server listening port ${port}`)
