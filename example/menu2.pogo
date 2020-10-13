# This is an example of a different language.
# It doesn't work.

Format:
  One: Menu
  Menu: Label
    ZeroOrOne: Icon
    ZeroOrMore: Item
    ZeroOrMore: Menu
  Item: Label
    ZeroOrMore: Opens
    ZeroOrMore: Runs
  Opens: Path
  Runs: Commands

Data:
  Menu:
    Icon: src/icon.png

    Menu: Documentation
      Item: NixOS Packages
        Opens: https://search.nixos.org/packages
      Item: NixOS Items
        Opens: https://search.nixos.org/options

    Item: Powersave
      Runs:
        gksudo -- cpupower frequency-set -u 800 -d 800
        xbacklight -set 10
    Item: Performance
      Runs:
        gksudo cpupower frequency-set -g performance
        xbacklight -set 100

    Menu: Consoles

    Menu: Repositories

    Menu: Network
      Item: Restart Tor
        Runs: gksudo systemctl restart tor
      Item: Restart VPN
        Runs: gksudo systemctl restart mullvad-daemon
      Item: Rescan wireless networks
        Runs: gksudo iw dev wlp3s0 scan

    Menu: Printing
      Item: Restart printing service
        Runs: gksudo systemctl restart cups
