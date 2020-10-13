const assert = require('assert')
const {execFile} = require('child_process')

module.exports = function getBuilder (GTK) {

  return build

  function build ({type, kids, ...args}, parent = null) {

    if (parent) {
      return buildItem(type, kids, args, parent)
    } else {
      assert(type === 'Menu', 'only Menu can be root element')
      assert(args.icon, 'root Menu must have icon attribute')
      return buildRoot(type, kids, args)
    }

  }

  function buildRoot (type, kids, args) {

    console.debug('buildRoot', {type,kids,args})

    const icon = new GTK.StatusIcon.newFromFile(args.icon)
    const menu = new GTK.Menu()
    icon.connect('activate', ()=>show(0, GTK.getCurrentEventTime()))
    icon.connect('popup-menu', show)

    return [icon, menu, ...kids.map(kid=>{
      assert(typeof kid === 'object', "children of root can't be strings")
      const items = build(kid, true)
      items.forEach(item=>menu.append(item))
      return items
    })]

    function show (button, time) {
      console.debug('showMenu', button, time)
      const position = menu => GTK.StatusIcon.positionMenu(menu, 0, 0, icon)
      menu.popup(null, null, position, button, time)
    }

  }

  function buildItem (type, kids, args) {

    const item = new GTK.MenuItem()
    item.setLabel(String(args.label))

    switch (type) {
      case 'Menu': return [Menu()]
      case 'Run':  return [Run()]
      case 'Open': return [Open()]
      case 'List': return List()
      default: throw NotImplemented()
    }

    function Menu () {
      const menu = new GTK.Menu()
      item.setSubmenu(menu)
      kids = [].concat(...kids.map(kid=>build(kid, true)))
      kids.forEach(kid=>menu.append(kid))
      return item
    }

    function Run () {
      const {command} = args
      item.on('activate', ()=>{
        console.debug('Run', kids, args)
        execute('sh', '-c', kids.join('\n'))
      })
      return item
    }

    function Open () {
      item.on('activate', ()=>{
        console.debug('Open', kids, args)
        execute('xdg-open', ...kids)
      })
      return item
    }

    function List () {
      return [].concat(...args.nodes.map(node=>build(node, true)))
    }

    function NotImplemented () {
      return new Error(`unknown item type ${type}`)
    }
  }

}

function execute (command, ...args) {
  return execFile(command, args, { stdio: 'inherit' })
}
