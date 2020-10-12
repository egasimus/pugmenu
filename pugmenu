#!/usr/bin/env node

const GI = require('node-gtk')
GI.startLoop()

const GTK = GI.require('Gtk', '3.0')
GTK.init()

const run = require('./src/UIBuilder')(GTK)
run()
