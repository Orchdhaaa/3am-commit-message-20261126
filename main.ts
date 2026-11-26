// The 3AM Commit Message — make.fun bounty u-kiencx-the-3am-commit-message-10bc7b35
// Writes one funny commit message line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// Gate (verified in the kit's competition.yaml + RULES.txt): UTF-8 text, 1-139
// characters, a single line, not only whitespace. Plain static code only: no
// network, no environment secrets, no eval/Function/vm/dynamic import/shell.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "fix: I fixed the bug I introduced at 2am while fixing the bug I introduced at 1am";

const MAX_CHARS = 139;

function fail(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

function validate(text: string): void {
  // Count Unicode code points, not UTF-16 code units, so the gate's
  // "1 to 139 characters" matches how the scorer counts the text.
  const charCount = [...text].length;
  if (charCount < 1 || charCount > MAX_CHARS) {
    fail(`length ${charCount} is outside 1-${MAX_CHARS} characters`);
  }
  if (text.trim().length === 0) {
    fail("entry is only whitespace");
  }
  if (text !== text.trim()) {
    fail("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line");
  }
  if (text.includes("\u2014")) {
    fail("entry contains an em dash");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      fail("entry contains a control character");
    }
  }
}

validate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
