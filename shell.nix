with import <nixpkgs> {};
#let
  #systemd-glib = stdenv.mkDerivation {
    #name = "systemd-glib";
    #src = stdenv.fetchFromGitHub {
      #owner = "tcbrindle";
      #repo = "systemd-glib";
      #rev = ""
    #};
  #};
#in
stdenv.mkDerivation {
  name = "node-gtk-test";
  src = ./.;
  nativeBuildInputs = [python2 pkg-config nodePackages.npm];
  buildInputs = [gtk3 gobject-introspection glib cairo dbus];
  propagatedBuildInputs = [nodejs];
  LD_LIBRARY_PATH = lib.strings.makeLibraryPath [
    gtk3
    gobject-introspection
    glib
    cairo
    dbus
  ];
}
