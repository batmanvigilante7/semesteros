# Design

## Palette

The color system uses CSS Custom Properties defined using `oklch` for smooth, perceptual gradients and contrast-safe scaling in both Light and Dark themes.

### Light Mode

| Token | OKLCH Value | HEX Equivalent | Usage |
|---|---|---|---|
| `--bg-primary` | `oklch(0.99 0.002 240)` | `#FCFDFE` | Main page background |
| `--bg-secondary` | `oklch(0.96 0.004 240)` | `#F1F3F5` | Sidebar, secondary layouts |
| `--bg-tertiary` | `oklch(0.92 0.006 240)` | `#E5E7EB` | Muted wells, active tracks |
| `--surface` | `oklch(1 0 0)` | `#FFFFFF` | Cards, dialogs, dropdown backgrounds |
| `--text-primary` | `oklch(0.12 0.005 240)` | `#111827` | Headings, primary content |
| `--text-secondary` | `oklch(0.45 0.01 240)` | `#4B5563` | Subtitles, supporting details |
| `--text-muted` | `oklch(0.65 0.01 240)` | `#9CA3AF` | Placeholders, disabled descriptions |
| `--primary` | `oklch(0.55 0.18 250)` | `#2563EB` | Accent color (Apple Blue) |
| `--primary-hover` | `oklch(0.48 0.18 250)` | `#1D4ED8` | Accent hover state |
| `--secondary` | `oklch(0.96 0.004 240)` | `#F1F3F5` | Secondary actions background |
| `--accent` | `oklch(0.58 0.16 280)` | `#7C3AED` | Purple accent details |
| `--success` | `oklch(0.62 0.15 150)` | `#10B981` | Success states, checked items |
| `--warning` | `oklch(0.69 0.13 60)` | `#F59E0B` | Warning alerts, medium-priority tasks |
| `--danger` | `oklch(0.57 0.18 20)` | `#EF4444` | Errors, destructive actions |
| `--info` | `oklch(0.60 0.14 200)` | `#06B6D4` | Informational callouts |
| `--border-subtle` | `oklch(0.94 0.004 240)` | `#E5E7EB` | Default boundaries, card dividers |
| `--border-medium` | `oklch(0.88 0.008 240)` | `#D1D5DB` | Interactive hover borders |

### Dark Mode

| Token | OKLCH Value | HEX Equivalent | Usage |
|---|---|---|---|
| `--bg-primary` | `oklch(0.10 0.005 240)` | `#0B0F19` | Main page background |
| `--bg-secondary` | `oklch(0.14 0.006 240)` | `#121826` | Sidebar, secondary layouts |
| `--bg-tertiary` | `oklch(0.18 0.008 240)` | `#1E293B` | Muted wells, active tracks |
| `--surface` | `oklch(0.13 0.006 240)` | `#0F172A` | Cards, dialogs, dropdown backgrounds |
| `--text-primary` | `oklch(0.96 0.002 240)` | `#F8FAFC` | Headings, primary content |
| `--text-secondary` | `oklch(0.70 0.008 240)` | `#94A3B8` | Subtitles, supporting details |
| `--text-muted` | `oklch(0.50 0.008 240)` | `#64748B` | Placeholders, disabled descriptions |
| `--primary` | `oklch(0.60 0.15 250)` | `#3B82F6` | Accent color (Apple Blue) |
| `--primary-hover` | `oklch(0.65 0.15 250)` | `#60A5FA` | Accent hover state |
| `--secondary` | `oklch(0.18 0.008 240)` | `#1E293B` | Secondary actions background |
| `--accent` | `oklch(0.65 0.16 280)` | `#8B5CF6` | Purple accent details |
| `--success` | `oklch(0.65 0.15 150)` | `#34D399` | Success states, checked items |
| `--warning` | `oklch(0.72 0.14 60)` | `#FBBF24` | Warning alerts, medium-priority tasks |
| `--danger` | `oklch(0.62 0.18 20)` | `#F87171` | Errors, destructive actions |
| `--info` | `oklch(0.68 0.14 200)` | `#22D3EE` | Informational callouts |
| `--border-subtle` | `oklch(0.18 0.008 240)` | `#1E293B` | Default boundaries, card dividers |
| `--border-medium` | `oklch(0.24 0.01 240)` | `#334155` | Interactive hover borders |

---

## Typography

Using the **Inter** sans-serif font family. Line-heights scale perceptual rhythm.

- **Display**: `font-size: 3rem (48px)`, `font-weight: 700`, `letter-spacing: -0.03em`, `line-height: 1.1`
- **Heading**: `font-size: 2rem (32px)`, `font-weight: 650`, `letter-spacing: -0.02em`, `line-height: 1.2`
- **Title**: `font-size: 1.25rem (20px)`, `font-weight: 600`, `letter-spacing: -0.01em`, `line-height: 1.3`
- **Body**: `font-size: 0.875rem (14px)`, `font-weight: 400`, `line-height: 1.6`
- **Caption**: `font-size: 0.75rem (12px)`, `font-weight: 500`, `line-height: 1.5`
- **Label**: `font-size: 0.75rem (12px)`, `font-weight: 700`, `letter-spacing: 0.05em`, `text-transform: uppercase`
- **Code**: `font-family: monospace`, `font-size: 0.8125rem (13px)`, `line-height: 1.5`

---

## Spacing

Strict **8-point system** for all padding, margins, and flex/grid gaps.
- `0.25rem (4px)` - Tiny padding, micro adjustments
- `0.5rem (8px)` - Small padding, tight lists
- `1rem (16px)` - Default body padding, element margins
- `1.5rem (24px)` - Card interior padding, layout grid gaps
- `2rem (32px)` - Section separation
- `3rem (48px)` - Page header margins

---

## Border Radius

Soft, geometric corners.
- `4px` - Checkboxes, micro badges
- `12px` - Buttons, select inputs, small chips
- `16px` - Cards, dialog overlays
- `24px` - Shell containers, dashboard pages

---

## Elevation

Subtle, non-muddy shadows leveraging background tints.
- **Low**: `0 1px 3px rgba(0,0,0,0.05)`
- **Medium**: `0 8px 30px -8px rgba(0,0,0,0.08)`
- **High**: `0 18px 45px -15px rgba(0,0,0,0.12)`

---

## Motion

 Sub-300ms transitions with exponential ease-out curves.
- **Micro-interactions**: `150ms cubic-bezier(0.16, 1, 0.3, 1)`
- **Card entrances**: `250ms cubic-bezier(0.22, 1, 0.36, 1)` (Fade + Y-translate)
- **Dialogs**: `200ms cubic-bezier(0.34, 1.56, 0.64, 1)` (Scale + Fade)
- **Sidebars**: `300ms cubic-bezier(0.16, 1, 0.3, 1)` (X-translate)
