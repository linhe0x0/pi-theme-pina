/**
 * Footer replacement that mirrors pi's built-in FooterComponent minus the model
 * segment: PinaEditor renders "(provider) model • level" inside the input panel
 * instead, so the built-in footer would show the same string twice. Everything
 * else follows FooterComponent.render (pi's
 * dist/modes/interactive/components/footer.js): cwd + git branch + session
 * name, token stats with context percentage, and extension statuses.
 *
 * Dropped rather than faked — pi does not export these from the extension API:
 * - "(sub)": pi also checks an internal OAuth subscription flag on the model
 *   runtime; only its kimi-coding special case is reproduced here.
 * - " • xp": the experimental-features check is not exported.
 * - The routed virtual-model suffix, like in the editor's segment.
 */
import { isAbsolute, relative, resolve, sep } from 'node:path'
import type {
  ExtensionContext,
  ReadonlyFooterDataProvider,
  Theme,
} from '@earendil-works/pi-coding-agent'
import { truncateToWidth, visibleWidth, type TUI } from '@earendil-works/pi-tui'

/** Structural subset of pi's effective settings; pi.getSettings() satisfies it. */
type SettingsAccessor = () => { compaction?: { enabled?: boolean } | undefined }

function formatTokens(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 10000) return `${(count / 1000).toFixed(1)}k`
  if (count < 1000000) return `${Math.round(count / 1000)}k`
  if (count < 10000000) return `${(count / 1000000).toFixed(1)}M`
  return `${Math.round(count / 1000000)}M`
}

function formatCwdForFooter(cwd: string): string {
  const home = process.env.HOME || process.env.USERPROFILE
  if (!home) return cwd
  const resolvedCwd = resolve(cwd)
  const resolvedHome = resolve(home)
  const relativeToHome = relative(resolvedHome, resolvedCwd)
  const isInsideHome =
    relativeToHome === '' ||
    (relativeToHome !== '..' &&
      !relativeToHome.startsWith(`..${sep}`) &&
      !isAbsolute(relativeToHome))
  if (!isInsideHome) return cwd
  return relativeToHome === '' ? '~' : `~${sep}${relativeToHome}`
}

function sanitizeStatusText(text: string): string {
  return text
    .replace(/[\r\n\t]/g, ' ')
    .replace(/ +/g, ' ')
    .trim()
}

/** Cumulative usage of the session branch, cached the same way FooterComponent caches its scan. */
type SessionStats = {
  sessionId: string
  leafId: string
  entryCount: number
  input: number
  output: number
  cacheRead: number
  cacheWrite: number
  cost: number
  cacheHitRate: number | undefined
}

export class PinaFooter {
  private readonly footerData: ReadonlyFooterDataProvider
  private readonly getCtx: () => ExtensionContext
  private readonly getSettings: SettingsAccessor
  private readonly tui: TUI
  private readonly unsub: () => void
  private stats: SessionStats | undefined

  constructor(
    tui: TUI,
    getCtx: () => ExtensionContext,
    footerData: ReadonlyFooterDataProvider,
    getSettings: SettingsAccessor,
  ) {
    this.tui = tui
    this.getCtx = getCtx
    this.footerData = footerData
    this.getSettings = getSettings
    // The branch appears and disappears without keystrokes or events.
    this.unsub = footerData.onBranchChange(() => tui.requestRender())
  }

  invalidate(): void {}

  dispose(): void {
    this.unsub()
  }

  render(width: number): string[] {
    const ctx = this.getCtx()
    const theme = ctx.ui.theme
    const lines: string[] = []

    // One line: path (cwd, git branch, session name) on the left, token stats
    // right-aligned on the same row. The model segment lives in PinaEditor's
    // status row.
    let pwd = formatCwdForFooter(ctx.sessionManager.getCwd())
    const branch = this.footerData.getGitBranch()
    if (branch) pwd += ` (${branch})`
    const sessionName = ctx.sessionManager.getSessionName()
    if (sessionName) pwd += ` • ${sessionName}`
    const stats = this.statsLine(ctx, theme)
    // Shrink the path first; the stats keep their context-percentage colors.
    const path = truncateToWidth(
      theme.fg('dim', pwd),
      Math.max(0, width - visibleWidth(stats) - 1),
      theme.fg('dim', '...'),
    )
    const gap = ' '.repeat(
      Math.max(1, width - visibleWidth(stats) - visibleWidth(path)),
    )
    lines.push(truncateToWidth(path + gap + stats, width, '...'))

    // Extension statuses on a single line, sorted by key alphabetically.
    const statuses = this.footerData.getExtensionStatuses()
    if (statuses.size > 0) {
      const statusLine = Array.from(statuses.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, text]) => sanitizeStatusText(text))
        .join(' ')
      lines.push(truncateToWidth(statusLine, width, theme.fg('dim', '...')))
    }
    return lines
  }

  private statsLine(ctx: ExtensionContext, theme: Theme): string {
    const stats = this.sessionStats(ctx)
    const parts: string[] = []
    if (stats.input) parts.push(`↑${formatTokens(stats.input)}`)
    if (stats.output) parts.push(`↓${formatTokens(stats.output)}`)
    if (stats.cacheRead) parts.push(`R${formatTokens(stats.cacheRead)}`)
    if (stats.cacheWrite) parts.push(`W${formatTokens(stats.cacheWrite)}`)
    if (
      (stats.cacheRead > 0 || stats.cacheWrite > 0) &&
      stats.cacheHitRate !== undefined
    ) {
      parts.push(`CH${stats.cacheHitRate.toFixed(1)}%`)
    }
    const model = ctx.model
    // pi also enables this for OAuth subscription providers via the model runtime,
    // which extensions cannot see; the kimi-coding case is reproducible.
    const usingSubscription = model?.provider === 'kimi-coding'
    if (stats.cost || usingSubscription) {
      parts.push(
        `$${stats.cost.toFixed(3)}${usingSubscription ? ' (sub)' : ''}`,
      )
    }

    // Context percentage, colored by usage like the built-in footer.
    const usage = ctx.getContextUsage()
    const contextWindow = usage?.contextWindow ?? model?.contextWindow ?? 0
    const percentValue = usage?.percent ?? 0
    const autoIndicator =
      (this.getSettings().compaction?.enabled ?? true) ? ' (auto)' : ''
    const percent = usage?.percent !== null ? percentValue.toFixed(1) : '?'
    const display =
      percent === '?'
        ? `?/${formatTokens(contextWindow)}${autoIndicator}`
        : `${percent}%/${formatTokens(contextWindow)}${autoIndicator}`
    parts.push(
      percentValue > 90
        ? theme.fg('error', display)
        : percentValue > 70
          ? theme.fg('warning', display)
          : display,
    )

    // The context segment embeds its own color and reset, which would end a
    // whole-line dim wrap; nothing uncolored follows it, so one dim wrap matches.
    return theme.fg('dim', parts.join(' '))
  }

  private sessionStats(ctx: ExtensionContext): SessionStats {
    const sessionManager = ctx.sessionManager
    const sessionId = sessionManager.getSessionId() ?? ''
    const leafId = sessionManager.getLeafId() ?? ''
    const entries = sessionManager.getEntries()
    const cached = this.stats
    if (
      cached &&
      cached.sessionId === sessionId &&
      cached.leafId === leafId &&
      cached.entryCount === entries.length
    ) {
      return cached
    }
    const stats: SessionStats = {
      sessionId,
      leafId,
      entryCount: entries.length,
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      cost: 0,
      cacheHitRate: undefined,
    }
    for (const entry of entries) {
      if (entry.type === 'usage') {
        addUsage(stats, entry.usage)
      } else if (
        entry.type === 'message' &&
        entry.message.role === 'assistant'
      ) {
        addUsage(stats, entry.message.usage)
        const promptTokens =
          entry.message.usage.input +
          entry.message.usage.cacheRead +
          entry.message.usage.cacheWrite
        stats.cacheHitRate =
          promptTokens > 0
            ? (entry.message.usage.cacheRead / promptTokens) * 100
            : undefined
      } else if (
        entry.type === 'message' &&
        entry.message.role === 'toolResult' &&
        entry.message.usage
      ) {
        addUsage(stats, entry.message.usage)
      } else if (
        (entry.type === 'branch_summary' || entry.type === 'compaction') &&
        entry.usage
      ) {
        addUsage(stats, entry.usage)
      }
    }
    this.stats = stats
    return stats
  }
}

function addUsage(
  stats: SessionStats,
  usage: {
    input: number
    output: number
    cacheRead: number
    cacheWrite: number
    cost: { total: number }
  },
): void {
  stats.input += usage.input
  stats.output += usage.output
  stats.cacheRead += usage.cacheRead
  stats.cacheWrite += usage.cacheWrite
  stats.cost += usage.cost.total
}
