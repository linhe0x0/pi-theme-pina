# Piña 🍍

**Pi Agent, but make it pretty.**

A TUI experience package for [Pi](https://pi.dev/): a polished color system plus UI
extensions that reshape the interface itself.

Less eyesore. More eye candy. Same Pi.

## Why Piña?

Because Pi deserves a little tropical vacation, too.

## What's inside

- 🎨 `pina-dark` — a calm, layered dark theme; every color specified and measured
  in [DESIGN.md](DESIGN.md)
- 🧩 UI extensions that customize the TUI chrome, loaded through a single extension
  entry — disable it in `pi config` to keep the colors only

## Install

```bash
pi install npm:pi-theme-pina   # npm
pi install git:github.com/linhe0x0/pi-theme-pina   # git
pi install ./pi-theme-pina     # local checkout
```

## Usage

Open `/settings` in Pi and select **Theme** → `pina-dark`, or set it directly:

```json
{
  "theme": "pina-dark"
}
```

Extensions shipped by the package load automatically.

## Known issue: double-spaced scrollback after exit

Pi itself (not Piña) repaints the transcript into the terminal scrollback when
exiting fullscreen mode. That exit dump pads every line to the full terminal
width and writes it with autowrap enabled, so when the terminal's real render
grid is one or more columns narrower than the width Pi measured (scrollbar
visible, window resized mid-session, …), every padded line wraps its last cell
onto an extra row and the whole screen looks double-spaced.

Upstream: [pi#9828](https://github.com/earendil-works/pi/issues/9828),
[pi#10710](https://github.com/earendil-works/pi/issues/10710).

Workaround until it is fixed upstream:

```json
{
  "fullscreenExitOutput": "resume-hint"
}
```

Pi then prints only the session resume hint on exit instead of repainting the
transcript. Trade-off: the transcript is no longer copied into scrollback; use
`ctrl+o` inside Pi to browse it.

## Development

```bash
make dev       # register this repo as a pi package: themes + extensions, live
make check     # theme schema validation + typecheck
make help      # list all targets
```

## License

MIT. Go make Pi pretty.
