# pugmenu

pugmenu allows you to create a menu of frequently used commands and places
using a simple configuration language based on [Pug](https://github.com/pugjs/pug/),
which is the cleanest syntax out there for representing of structured data and
declarative configuration.

## Features

- Configuration
  - [x] Create menu from Pug file passed on command line
  - [ ] Watch configuration file for changes by default
  - [ ] Document supported Pug tags
- Display
  - [x] Display as tray icon
  - [ ] Display as standalone button
    - [ ] Automatically position self
  - [ ] Display as panel widget
  - [ ] Display when clicking on desktop
  - [ ] Allow passing a custom stylesheet
  - [ ] Allow widgets in menu options (slider, text input)
- Dynamic data sources
  - [x] Create a menu option for each entry in a directory
  - [ ] Create a menu option for each line in a file
  - [ ] Create a menu option for each line in the output of a script
    - [ ] ps -at + readlink /proc/PID/cwd
    - [ ] tmux list-sessions, list-clients, list-panes
  - [ ] Watch dynamic sources for changes
