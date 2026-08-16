---
name: Estate Sophisticate
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d1c2e'
  on-tertiary-container: '#77859a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#d5e3fc'
  tertiary-fixed-dim: '#b9c7df'
  on-tertiary-fixed: '#0d1c2e'
  on-tertiary-fixed-variant: '#3a485b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

The design system is anchored in a **Corporate Modern** aesthetic with **Minimalist** and **Editorial** influences. It targets high-net-worth individuals and aspirational buyers who value transparency, heritage, and precision. The visual narrative balances the authoritative weight of a traditional institution with the fluid, airy interface of a modern digital platform.

The emotional response should be one of "effortless luxury"—where the interface recedes to let high-fidelity architectural photography take center stage. Expect generous negative space, intentional alignment, and a focus on high-quality finish over decorative flair.

## Colors

The palette is built on a foundation of **Deep Navy** to establish immediate trust and professional "weight." **Warm Gold** is used sparingly as a "prestige accent"—reserved for call-to-action elements, verified badges, and premium tier indicators. 

- **Surface System:** Uses a layered approach with white (#FFFFFF) for the primary content canvas and Soft Grey (#F8FAFC) for secondary background sections to provide subtle visual separation without heavy borders.
- **Functional States:** Use semi-transparent overlays of the primary Navy for hover states to maintain depth without introducing new hues.

## Typography

The typographic hierarchy utilizes a high-contrast pairing to distinguish between narrative and utility. 

- **Serif (Playfair Display):** Reserved for property titles, section headers, and editorial quotes. It conveys the "premium" nature of the real estate.
- **Sans-Serif (Inter):** Used for all functional data, descriptions, and UI controls. Its neutral, systematic nature ensures high readability for complex data points like square footage, pricing, and amenities.
- **Usage Note:** Maintain tight tracking on display headings and generous line-height on body text to ensure an "airy" feel.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to maintain an editorial, magazine-like feel, and a **Fluid Grid** for mobile devices.

- **The 8px Rhythm:** All padding and margins must be multiples of 8px to ensure mathematical harmony.
- **Sectioning:** Large vertical gaps (120px+) should be used between major content blocks to prevent the UI from feeling "crowded."
- **Breakpoints:** 
  - Mobile: < 768px (4 columns)
  - Tablet: 768px - 1024px (8 columns)
  - Desktop: > 1024px (12 columns)

## Elevation & Depth

Hierarchy is achieved through **Ambient Shadows** and **Tonal Layering** rather than heavy lines. 

- **Shadows:** Use extremely soft, diffused shadows with a slight Navy tint (`rgba(15, 23, 42, 0.08)`) to lift cards off the background.
- **Surface Contrast:** Use a 1px border in #E2E8F0 (Soft Grey) for structural elements like input fields and card outlines, ensuring they remain visible but unobtrusive.
- **Z-Index Strategy:** Only the most critical action items (e.g., "Schedule a Tour" sticky buttons) should occupy the highest elevation layer with a more pronounced shadow.

## Shapes

The shape language is defined by **Softened Geometry**. While the layout is structured and rectangular, the corners are rounded to 8px-12px to soften the professional Navy and make the brand feel "accessible."

- **Images:** Must always carry a `rounded-lg` (16px) or `rounded-xl` (24px) corner radius to differentiate them from functional UI blocks.
- **Interactive Elements:** Buttons and form inputs follow the standard `rounded` (8px) radius.

## Components

- **Buttons:** Primary buttons use the Deep Navy background with white text. Secondary buttons use a ghost style with a 1px Navy or Gold border. Use high padding (16px 32px) to give actions importance.
- **Cards:** Property cards feature a full-bleed image at the top with a `rounded-xl` container. Metadata (price, beds, baths) should be displayed using the `label-bold` type style for quick scanning.
- **Input Fields:** Use a subtle #F8FAFC fill with a 1px #E2E8F0 border. On focus, the border transitions to Deep Navy.
- **Chips/Badges:** Use for property status (e.g., "Just Listed," "Sold"). Use a light tint of the Secondary color (#B45309 at 10% opacity) with dark Gold text for a sophisticated "tag" look.
- **Lists:** Use wide spacing between items with a light horizontal divider (#F1F5F9). Icons in lists should be thin-stroke (1px or 1.5px) to match the elegant typography.
- **Additional Component: Property Hero:** A full-width component that blends the high-contrast Serif typography over a darkened photographic background, featuring an integrated search or inquiry bar at the bottom.