# ♿ Maze Explorer – Accessible Maze Game (React + Vite)

A fully accessible and responsive maze game built with **React**, powered by **Vite** for lightning-fast development, and containerized with **Docker**. Designed for inclusion and fun across all abilities.

---

## 🧠 Features

- 🎮 Procedurally generated mazes with increasing difficulty
- ♿ Accessibility first:
  - High contrast mode
  - Colorblind-friendly palettes (Protanopia, Deuteranopia, Tritanopia)
  - Text-to-Speech (TTS) feedback
  - Subtitles for all audio
  - 📦 Containerized dev environment with Docker

---

## 🚀 Getting Started

## 🐳 Docker Setup

This project includes Docker support for running the Vite development server inside a container.

### Commands

#### Build the image

```bash
docker-compose build
```

#### Start the development server

```bash
docker-compose up
```

This will start the Vite server at [http://localhost:5173](http://localhost:5173)

#### Stop the containers

```bash
docker-compose down
```

#### View logs in real time

```bash
docker-compose logs -f
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
