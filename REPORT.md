Johnny Fu
Week 1 Agentic Coding Training

Question 1: What were the three defects, in one sentence each a non-engineer would follow?

    Defect 1: When playing a puzzle, a user should receive an alert when they submit a guess that has exactly three correct selections. The issue was that the alert fired when there were two correct selections

    Defect 2: When playing a puzzle, a user should be limited to selecting up to four tiles at a time. The issue was that a user could select five tiles, exceeding the intended limit of 4.

    Defect 3: When creating a new puzzle, each difficulty category has a dropdown selector that should match the actual color shown for the category. Instead, it was showing the color of the next category.

Question 2: Where did your agent help, and where did it get in the way? Name one specific thing it got wrong

    The agent helped by helping me identify where in the codebase the issue may reside. This allowed me to review that section first and be confident that the agent's proposed fix will correct it.  

    When resolving the merge conflict, the agent suggested that the overlapping entries on the filler_branch be inserted after my changes. Since I made my insertions at the end of the group, it would have been better for the agent to keep following that pattern instead.

Question 3: Pick one of your three fixes: why is it in the file you put it in, rather than somewhere else in the data flow?

    The fix for the text color of the purple hardest group is inserted to follow the CSS mappings of the other difficulty groups in SolvedGroupBanner.tsx.  A different (and less modular) change could have been made in index.css instead that relied on hard-coding the text color across multiple parts of the application.

Question 4: What did you decide during the conflict resolution, and what would have been lost if you had decided the other way?

    I decided to resolve the conflict by moving my changes to the end of the group. If I had left my changes in the middle, we would have lost the chronological order of insertions as I was adding changes later than the changes already existing on the branch.



