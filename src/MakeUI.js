const {resolve,dirname} = require('path')
const {chdir} = require('process')

module.exports = function makeUI (GTK, configPath) {

  configPath = resolve(configPath)
  chdir(dirname(configPath))

  let config
  try {
    config = require('fs').readFileSync(configPath, 'utf8')
  } catch (e) {
    console.error(`could not read ${configPath}`)
    process.exit(1)
  }

  let specs
  try {
    specs = require('./ParseConfig')(config)
  } catch (e) {
    console.error(`could not parse ${configPath}`)
    console.error(e)
    process.exit(2)
  }

  const build = require('./GetBuilder')(GTK)
  for (let menuSpec of specs) {
    console.debug(require('util').inspect(menuSpec, { depth: Infinity }))
    const menu = build(menuSpec)
    console.debug(menu)
    menu[1].showAll()
  }

  return function run () {
    GTK.main()
  }

}
