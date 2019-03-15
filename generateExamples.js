var fs = require('fs')

var walkTemplates = function (dir) {
  var res = [];
  fs.readdirSync(dir).forEach(function (type,k) {
    if (fs.statSync(dir + '/' + type).isDirectory()) {
       var codes = [];
      fs.readdirSync(dir + '/' + type).forEach(function (example,kk) {
        codes.push({
          'key':''+k+'-'+kk,
          'title':example.replace(/-/g,' ').replace('.txt',''),
          'code':fs.readFileSync(dir + '/' + type + '/' + example).toString()
        })
      })
      res.push({
        cat : type.replace(/-/g, ' '),
        codes : codes
      })
    }
  })
  return JSON.stringify(res,null,4)
};

const outFilename = 'src/examples.json';
fs.writeFile(outFilename, walkTemplates('examples'), function (err) {
  if (err) throw err;
  console.log(outFilename + ' saved.');
});


