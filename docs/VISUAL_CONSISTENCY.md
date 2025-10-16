# PredictivePulse Visual Consistency Guidelines

## Overview
This document outlines the visual consistency standards for the PredictivePulse platform to ensure a polished, professional appearance across all views and devices.

---

## Typography System

### Headings
- **H1**: `text-3xl sm:text-4xl lg:text-5xl` - Main page titles
- **H2**: `text-2xl sm:text-3xl lg:text-4xl` - Section headers
- **H3**: `text-xl sm:text-2xl lg:text-3xl` - Subsection headers
- **H4**: `text-lg sm:text-xl lg:text-2xl` - Card titles
- **H5**: `text-base sm:text-lg lg:text-xl` - Small headers
- **H6**: `text-sm sm:text-base lg:text-lg` - Tiny headers

### Body Text
- **Base**: `text-sm sm:text-base` - Default body text
- **Small**: `text-xs sm:text-sm` - Secondary information
- **Muted**: Use `text-muted-foreground` for less important text

### Font Families
- **Heading**: `font-heading` (Poppins)
- **Body**: `font-sans` (Inter)

---

## Spacing System

### Standard Units
Use the 4px base unit system:
- `gap-2` (8px) - Tight spacing
- `gap-3` (12px) - Compact spacing
- `gap-4` (16px) - Default spacing
- `gap-6` (24px) - Comfortable spacing
- `gap-8` (32px) - Generous spacing

### Responsive Spacing
```tsx
// Padding
p-4 sm:p-6 lg:p-8

// Margin
mb-4 sm:mb-6 lg:mb-8

// Gap
gap-4 sm:gap-6 lg:gap-8
```

### Container Widths
```tsx
// Maximum content width
max-w-[1600px] mx-auto

// Card/component padding
px-4 sm:px-6 lg:px-8
```

---

## Color System

### Semantic Colors (Use these, NOT direct colors)
```css
/* Primary brand colors */
bg-primary, text-primary
bg-primary-variant, text-primary-variant

/* UI colors */
bg-background, text-foreground
bg-card, text-card-foreground
bg-muted, text-muted-foreground
bg-accent, text-accent-foreground

/* Borders */
border-border

/* Status colors */
bg-destructive (errors/warnings)
text-green-600 (success - use sparingly)
```

### Gradients
```tsx
// Primary gradient
bg-gradient-to-r from-primary to-primary-variant

// Background gradient
bg-gradient-to-br from-background via-background to-muted/30
```

---

## Component Standards

### Cards
```tsx
<Card className="overflow-hidden">
  <CardHeader className="space-y-2">
    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
      <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
      <span className="truncate">Title</span>
    </CardTitle>
    <CardDescription className="text-xs sm:text-sm">
      Description text
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-2">
    {/* Content */}
  </CardContent>
</Card>
```

### Buttons
```tsx
// Use semantic sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Use semantic variants
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

### Tables
```tsx
<div className="rounded-lg border bg-card overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[120px]">Column</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {/* Rows */}
    </TableBody>
  </Table>
</div>
```

### Tabs
```tsx
<Tabs defaultValue="tab1" className="w-full">
  <TabsList className="grid w-full grid-cols-3 h-auto">
    <TabsTrigger value="tab1" className="flex items-center gap-2 py-3">
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="hidden sm:inline truncate">Label</span>
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1" className="space-y-6 mt-6">
    {/* Content */}
  </TabsContent>
</Tabs>
```

---

## Responsive Grid Layouts

### Standard Grids
```tsx
// Auto-responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// Metrics grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Chart grid
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

---

## Z-Index Layering

Use semantic z-index values from CSS variables:
- `z-[var(--z-base)]` - Base content (0)
- `z-[var(--z-dropdown)]` - Dropdowns (1000)
- `z-[var(--z-sticky)]` - Sticky headers (1020)
- `z-[var(--z-fixed)]` - Fixed elements (1030)
- `z-[var(--z-modal-backdrop)]` - Modal backdrops (1040)
- `z-[var(--z-modal)]` - Modals (1050)
- `z-[var(--z-popover)]` - Popovers (1060)
- `z-[var(--z-tooltip)]` - Tooltips (1070)

---

## Layout Patterns

### Page Header
```tsx
<div className="w-full space-y-6">
  <div className="mb-6">
    <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-2">
      Page Title
    </h1>
    <p className="text-muted-foreground text-sm sm:text-base">
      Page description
    </p>
  </div>
  {/* Content */}
</div>
```

### Section Layout
```tsx
<div className="space-y-6">
  {/* Multiple sections */}
</div>
```

### Metric Cards
```tsx
<Card className="relative overflow-hidden">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
    <CardTitle className="text-sm font-medium text-card-foreground">
      Metric Name
    </CardTitle>
    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
  </CardHeader>
  <CardContent className="space-y-2">
    <div className="text-2xl sm:text-3xl font-bold text-foreground">
      Value
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <span className="text-xs text-muted-foreground truncate">
        Supporting text
      </span>
    </div>
  </CardContent>
</Card>
```

---

## Common Pitfalls to Avoid

### ❌ Don't:
- Use hardcoded colors like `text-white`, `bg-black`, `text-blue-500`
- Use inconsistent spacing (e.g., `gap-3` in one place, `gap-5` in another)
- Forget responsive variants for text/padding
- Nest too many levels of flex/grid without min-width constraints
- Mix font families inappropriately
- Use arbitrary z-index values

### ✅ Do:
- Use semantic color tokens (`text-foreground`, `bg-card`)
- Stick to the spacing scale (2, 3, 4, 6, 8, 12, 16, 24)
- Always include responsive variants for critical elements
- Add `min-w-0` to flex children to prevent overflow
- Use `font-heading` for headings, `font-sans` for body
- Use CSS variables for z-index (`z-[var(--z-dropdown)]`)
- Add `flex-shrink-0` to icons in flex containers
- Use `truncate` or `line-clamp` utilities to prevent text overflow
- Include `overflow-hidden` on cards to prevent content bleeding

---

## Mobile-First Principles

1. **Design for 360px width first** (iPhone SE)
2. **Add responsive variants** at sm (640px), md (768px), lg (1024px)
3. **Stack vertically on mobile**, side-by-side on larger screens
4. **Use touch-friendly targets** (min 44px height)
5. **Test horizontal scroll** - eliminate it wherever possible

---

## Testing Checklist

Before marking a view as complete:
- [ ] No text clipping at 360px, 768px, 1280px widths
- [ ] No horizontal scroll on any viewport
- [ ] All interactive elements have proper hover/focus states
- [ ] Tables are responsive (scroll or stack)
- [ ] Charts render without distortion
- [ ] Colors use semantic tokens (no hardcoded values)
- [ ] Typography follows the scale
- [ ] Spacing is consistent with the 4px system
- [ ] Z-index layering is correct (dropdowns above content)
- [ ] Dark mode looks good (if applicable)

---

## Quick Reference: Utility Classes

```tsx
// Spacing
.stack-sm      // space-y-2
.stack-md      // space-y-4
.stack-lg      // space-y-6 sm:space-y-8

// Layout
.flex-safe     // flex flex-wrap gap-4, min-width: 0
.grid-safe     // grid gap-4, auto-fit minmax(250px, 1fr)

// Containers
.chart-container      // w-full overflow-hidden rounded-lg, min-height: 200px
.table-container      // w-full overflow-x-auto rounded-lg border

// Text
.text-responsive-safe // text-sm sm:text-base lg:text-lg
.truncate-responsive  // truncate with responsive max-widths

// Cards
.card-padding-safe    // p-4 sm:p-6 lg:p-8
.card-layer           // relative z-1
```

---

**Last Updated**: 2025-10-16  
**Maintained by**: PredictivePulse Design System
