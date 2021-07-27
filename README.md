# PhotoViewer
An Electron Project To Slideshow Photos and View Photos

## Download the latest release in the releases tab

## To Build

1. Use electron-packager with the command

`electron-packager . photoviewer`

2. then use electron-installer-windows with the command

`electron-installer-windows --src photoviewer-win32-x64/ --dest installers/ --productName PhotoViewer`

and then the installer files are located in /installers, use the .exe file to install locally or the .msi file to install machine wide