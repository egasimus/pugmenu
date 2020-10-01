const assert = require('assert')

module.exports = makeUI

function makeUI (GTK) {

  const UI = {
    icon: new GTK.StatusIcon.newFromFile('src/icon.png'),
    menu: new GTK.Menu(),
    system: {
      item: new GTK.MenuItem(),
      menu: new GTK.Menu(),
      restartCUPS: new GTK.MenuItem(),
      restartTor:  new GTK.MenuItem(),
      restartVPN:  new GTK.MenuItem()
    },
    user: {
      item: new GTK.MenuItem(),
      menu: new GTK.Menu()
    }
  }

  UI.icon.connect('popup-menu', function showMenu (button, time) {
    console.log('showMenu', button, time)
    UI.menu.popup(null, null, function positionMenu (menu, icon) {
      return GTK.StatusIcon.positionMenu(menu, 0, 0, UI.icon)
    }, button, time)
  })

  UI.menu.append(UI.system.item)
  UI.system.item.setLabel('System')
  UI.system.item.setSubmenu(UI.system.menu)
  UI.system.restartCUPS.setLabel('Restart CUPS')
  UI.system.menu.append(UI.system.restartCUPS)
  UI.system.restartTor.setLabel('Restart Tor')
  UI.system.menu.append(UI.system.restartTor)
  UI.system.restartVPN.setLabel('Restart VPN')
  UI.system.menu.append(UI.system.restartVPN)

  UI.menu.append(UI.user.item)
  UI.user.item.setLabel('User')
  UI.user.item.setSubmenu(UI.user.menu)

  return function run () {
    UI.menu.showAll()
    GTK.main()
  }

}

