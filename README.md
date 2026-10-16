# Piña 🍍

**Pi Agent, but make it pretty.**

A fresh coat of paint for [Pi](https://pi.dev/). Clean, polished, and easy on the eyes.

Less eyesore. More eye candy. Same Pi.

## Why Piña?

Because Pi deserves a little tropical vacation, too.

## Features

- 🎨 A fresh, modern terminal aesthetic
- 👀 Easy on the eyes, even during long coding sessions
- 🍍 All the Pi, none of the ugliness
- 🌙 Dark mode first (`pina-dark`)

## Install

From a local checkout:

```bash
pi install ./pi-theme-pina
```

Or copy the theme by hand:

```bash
make install   # copies themes/*.json to ~/.pi/agent/themes
```

## Usage

Open `/settings` in Pi and select **Theme** → `pina-dark`, or set it directly:

```json
{
  "theme": "pina-dark"
}
```

## Input editor

The package ships an extension that restyles the input editor: a left accent
bar, a panel background, and extra padding. It loads automatically when the
package is installed with `pi install` (themes alone via `make install` do not
include it).

To try it for one session:

```bash
pi -e ./extensions/pina-editor.ts
```

## Development

```bash
make dev       # register this repo as a pi package: themes + editor extension, live
make validate  # validate theme files against Pi's theme schema
make help      # list all targets
```

`make dev` and `make install`/`make link` are mutually exclusive: the package
already loads `pina-dark`, so a second copy in `~/.pi/agent/themes` collides by
name. `make dev` removes theme copies first; `make undev` unregisters.

Every color is specified and measured in [DESIGN.md](DESIGN.md). Theme JSON must match it.

## License

MIT. Go make Pi pretty.
