# FDTL Cohort — Connections Maker

A small React application used as the shared working repository for Week 1 of FDTL 100,
Agentic Coding for Forward Deployed Engineers. It's a real, working build-your-own-Connections
game: pick 16 words, split them into 4 groups of 4, and share the finished puzzle as a link.
There is no backend and no database — a puzzle lives entirely in its share URL.

The application is deliberately imperfect. Some of what it does is wrong. Your assignment tells
you which part is yours.

## Running it

```
npm install
npm run dev
```

The development server serves the application at `http://localhost:5173`. Two other commands
matter, and both must pass before you open a pull request:

```
npm run build
npm run lint
```

`npm run build` type-checks the project with `tsc` and then produces a production bundle.
A change that breaks either command is not finished.

**Node version.** This project needs Node 20.19+ or 22.12+. On an older Node, `npm install`
prints an `EBADENGINE` warning that's easy to scroll past, and the real failure shows up later
as a cryptic `MODULE_NOT_FOUND` deep inside `rolldown` when you run `npm run build` or
`npm run dev`. If you hit that, the fix is `node --version`, then upgrade — the stack trace
will not tell you this.

## Layout

```
src/App.tsx                          top-level routing: home, create, play
src/hooks/usePuzzleState.ts          play-mode state machine: selection, guesses, mistakes
src/lib/puzzle.ts                    guess checking, validation, shuffling
src/lib/share.ts                     puzzle <-> URL encoding
src/lib/drafts.ts                    localStorage draft persistence for Create
src/lib/analytics.ts                 optional, no-ops if blocked -- ignore it
src/components/CreatePanel.tsx       the puzzle builder UI
src/components/PlayPanel.tsx         the play UI: tiles, mistakes, shortcuts
src/components/ResultsScreen.tsx     win/lose screen and emoji recap
src/components/SolvedGroupBanner.tsx the colored banner for a solved group
src/components/Tile.tsx              one word tile
src/components/ThemePicker.tsx       the four color themes
src/data/examples.ts                 the three built-in "Play an example" puzzles
src/data/filler-groups.ts            393 ready-made categories behind the dice button
```

There is no router and no state library; navigation is `history.pushState`. The stack is React,
TypeScript, Vite, and Tailwind.

## Working in this repository

Read `CONTRIBUTING.md` before your first commit. It covers branch naming, what a commit is
expected to contain, and what a pull request into this repository has to show.
