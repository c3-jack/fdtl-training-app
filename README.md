# FDTL Cohort Board

A small React application used as the shared working repository for Week 1 of FDTL 100,
Agentic Coding for Forward Deployed Engineers. It renders a roster of cohort members with
their office and their current status, and it supports search and filtering over that roster.

The application is deliberately imperfect. Some of what it does is wrong, and some of what it
should do is missing. Your assignment tells you which part is yours.

## Running it

```
npm install
npm run dev
```

The development server serves the application at `http://localhost:5173` and opens a browser
window. Two other commands matter, and both must pass before you open a pull request:

```
npm run build
npm run lint
```

`npm run build` type-checks the project with `tsc` and then produces a production bundle.
A change that breaks either command is not finished.

## Layout

```
src/App.tsx                      application shell, roster state, search and filter logic
src/types.ts                     the Member type and the three member statuses
src/data/members.ts              the roster itself
src/components/MemberList.tsx    the list and its section heading
src/components/MemberCard.tsx    one row: name, office, status chip
src/components/StatusChip.tsx    the coloured chip for a member status
src/components/StatusFilter.tsx  the status dropdown
src/components/SearchBar.tsx     the search input
```

There is no backend, no router, and no test suite. The roster is a TypeScript array, and the
browser is where you observe behaviour.

## Working in this repository

Read `CONTRIBUTING.md` before your first commit. It covers branch naming, what a commit is
expected to contain, and what a pull request into this repository has to show.
