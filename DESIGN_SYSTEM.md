# InsuraFlow Design System (Updated)

## Typography
- Primary: Plus Jakarta Sans (--font-sans)
- Monospace: IBM Plex Mono (--font-mono) - use for task IDs, dates, workflow counts
- Serif: Lora (--font-serif) - optional

## Color Tokens
Primary (Vivid Blue): oklch(0.546 0.215 263)
Background: oklch(0.984 0.003 248)
Foreground: oklch(0.208 0.040 266)
Card: oklch(1.0 0 0)
Border: oklch(0.929 0.013 256)
Muted: oklch(0.968 0.007 248)

Status:
- Success: oklch(0.627 0.194 145)
- Warning/Paused: amber-600
- Destructive/Failed: oklch(0.577 0.215 27)
- Info: oklch(0.546 0.215 263)

## Component Patterns

### Cards
- Base: border border-border/80 bg-card shadow-sm rounded-xl
- Hover: hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5
- Use flex flex-col for consistent height cards

### Icon with Badge
```tsx
<div className="relative">
  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
    <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
  </div>
  <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
    {count}
  </Badge>
</div>
```

### Workflow/Tag Pills
```tsx
<span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
  {label}
</span>
```

### Stats Pills (Header)
```tsx
<div className="flex items-center gap-2.5 rounded-full border border-border/80 bg-card px-4 py-2 shadow-sm transition-colors hover:border-primary/20">
  <Icon className="h-4 w-4 text-primary" />
  <div className="flex flex-col -space-y-0.5">
    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Label</span>
    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{value}</span>
  </div>
</div>
```

### User Profile Pill
```tsx
<div className="flex items-center gap-3 rounded-full border border-border/80 bg-card py-1.5 pl-1.5 pr-4 shadow-sm">
  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
    <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">DF</AvatarFallback>
  </Avatar>
  <div className="flex flex-col -space-y-0.5">
    <span className="text-sm font-medium text-foreground">Name</span>
    <span className="text-[11px] text-muted-foreground">Role</span>
  </div>
</div>
```

### Card Footer with Arrow
```tsx
<div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
  <div className="flex items-center gap-3">
    <span className="font-mono text-xs text-muted-foreground">{count} workflows</span>
    {paused > 0 && <span className="font-mono text-xs font-medium text-amber-600">{paused} paused</span>}
  </div>
  <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
</div>
```

## Spacing & Typography
- Section padding: py-10, px-6
- Grid gap: gap-5
- Card padding: p-5
- Heading: text-xl font-semibold tracking-tight
- Subheading: text-sm text-muted-foreground mt-1
- Card title: text-[15px] font-semibold leading-snug tracking-tight
- Use -space-y-0.5 for tight label/value stacks
