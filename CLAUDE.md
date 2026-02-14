# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **ensurance-quoter** application built with Next.js 16.1.6 (App Router), TypeScript, and Tailwind CSS v4. The project uses a comprehensive shadcn/ui component library with 56+ pre-built accessible components.

## Technology Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5 (strict mode enabled)
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **UI Components**: shadcn/ui (New York style, 56 components installed)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Runtime**: Bun (package manager)

## Development Commands

```bash
# Development server
bun dev                    # Start dev server at http://localhost:3000

# Build and production
bun run build             # Production build
bun start                 # Start production server

# Code quality
bun run lint              # Run ESLint

# shadcn/ui component management
npx shadcn@latest add <component>    # Add new component
npx shadcn@latest add --all          # Add all components
```

## Project Architecture

### Directory Structure

```
/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication routes
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── confirm/              # Email confirmation
│   │   └── password/             # Password reset flows
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── profile/              # User profile
│   │   └── payment/              # Payment flows (success, cancel)
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Homepage
├── components/ui/                # shadcn/ui components (56 total)
├── lib/                          # Utility functions
│   └── utils.ts                  # cn() helper for className merging
├── hooks/                        # Custom React hooks
├── styles/
│   └── globals.css               # Tailwind + shadcn theme config
└── GLOBAL_RULES.md               # Comprehensive design guidelines
```

### Key Architectural Decisions

1. **App Router Over Pages Router**: All routes use Next.js App Router (app/ directory)
2. **shadcn/ui Philosophy**: Components are copied into the project (not npm packages), allowing full customization
3. **Tailwind CSS v4**: Uses new @theme inline syntax with OKLCH color space for better color accuracy
4. **Path Aliases**: `@/*` maps to root, configured in tsconfig.json

## Design System

### Color System (OKLCH)

The project uses OKLCH color space (more perceptually uniform than HSL):

```css
/* Light mode */
--primary: oklch(0.205 0 0);          /* Near black */
--background: oklch(1 0 0);            /* White */

/* Dark mode */
--primary: oklch(0.922 0 0);           /* Near white */
--background: oklch(0.145 0 0);        /* Dark gray */
```

### Component Import Pattern

```typescript
// UI components (from shadcn/ui)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Utilities
import { cn } from "@/lib/utils"
```

### Form Validation Pattern

All forms use React Hook Form + Zod:

```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { email: "", password: "" },
})
```

## Important Patterns

### Client Components

Most interactive components require `"use client"` directive:

```typescript
"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <Button onClick={() => setCount(count + 1)}>{count}</Button>
}
```

### Server Components (Default)

Pages are Server Components by default. Keep data fetching here:

```typescript
// app/dashboard/page.tsx - Server Component
export default async function DashboardPage() {
  const data = await fetchData() // Server-side only
  return <DashboardClient data={data} />
}
```

### Metadata Pattern

```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
}
```

## shadcn/ui Integration

### Available Components (56 installed)

The project has all major shadcn/ui components installed:

- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Calendar, Date Picker, OTP Input
- **Overlays**: Dialog, Sheet, Drawer, Popover, Hover Card, Tooltip, Command
- **Navigation**: Tabs, Accordion, Menubar, Navigation Menu, Breadcrumb
- **Data Display**: Card, Table, Alert, Badge, Avatar, Progress, Chart (Recharts)
- **Feedback**: Toast (Sonner), Alert Dialog, Empty State
- **Layout**: Resizable Panels, Scroll Area, Aspect Ratio

### Component Customization

Components live in `components/ui/` and can be modified directly:

```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        // Add custom variants here
        custom: "bg-gradient-to-r from-purple-500 to-pink-500"
      }
    }
  }
)
```

### Form with shadcn/ui

```typescript
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Tailwind CSS v4 Specifics

### Theme Configuration

Theme is defined using `@theme inline` in `styles/globals.css`:

```css
@theme inline {
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
}
```

### Custom Variant for Dark Mode

```css
@custom-variant dark (&:is(.dark *));
```

### Using CSS Variables

```typescript
// Reference theme values in components
className="bg-background text-foreground border-border"
```

## Global Design Guidelines

This project follows strict design guidelines documented in `GLOBAL_RULES.md` (1975 lines):

1. **Mobile-First Responsive Design**: All UIs must work on mobile first, then scale up
2. **Atomic Design System**: Components organized as Atoms → Molecules → Organisms → Templates → Pages
3. **SEO Optimization**: HTML semantic, metadata, schema.org, Core Web Vitals
4. **Performance**: Bundle < 200KB, LCP < 2.5s, WebP images mandatory
5. **Immutability**: Never mutate objects, always create new ones
6. **TypeScript Strict Mode**: All code must pass strict TypeScript checks

**Critical**: Read `GLOBAL_RULES.md` before making UI changes. It contains detailed requirements for responsive design, component architecture, SEO, and performance.

## Authentication Flow

Routes under `app/auth/`:

- `/auth/login` - User login
- `/auth/register` - New user registration
- `/auth/confirm` - Email confirmation
- `/auth/password` - Password reset request
- `/auth/password/reset` - Password reset form

Routes under `app/dashboard/` are expected to be protected (auth implementation pending).

## Current State

### Implemented
- ✅ Next.js 16 App Router setup
- ✅ TypeScript strict mode configuration
- ✅ Tailwind CSS v4 with OKLCH colors
- ✅ 56 shadcn/ui components installed
- ✅ Form validation setup (React Hook Form + Zod)
- ✅ Route structure (auth, dashboard)

### Pending Implementation
- ⏳ Authentication logic (routes exist but pages are placeholders)
- ⏳ Dashboard functionality
- ⏳ Payment integration
- ⏳ Database integration
- ⏳ API routes

## Testing

No test files currently exist. When adding tests:

```bash
# Install test dependencies (not yet configured)
bun add -D @testing-library/react @testing-library/jest-dom vitest

# Test patterns to follow
# - Unit tests for utilities (lib/)
# - Component tests for UI components
# - Integration tests for forms
# - E2E tests for critical flows
```

## Environment Variables

No `.env` file detected. When adding environment variables:

```bash
# .env.local (create this file)
NEXT_PUBLIC_API_URL=
DATABASE_URL=
```

## Common Tasks

### Adding a New Page

```typescript
// app/new-page/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Page",
}

export default function NewPage() {
  return <div>Content</div>
}
```

### Adding a New Form

```typescript
"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  name: z.string().min(2),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Adding a New shadcn/ui Component

```bash
# Install the component
npx shadcn@latest add badge

# Import and use
import { Badge } from "@/components/ui/badge"
<Badge variant="default">New</Badge>
```

## References

- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui Docs**: https://ui.shadcn.com
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Project Guidelines**: See `GLOBAL_RULES.md` for comprehensive design and development rules
