# Known issues

<details>
<summary><strong>Double-spaced scrollback after exit</strong></summary>

Pi itself (not Piña) repaints the transcript into the terminal scrollback when
exiting fullscreen mode. That exit dump pads every line to the full terminal
width and writes it with autowrap enabled, so when the terminal's real render
grid is one or more columns narrower than the width Pi measured (scrollbar
visible, window resized mid-session, …), every padded line wraps its last cell
onto an extra row and the whole screen looks double-spaced.

Confirmed reproducible in [Herdr](https://github.com/herdrdev/herdr).

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

</details>
