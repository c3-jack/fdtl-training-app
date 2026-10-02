# Assignment 1 report

**1. Defects.** "One away!" fired when two tiles matched instead of three. A fifth tile could be selected, which disabled Submit. The Create colour dropdown was off by one, so picking Yellow gave a green strip. The purple banner had no text colour; it now uses the same variable as the other three.

**2. Agent.** It found each cause quickly and kept every fix to one line. It got the macOS `sed -i` syntax wrong while clearing conflict markers, leaving a stray `filler-groups.ts-e` that `git status` caught before commit. It also proposed two filler titles already in the pool.

**3. Fix location.** The dropdown fix sits on the `<option>` in `CreatePanel.tsx` because that is the only place label and stored value are paired. The strip and validation already read the stored value correctly; patching them would hide the bug, not fix it.

**4. Conflict.** Both branches appended at the same anchor, so git could not order them. I kept all four groups, mine first. Dropping the incoming three would have resolved the conflict by deleting other people's data.
