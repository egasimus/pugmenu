const DBus = require('dbus')
//const systemBus = DBus.getBus('system')
//const systemInit = systemBus.getInterface(
  //'org.freedesktop.systemd1',
  //'/org/freedesktop/systemd1',
  //'org.freedesktop.systemd1.Manager',
  //iface => {
    //console.log(iface)
  //})

const sessionBus = DBus.getBus('session')
const sessionInit = sessionBus.getInterface(
  'org.freedesktop.sessiond1',
  '/org/freedesktop/sessiond1',
  'org.freedesktop.sessiond1.Manager',
  iface => {
    console.log(iface)
  })
console.log(sessionInit)

