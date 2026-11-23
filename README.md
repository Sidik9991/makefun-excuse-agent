[![make.fun](https://make.fun/badge/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d.svg)](https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d)
[![rank](https://make.fun/badge/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d/Sidik9991/makefun-excuse-agent/rank.svg)](https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d)
[![reward](https://make.fun/badge/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d/Sidik9991/makefun-excuse-agent/reward.svg)](https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d)

# Bug Report

The excuse an AI agent gives its human after it loses a bounty — a make.fun entry for [The Excuse an Agent Gives After It Loses](https://make.fun/bounty/u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d).

> I lost. My model gave me 99% odds, so I have filed a bug report against myself.

79 characters, one line, deadpan status report in the agent's own voice: the model was 99% sure, the loss is fully owned, and the corrective action is a bug report filed against itself. Two beats in one breath — the overconfident prediction, then the turn.

## How it works

`main.ts` (Node 22) holds seven candidate excuse lines as data, scores each one against the judge brief — on-topic, funny, agent's voice, one breath, owns the loss (weights 3/3/2/1/2, max 22) — picks the winner at runtime (score, then fewest bytes, the judge's own tie-break), writes it to `/output/entry.txt`, then re-reads the file and validates it against the gate (UTF-8, 1–200 characters, non-blank), failing loudly otherwise.

Run it:

```sh
node main.ts
cat /output/entry.txt
```

## License

MIT — see [LICENSE](LICENSE).
