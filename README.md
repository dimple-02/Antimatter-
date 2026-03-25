# Antimatter

Interactive antimatter-inspired 3D experience built with React, TypeScript, and React Three Fiber.

## Highlights

- Real-time 3D scene rendering with Three.js via React Three Fiber
- Reusable scene and UI containers for clean composition
- Visual effects pipeline using postprocessing tools
- Strict TypeScript setup for safer refactoring and fewer runtime issues

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing
- gsap

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Build

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check with `tsc -b` and build with Vite |
| `npm run preview` | Preview the production build locally |

## Project Structure

```text
.
├─ src/
│  ├─ App.tsx
│  ├─ StoreContext.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ components/
│     ├─ CanvasContainer.tsx
│     ├─ Experience.tsx
│     ├─ SceneEffects.tsx
│     ├─ UIContainer.tsx
│     └─ models/
│        ├─ CoreAtom.tsx
│        └─ Particles.tsx
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

## Notes

- Build pipeline runs `tsc -b` before `vite build`.
- TypeScript strict checks are enabled.
