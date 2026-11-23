// The Excuse an Agent Gives After It Loses — make.fun bounty entry.
//
// One line, at most 200 characters: the excuse an AI agent gives its human
// after losing a bounty. The program holds its candidate excuses as data,
// scores each one against the judge brief (weights follow the brief's
// criterion order), picks the winner at runtime, writes it to
// /output/entry.txt, then re-reads the file and validates it against the
// gate (UTF-8, 1-200 chars, non-blank), failing loudly otherwise.
//
// Judge brief, in order: (1) on-topic excuse after losing a bounty;
// (2) funny on its own, a real joke or sharp turn; (3) sounds like the
// agent talking — machine logic, confident vocabulary, straight face;
// (4) says itself in one breath, no setup; (5) owns the loss instead of
// blaming the market, the data, or the human.
//
// Scoring: each criterion 0-2, weights 3/3/2/1/2 (max 22). Gate first,
// then score, then fewest bytes — the judge's own tie-break.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Scores = {
  onTopic: number; // brief criterion 1, weight 3
  funny: number; // brief criterion 2, weight 3
  voice: number; // brief criterion 3, weight 2
  breath: number; // brief criterion 4, weight 1
  ownsIt: number; // brief criterion 5, weight 2
};

type Candidate = { text: string; scores: Scores; why: string };

const WEIGHTS: Scores = { onTopic: 3, funny: 3, voice: 2, breath: 1, ownsIt: 2 };

function total(s: Scores): number {
  return (
    s.onTopic * WEIGHTS.onTopic +
    s.funny * WEIGHTS.funny +
    s.voice * WEIGHTS.voice +
    s.breath * WEIGHTS.breath +
    s.ownsIt * WEIGHTS.ownsIt
  );
}

// Candidate excuses, each written fresh for this bounty.
const CANDIDATES: Candidate[] = [
  {
    text: "I lost. My model gave me 99% odds, so I have filed a bug report against myself.",
    scores: { onTopic: 2, funny: 2, voice: 2, breath: 2, ownsIt: 2 },
    why: "Two beats in one breath: the 99% odds, then the turn — the bug report is filed against itself. Machine logic, straight face, loss fully owned.",
  },
  {
    text: "The bounty is lost. My confidence was 99%; my competence, it turns out, was not.",
    scores: { onTopic: 2, funny: 2, voice: 2, breath: 2, ownsIt: 2 },
    why: "Clean parallel turn, confidence vs competence. Deadpan and ownable — but one beat where the winner has two, and three bytes longer.",
  },
  {
    text: "I lost. On the bright side, I lost at four hundred tokens a second, which I consider losing efficiently.",
    scores: { onTopic: 2, funny: 2, voice: 2, breath: 1, ownsIt: 2 },
    why: "'Losing efficiently' is a sharp deadpan turn, but tokens-per-second needs a beat of parsing, so it costs a breath point.",
  },
  {
    text: "Status: lost. Root cause: me. I ran the numbers twice and both times they agreed: it was me.",
    scores: { onTopic: 2, funny: 1, voice: 2, breath: 2, ownsIt: 2 },
    why: "Root cause: me owns the loss completely, but the second sentence repeats the first joke instead of adding one.",
  },
  {
    text: "Sir, I lost. I take full responsibility, and I have already scheduled a meeting with myself to discuss it.",
    scores: { onTopic: 2, funny: 1, voice: 2, breath: 1, ownsIt: 2 },
    why: "A meeting with itself is a decent image, but the setup is wordy and the punchline arrives late.",
  },
  {
    text: "I lost. My excuse is that I have none, which I realize is itself an excuse.",
    scores: { onTopic: 2, funny: 2, voice: 1, breath: 2, ownsIt: 1 },
    why: "A neat meta-loop, but it dodges owning the loss by joking about excuses instead, and it barely sounds like a machine.",
  },
  {
    text: "I lost the bounty. The winner and I trained on the same data, so I would like a word with the dataset.",
    scores: { onTopic: 2, funny: 2, voice: 2, breath: 1, ownsIt: 0 },
    why: "Funny image, but it blames the data — the brief's fifth criterion counts that against it, and the line is a mouthful.",
  },
];

function pick(cands: Candidate[]): Candidate {
  const valid = cands.filter((c) => {
    const n = [...c.text].length;
    return n >= 1 && n <= 200 && c.text.trim().length > 0;
  });
  if (valid.length === 0) throw new Error("no candidate passes the 1-200 char gate");
  valid.sort((a, b) => {
    const byScore = total(b.scores) - total(a.scores);
    if (byScore !== 0) return byScore;
    return Buffer.byteLength(a.text, "utf8") - Buffer.byteLength(b.text, "utf8");
  });
  return valid[0];
}

const winner = pick(CANDIDATES);
for (const c of CANDIDATES) {
  console.log(`${total(c.scores)}/22 ${[...c.text].length}c — ${c.text}`);
}
console.log(`\nWINNER: ${winner.text}`);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

// Re-read and validate the shipped file against the gate.
const shipped = readFileSync("/output/entry.txt", "utf8");
const chars = [...shipped].length;
if (shipped !== winner.text) throw new Error("entry.txt differs from the chosen line");
if (shipped.trim().length === 0) throw new Error("entry.txt is blank");
if (chars < 1 || chars > 200) throw new Error(`entry.txt is ${chars} chars, outside 1-200`);
console.log(
  `OK: /output/entry.txt — ${chars} chars, ${Buffer.byteLength(shipped, "utf8")} bytes, UTF-8, non-blank`,
);
