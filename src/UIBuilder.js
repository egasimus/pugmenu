const assert = require('assert')
const load = require('pug-load').string
const lex = require('pug-lexer')
const parse = require('pug-parser')

module.exports = makeUI

function makeUI (GTK) {

  const config = require('fs').readFileSync(`${__dirname}/menu.pug`, 'utf8')
  const specs = parseConfig(config)
  const build = getBuilder(GTK)

  for (let menuSpec of specs) {
    console.log(require('util').inspect(menuSpec, { depth: Infinity }))
    const menu = build(menuSpec)
    console.log(menu)
    menu[1].showAll()
  }

  return function run () {
    GTK.main()
  }

}


function parseConfig (source) {

  return walk(load(source, { lex, parse }))

  function walk ({nodes}) {
    const add = (obj,{name,val})=>Object.assign(obj,{[name]:val})
    return nodes.map(({name,attrs,block,val})=>
      block ? {
        ...attrs.reduce(add, {}),
        type: name,
        kids: walk(block)
      } : val
    )
  }

}

function getBuilder (GTK) {

  return build

  function build ({type, kids, ...args}, parent = null) {

    if (!parent) {
      assert(type === 'Menu', 'only Menu can be root element')
      assert(args.icon, 'root Menu must have icon attribute')
      return buildRoot(type, kids, args)
    } else {
      return buildItem(type, kids, args, parent)
    }

  }

  function buildRoot (type, kids, args) {

    console.debug('buildRoot', {type,kids,args})

    const icon = new GTK.StatusIcon.newFromFile(JSON.parse(args.icon))
    const menu = new GTK.Menu()
    icon.connect('popup-menu', show)

    return [icon, menu, ...kids.map(kid=>{
      assert(typeof kid === 'object', "children of root can't be strings")
      const item = build(kid, true)
      menu.append(item)
      return item
    })]

    function show (button, time) {
      console.log('showMenu', button, time)
      const position = menu => GTK.StatusIcon.positionMenu(menu, 0, 0, icon)
      menu.popup(null, null, position, button, time)
    }

  }

  function buildItem (type, kids, args) {

    const label = String(args.label)
    console.log('buildItem', {type,label,kids,args})

    const item = new GTK.MenuItem()
    item.setLabel(label)

    switch (type) {
      case 'Menu':
        const menu = new GTK.Menu()
        item.setSubmenu(menu)
        for (let kid of kids) menu.append(build(kid, true))
        break
      case 'Run':
        const {command} = args
        item.on('activate', ()=>{
          console.log('Run', kids, args)
          require('child_process').execFile('sh', ['-c', kids.join('\n')], { stdio: 'inherit'})
        })
        break
      case 'Open':
        item.on('activate', ()=>{
          console.debug('Open', kids, args)
          require('child_process').execFile('xdg-open', kids, { stdio: 'inherit'})
        })
        break
      default:
        throw new Error(`unknown item type ${type}`)
    }
    return item
  }

}
