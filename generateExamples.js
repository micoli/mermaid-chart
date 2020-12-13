const fs = require('fs');

const walkTemplates = function (dir) {
  const res = [];
  fs.readdirSync(dir).forEach((type, k) => {
    if (fs.statSync(`${dir}/${type}`).isDirectory()) {
      const codes = [];
      fs.readdirSync(`${dir}/${type}`).forEach((example, kk) => {
        codes.push({
          key: `${k}-${kk}`,
          title: example.replace(/-/g, ' ').replace('.txt', ''),
          code: fs.readFileSync(`${dir}/${type}/${example}`).toString(),
        });
      });
      res.push({
        cat: type.replace(/-/g, ' '),
        codes,
      });
    }
  });
  return JSON.stringify(res, null, 4);
};

const outFilename = 'src/examples.json';
fs.writeFile(outFilename, walkTemplates('examples'), (err) => {
  if (err) throw err;
  console.log(`${outFilename} saved.`);
});
