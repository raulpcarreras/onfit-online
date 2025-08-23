# Graphics Fixes Report (v2)

_Generated_: 2025-08-23T10:23:18.026567Z


## Summary
- CSS-like files scanned: **4**
- React files scanned: **392**
- Files neutralized to restore shadcn defaults: **1**
- Files with inline `style={...}` (report only): **24**
- Files with Tailwind arbitrary classes `[...]` (report only): **25**

## Inline styles to migrate (recommendation)
- `apps/native/app/(protected)/admin.tsx` — occurrences: 1 (first lines: [5])
- `apps/native/app/(protected)/client.tsx` — occurrences: 1 (first lines: [5])
- `apps/native/app/(protected)/trainer.tsx` — occurrences: 1 (first lines: [5])
- `apps/native/features/auth/LoginScreen.tsx` — occurrences: 1 (first lines: [93])
- `apps/native/src/lib/auth-guard.tsx` — occurrences: 1 (first lines: [35])
- `apps/web/app/test-theme/page.tsx` — occurrences: 1 (first lines: [81])
- `apps/web/src/components/dashboard/layout/Topbar.tsx` — occurrences: 2 (first lines: [107, 109])
- `packages/bottom-sheet/router/view.tsx` — occurrences: 1 (first lines: [189])
- `packages/bottom-sheet/src/provider.tsx` — occurrences: 1 (first lines: [128])
- `packages/design-system/components/Avatar/index.native.tsx` — occurrences: 1 (first lines: [6])
- `packages/design-system/components/Checkbox/index.native.tsx` — occurrences: 1 (first lines: [6])
- `packages/design-system/components/Loader/index.web.tsx` — occurrences: 1 (first lines: [43])
- `packages/design-system/components/Progress/index.native.tsx` — occurrences: 1 (first lines: [52])
- `packages/design-system/components/Progress/index.web.tsx` — occurrences: 1 (first lines: [54])
- `packages/design-system/components/example/Drawer/charts.tsx` — occurrences: 0 (first lines: [])
- `packages/design-system/components/example/Drawer/index.web.tsx` — occurrences: 0 (first lines: [])
- `packages/design-system/layout/index.tsx` — occurrences: 1 (first lines: [46])
- `packages/design-system/providers/index.tsx` — occurrences: 1 (first lines: [52])
- `packages/design-system/ui/chart.tsx` — occurrences: 1 (first lines: [285])
- `packages/design-system/ui/marquee.tsx` — occurrences: 1 (first lines: [18])
- `packages/design-system/ui/progress.tsx` — occurrences: 1 (first lines: [42])
- `packages/design-system/ui/select.tsx` — occurrences: 1 (first lines: [151])
- `packages/design-system/ui/sidebar.tsx` — occurrences: 2 (first lines: [190, 644])
- `packages/design-system/ui/calender/index.tsx` — occurrences: 2 (first lines: [203, 238])

## Tailwind arbitrary class usage (recommendation)
- `apps/web/app/(auth)/login/LoginForm.tsx`
- `apps/web/app/(protected)/admin/layout-client.tsx`
- `apps/web/app/(protected)/admin/users/page.tsx`
- `apps/web/app/(protected)/admin/users/edit/page.tsx`
- `apps/web/app/(protected)/user/layout.tsx`
- `apps/web/src/components/RevenueChart.tsx`
- `apps/web/src/components/dashboard/UserSidebar.tsx`
- `apps/web/src/components/dashboard/layout/Sidebar.tsx`
- `apps/web/src/components/dashboard/layout/Topbar.tsx`
- `packages/design-system/components/example/Command.tsx`
- `packages/design-system/components/example/ContextMenu.tsx`
- `packages/design-system/components/example/Form.tsx`
- `packages/design-system/components/example/NavigationMenu.tsx`
- `packages/design-system/components/example/SidebarDialog.tsx`
- `packages/design-system/components/example/Tabs.tsx`
- `packages/design-system/components/example/index.tsx`
- `packages/design-system/components/example/Drawer/charts.tsx`
- `packages/design-system/components/example/Drawer/index.web.tsx`
- `packages/design-system/ui/chart.tsx`
- `packages/design-system/ui/drawer.tsx`
- `packages/design-system/ui/navigation-menu.tsx`
- `packages/design-system/ui/radio-group.tsx`
- `packages/design-system/ui/scroll-area.tsx`
- `packages/design-system/ui/sidebar.tsx`
- `packages/design-system/ui/slider.tsx`
