// Orders are never actually fulfilled (no warehouse, no carrier) — status is
// derived from elapsed time since creation so the tracking experience still
// feels alive instead of being permanently stuck on "received".
const STEPS = [
  { key: "received", afterMs: 0 },
  { key: "preparing", afterMs: 30 * 1000 },
  { key: "shipped", afterMs: 2 * 60 * 1000 },
  { key: "delivered", afterMs: 5 * 60 * 1000 },
];

export function computeStatus(createdAt) {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  let current = STEPS[0].key;
  for (const step of STEPS) {
    if (elapsed >= step.afterMs) current = step.key;
  }
  return {
    status: current,
    steps: STEPS.map((s) => s.key),
    stepIndex: STEPS.findIndex((s) => s.key === current),
  };
}
