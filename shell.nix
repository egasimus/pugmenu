let
  pkgs = import <nixpkgs> {};
  nativeLibs = with pkgs; [
    cairo
    dbus
    glib
    gobject-introspection
    gtk3
  ];
in pkgs.stdenv.mkDerivation rec {
  name = "pugmenu";
  src = ./.;
  buildInputs = with pkgs; [
    nodejs-12_x
    python2
    pkg-config
    nodePackages.npm
  ] ++ nativeLibs;
  LD_LIBRARY_PATH = pkgs.lib.strings.makeLibraryPath nativeLibs;
}
