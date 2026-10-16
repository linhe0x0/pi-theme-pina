/**
 * Input editor restyling: panel background, left accent bar, extra padding.
 *
 * Extends CustomEditor, the pi-recommended base for replacing the main editor
 * (preserves application shortcuts and agent controls). Structure:
 * - One accent-colored bar on the left edge. Colored through this.borderColor so
 *   bash mode recolors it exactly like the stock border does.
 * - Panel background from the theme's selectedBg token on every row.
 * - Horizontal padding through EditorOptions.paddingX, plus one blank panel row
 *   above and below the text.
 * - The top/bottom rules are suppressed unless they carry information (working
 *   status, scroll indicator), which CustomEditor.renderTopBorder embeds.
 */
import { CustomEditor, type KeybindingsManager, type Theme } from "@earendil-works/pi-coding-agent";
import { stripTerminalSequences, visibleWidth, type TUI, type TuiMouseEvent } from "@earendil-works/pi-tui";

const PAD_X = 2;
const PAD_Y = 1;
const BAR = "▌";

class PinaEditor extends CustomEditor {
	private getTheme: () => Theme;

	constructor(tui: TUI, theme: ConstructorParameters<typeof CustomEditor>[1], keybindings: KeybindingsManager, getTheme: () => Theme) {
		super(tui, theme, keybindings, { paddingX: PAD_X });
		this.getTheme = getTheme;
	}

	/** Keep the border line only when it carries status or scroll info, not as decoration. */
	private informative(line: string, width: number): boolean {
		return stripTerminalSequences(line) !== "─".repeat(width);
	}

	protected renderTopBorder(width: number, hiddenLineCount: number): string {
		const border = super.renderTopBorder(width, hiddenLineCount);
		return this.informative(border, width) ? border : "";
	}

	protected renderBottomBorder(width: number, hiddenLineCount: number): string {
		const border = super.renderBottomBorder(width, hiddenLineCount);
		return this.informative(border, width) ? border : "";
	}

	render(width: number): string[] {
		if (width < 6) return super.render(width);
		const inner = width - 1; // reserve the left bar column
		const theme = this.getTheme();
		const bg = theme.getBgAnsi("selectedBg");
		// Full resets inside a line would end the panel background; restore it after each one.
		const panel = (line: string) => theme.bg("selectedBg", line.replaceAll("\x1b[0m", `\x1b[0m${bg}`));
		const blank = theme.bg("selectedBg", " ".repeat(inner));
		const bar = this.borderColor(BAR);

		const out: string[] = [];
		for (let i = 0; i < PAD_Y; i++) out.push(bar + blank);
		for (const line of super.render(inner)) {
			const pad = " ".repeat(Math.max(0, inner - visibleWidth(line)));
			out.push(bar + panel(line + pad));
		}
		for (let i = 0; i < PAD_Y; i++) out.push(bar + blank);
		return out;
	}

	handleMouse(event: TuiMouseEvent) {
		// Compensate for the bar column and the top padding row added in render().
		return super.handleMouse({ ...event, y: event.y - PAD_Y, width: event.width - 1 });
	}
}

export { PinaEditor };
