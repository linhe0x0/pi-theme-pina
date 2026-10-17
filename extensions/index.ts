/**
 * Piña extension entry. Registers every TUI customization in one place so the
 * package can be enabled or disabled as a unit: input editor, status (footer
 * minus the model segment, which the editor pins inside its panel), and message
 * rendering as it lands. Each concern lives in its own src/ module.
 */
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'
import { PinaEditor } from '../src/editor.ts'
import { PinaFooter } from '../src/footer.ts'
import { thinkingQuote } from '../src/thinking-quote.ts'

export default function (pi: ExtensionAPI) {
  pi.registerMarkdownTransformer(thinkingQuote)
  pi.on('session_start', (_event, ctx) => {
    if (ctx.mode !== 'tui') return
    ctx.ui.setEditorComponent(
      (tui, theme, keybindings) =>
        new PinaEditor(tui, theme, keybindings, () => ctx),
    )
    ctx.ui.setFooter(
      (tui, _theme, footerData) =>
        new PinaFooter(
          tui,
          () => ctx,
          footerData,
          () => pi.getSettings(),
        ),
    )
  })
}
