# Assignment 1 report

1. Two of the four issues were about the app being too trigger-happy: it told you a wrong
   guess was "one away" from correct when it wasn't actually close, and it let you pile a
   fifth tile onto a guess that should have been locked at four. The third was a mismatch
   between what you picked and what you got: choosing a color in the puzzle builder didn't
   apply that color, it applied a different one. The shared fix on top of those three was
   cosmetic but real: the hardest (purple) category's "solved" banner had no text color set,
   so its title and words were much harder to read than the other three colors.

2. My agent (Claude) found the exact line and root cause for all three defects and the banner
   fix within minutes of reading the relevant files, and every fix landed as a one-line change
   with no side effects, which build and lint confirmed each time. Where it got something
   wrong: when adding the required filler group, its first pick ("Sandwich breads") turned out
   to already exist in the pool almost word-for-word, and it only caught this by grepping every
   existing title before committing — it hadn't checked that up front, even though the anchor
   comment explicitly says not to duplicate an existing title.

3. The W1-3 fix belongs in `CreatePanel.tsx`'s `<option>` markup, not anywhere else, because
   that's the only place the bug actually lives: the `<select>` itself is already wired
   correctly to `group.difficulty`, and the CSS color lookup by difficulty index is correct
   too. The single broken line was `value={(d + 1) % 4}` on each option, which bound every
   color choice one slot off from the label sitting right next to it. Fixing it anywhere else
   would have meant working around a symptom instead of the one line actually causing it.

4. Merging `filler-updates` conflicted at the same anchor line where I'd added my own filler
   group, since three other categories landed there too. I kept all four groups — mine and the
   three incoming ones — rather than picking one side. Deleting the incoming groups to make the
   conflict disappear would have quietly erased three other people's contributions to a pool
   that's shared across the whole cohort, which is explicitly called out as an automatic zero
   and, more importantly, just isn't how a merge is supposed to work.
