# Contributing

Fifty people are working in this repository during the same week. The conventions below exist so
that fifty pull requests can be read without any of them destroying another.

`main` is protected and nothing is merged during the week. Your pull request is reviewed and
graded while it is open, so do not wait for a merge and do not change your work because somebody
else's pull request touches the same lines.

## Branches

Work on a branch named for your GitHub handle:

```
week1/<your-github-handle>
```

Do not push to `main`, and do not create a second branch for the same work. One person, one
branch, one pull request.

## Commits

A commit is a unit of work that someone else can read. Commit when a change is complete, not
when you stop typing.

- The subject line says what changed and stays under seventy-two characters.
- The body says why, when the why is not obvious from the diff.
- Formatting churn does not belong in a commit that also changes behaviour.
- Do not commit `node_modules`, `dist`, or editor files. `.gitignore` already excludes them.

Write your own commit messages. A history of twelve commits that all say `update` or `fix` is
worth less than four commits that each say something true.

## Before you open a pull request

Both commands must pass, and you must have loaded the application and watched the corrected
behaviour yourself:

```
npm run build
npm run lint
```

Your assignment requires you to merge the `filler-updates` branch, which will conflict with your
filler group. Resolve the conflict by hand and keep both sides.

Depending on your git configuration the conflict will show either two sections or three. If you
see a third section marked `|||||||`, that is the common ancestor, and it is not one of the two
sides — delete it along with the markers. `npm run build` will tell you if you left any of it
behind.

## Pull requests

Open one pull request from your branch into `main`. The template in
`.github/pull_request_template.md` is not optional; fill in every section. A pull request
that says only what a reader can already see in the diff will be sent back.

State what you verified and how. "Built and linted, then played the puzzle and confirmed a
2-of-4 guess no longer shows 'One away!'" is a verification. "Tested" is not.

## The filler pool

`src/data/filler-groups.ts` is the one file everybody with `W1-0` edits, at the anchor comment
below the last yellow entry. Add your own group directly below it, on one line, matching the
surrounding format. Do not reorder, reformat, or sort the existing groups — a diff that touches
twelve lines to add one will be rejected.
