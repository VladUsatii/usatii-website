# SVG to PNG

A small Python CLI for converting SVG files into PNG files on macOS. It uses
Chrome, Chromium, or Edge as the renderer, so installed fonts and browser SVG
layout are preserved.

## Install

From this directory:

```bash
python3 -m pip install .
```

For an isolated global command with `pipx`:

```bash
brew install pipx
pipx install .
```

Google Chrome, Chromium, or Microsoft Edge must be installed.

## Use

```bash
svg-to-png input.svg
svg-to-png input.svg output.png
svg-to-png input.svg output.png --scale 2
svg-to-png input.svg output.png --width 1200 --background white
```

Run `svg-to-png --help` for every option.
