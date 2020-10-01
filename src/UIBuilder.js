const assert = require('assert')

module.exports = makeUI

function makeUI (GTK) {

  const menuSpecs = (function trim ({nodes}) {
    return nodes.map(({name,attrs,block,val})=>
      block ? {
        type: name,
        ...attrs.reduce(
          (attrs,{name,val})=>Object.assign(attrs,{[name]:val}),
          {}
        ),
        kids: trim(block)
      } : val
    )
  })(require('pug-load').string(
    require('fs').readFileSync(`${__dirname}/menu.pug`, 'utf8'),
    { lex: require('pug-lexer'), parse: require('pug-parser') }
  ))

  for (let menuSpec of menuSpecs) {
    console.log(require('util').inspect(menuSpec, { depth: Infinity }))
    instantiate(menuSpec).showAll()
  }

  function instantiate ({type, kids, ...args}, parent = null) {
    if (!parent) {
      console.log({type,kids,args})
      assert(type === 'Menu', 'only Menu can be root element')
      assert(args.icon, 'root Menu must have icon attribute')
      const icon = new GTK.StatusIcon.newFromFile(JSON.parse(args.icon))
      const menu = new GTK.Menu()
      icon.connect('popup-menu', (button, time) => {
        console.log('showMenu', button, time)
        menu.popup(
          null, null,
          (menu, icon) => GTK.StatusIcon.positionMenu(menu, 0, 0, icon),
          button, time
        )
      })
      for (let kid of kids) {
        assert(typeof kid === 'object', "root children can't be strings")
        instantiate(kid, menu)
      }
    } else {
      const label = kids[0]
      kids = kids.slice(1)
      const item = new GTK.MenuItem()
      switch (type) {
        case 'Menu':
          const menu = new GTK.Menu()
          item.setSubmenu(menu)
          for (let kid of kids) instantiate(kid, menu)
          break
        case 'Run':
          const {command} = args
          item.on('clicked', ()=>console.log(command))
          break
        default:
          throw new Error(`unknown item type ${type}`)
      }
      item.setLabel(String(kids[0]))
      parent.append(item)
      return item
    }
  }

  return function run () {
    GTK.main()
  }

}

