/**
 * Piña extension entry. Registers every TUI customization in one place so the
 * package can be enabled or disabled as a unit: input editor today, status bar
 * and message rendering as they land. Each concern lives in its own src/ module.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { PinaEditor } from "../src/editor.ts";

export default function (pi: ExtensionAPI) {
	pi.on("session_start", (_event, ctx) => {
		if (ctx.mode !== "tui") return;
		ctx.ui.setEditorComponent((tui, theme, keybindings) => new PinaEditor(tui, theme, keybindings, () => ctx.ui.theme));
	});
}
