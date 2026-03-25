# Antimatter

<p align="center">
	Interactive antimatter-inspired 3D web experience built with React, TypeScript, and Three.js.
</p>

<p align="center">
	<img alt="Vite" src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
	<img alt="React" src="https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
	<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
	<img alt="Three.js" src="https://img.shields.io/badge/Three.js-0.168-black?style=for-the-badge&logo=three.js&logoColor=white" />
</p>

## Overview

Antimatter is a modern React scene project that combines expressive UI with real-time 3D rendering. It is structured to keep visuals, scene logic, and interface components modular and easy to evolve.

## Features

- Real-time 3D rendering through React Three Fiber and Three.js
- Scene composition split into focused components
- Reusable model primitives for effects-driven visuals
- Postprocessing-ready architecture
- Strict TypeScript configuration for safer development

## Stack

- React 18
- TypeScript 5
- Vite 5
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing
- postprocessing
- gsap
- lucide-react

## Local Development

### Requirements

- Node.js 18+
- npm 9+

### Setup

```bash
npm install
```

### Start Dev Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Scripts

| Script | What it does |
| --- | --- |
| npm run dev | Runs the Vite development server |
| npm run build | Runs TypeScript project build and then Vite build |
| npm run preview | Serves the production build locally |

## Project Layout

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

## Architecture Notes

- Rendering and scene orchestration live under the components directory.
- Build pipeline runs TypeScript project build before Vite bundling.
- Strict compiler checks are enabled to reduce regressions during refactors.

## Next Improvements

- Add screenshots or a short demo GIF
- Add deployment instructions for Vercel or Netlify
- Add contribution and code style guidelines
