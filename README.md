# Kodi Launcher

A Decky Loader plugin that adds a Kodi launch button to the Steam GameMode main navigation menu, enabling easy session switching between Steam and Kodi.

## Overview

Kodi Launcher is designed specifically for use with the [Bazzite-Kodi](https://github.com/Blahkaey/Bazzite-Kodi) image, which includes a prebuilt Kodi GBM installation and supports seamless session switching between Kodi and the Steam Game UI.

## Features

- Adds a dedicated "Kodi" button to the Steam UI's main navigation menu
- One-click switching from Steam to Kodi
- Clean integration with the Steam Deck interface

## Requirements

- [Bazzite-Kodi](https://github.com/Blahkaey/Bazzite-Kodi) image
- [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) installed

## Usage

Once installed, you'll see a new "Kodi" button in the Steam UI's main navigation menu (alongside Library, Store, etc.). Simply click this button to launch Kodi.

## How It Works

The plugin patches the Steam UI to inject a custom menu item that, when clicked, executes the `request-kodi` command provided by the Bazzite-Kodi-SteamOS image. This triggers the session switch from Steam to Kodi.

## Credits

Special thanks to [@jessebofill](https://github.com/jessebofill) for the [DeckWebBrowser](https://github.com/jessebofill/DeckWebBrowser) plugin, which provided the foundation for the main navigation menu button implementation that was adapted for this project.


