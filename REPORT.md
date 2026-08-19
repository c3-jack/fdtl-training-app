# Assignment 1 report

1. Two of the four bugs made the app too trigger-happy: it called a wrong guess "one away"
   when it wasn't close, and it let you add a fifth tile to a guess that should have been
   capped at four. The third was a plain mismatch — pick a color in the puzzle builder, get
   a different one. On top of those three: the purple category's "solved" banner had no
   text color set, so it was harder to read than the other three.

2. Claude found the exact line and cause for all three bugs and the banner fix fast, and
   every fix was one line, confirmed by build and lint each time. What it got wrong: its
   first pick for the required filler group ("Sandwich breads") already existed in the pool
   almost word-for-word. It only caught that by grepping every title first — something the
   anchor comment already told it to check.

3. The W1-3 fix belongs in `CreatePanel.tsx`'s `<option>` markup, full stop. The `<select>`
   was already wired correctly to `group.difficulty`, and the color lookup by difficulty
   index was correct too. The one broken line was `value={(d + 1) % 4}` on each option,
   shifting every color choice one slot off from its own label. Fixing it anywhere else
   would've been patching a symptom, not the cause.

4. Merging `filler-updates` conflicted where I'd added my own filler group, since three
   other categories landed at the same spot. I kept all four — mine and the three incoming
   ones. Deleting the incoming groups to dodge the conflict would've erased three other
   people's work for no reason, and it's called out as an automatic zero besides.
