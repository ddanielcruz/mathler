# Mathler

A daily mathematical puzzle game inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html). Each day, players attempt to find a hidden mathematical equation that equals a given number.

## Features

- Daily mathematical puzzles that reset at midnight
- Keyboard and on-screen input support
- Visual feedback with color-coded tiles:
  - 🟩 Green: Correct digit/operator in correct position
  - 🟨 Yellow: Correct digit/operator in wrong position
  - ⬜ Gray: Digit/operator not in equation
- Progress saved locally
- Mobile-friendly responsive design

## Development

### Prerequisites

- Node.js >=20.18.0
- pnpm >=9.0.0

### Getting Started

#### 1. Clone the repository

```bash
git clone https://github.com/ddanielcruz/mathler.git
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Start the development server

```bash
pnpm dev
```

## Acknowledgments

Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html) and [Mathler](https://www.math24.net/math-24-game/).
