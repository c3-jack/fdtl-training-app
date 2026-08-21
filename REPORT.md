## REPORT FDTL Week 1 Training c3-ddarden 
Dick Darden

## Defects and Banner color fix
W1-0 — Added a filler group, and give the purple group's solved banner a colour #1
W1-1 — Fixed the "One away" so it only fires when when you are 1 tile away. #2
W1-2 — Blocked selecting a fifth tile. #3
W1-3 — Fixed a group's Color dropdown so it reflects the color that is actually applied. 

## Where agent helped and one specific thing it got wrong. 
Claude helped a lot with git commands, finding and fixing the errors, and in answering my questions. The use of the Claude in Chrome connector I set up also made testing verfication a lot easier. I am still rusty and not proficient on coding but with Claude Code I can hold my own. Just a little slow, but I will get faster.  
One specific thing it got wrong was on my initial run and my corrected run it just added the new filler group to the bottom of the filler list and not below the indexed comment line as corrected. It corrected its mistake when I pointed it out. 

## Fix W1-1 — "One away" fires on guesses that are nowhere close 
The fix belongs in the src/lib/puzzle.ts file because that is where the checkGuess() function is located. And this is a simple bug where the constant to check if you are one away from 4 correct values was listed as 2 vice the 3 it should have been.  Changing the 2 to 3 fixes the problem. 

## What I decided during the conflict and what would have been lost the other way
I had added the one additional filler group. There were 3 additional filler groups in the filler-updates branch. I kept all the new filler groups from both branches. Any other resolution would have lost my filler group or the groups from filler-updates or both. 

