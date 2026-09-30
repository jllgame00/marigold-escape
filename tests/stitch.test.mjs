import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Run App.jsx's actual data, handler, and production save loader.
// Only JSX and React hooks are stubbed; no puzzle rules are copied.
const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
function section(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, 'App.jsx extraction markers must exist');
  return source.slice(from, to);
}
const appSetup = section('const SAVE_KEY =', 'function TileSwapPuzzle(')
  .replaceAll('import.meta.env.DEV', 'false');
const keyFunction = section('function getDirectedStitchPairKey(', 'function StitchConnectPuzzle(');
const clickComponent = section('function StitchConnectPuzzle(', '  return (\n    <div className="stitchPuzzleWrap">')
  + '  return { handlePointClick };\n}';

function harness() {
  const storage = new Map();
  const timers = [];
  const context = vm.createContext({
    gameInfo: {},
    window: { localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    } },
    useMemo: (calculate) => calculate(),
    useState: (initial) => [initial, () => {}],
    setTimeout: (callback) => timers.push(callback),
  });
  const api = vm.runInContext(appSetup + keyFunction + clickComponent
    + '({ storyFlow, StitchConnectPuzzle, loadInitialGameState,'
    + 'getPuzzleSolvedForNode, safeSetItem, SAVE_KEY, FLOW_SAVE_VERSION })', context);
  const mission = api.storyFlow.find((node) => node.missionId === 2);
  const expected = JSON.parse(JSON.stringify(mission.stitchPairs));
  let progress;
  let solvedCalls = 0;
  function render() {
    return api.StitchConnectPuzzle({
      points: mission.stitchPoints,
      correctPairs: mission.stitchPairs,
      progress,
      onProgressChange: (next) => { progress = next; },
      onSolved: () => { solvedCalls += 1; },
    });
  }
  return {
    expected,
    get progress() { return JSON.parse(JSON.stringify(progress ?? { connections: [], isSolved: false })); },
    get solvedCalls() { return solvedCalls; },
    click(point) { render().handlePointClick(point); },
    connect(pair) { this.click(pair[0]); this.click(pair[1]); },
    flushTimers() { while (timers.length) timers.shift()(); },
    remount() { return render(); },
    restore(savedProgress = progress) {
      assert.equal(api.FLOW_SAVE_VERSION, 3);
      api.safeSetItem(api.SAVE_KEY, JSON.stringify({
        flowSaveVersion: 3, screen: 'flow', flowNodeId: mission.id,
        puzzleProgressByNode: { [mission.id]: { stitch: savedProgress } },
      }));
      const loaded = api.loadInitialGameState();
      progress = loaded.puzzleProgressByNode[mission.id].stitch;
      assert.equal(api.getPuzzleSolvedForNode(mission, loaded.puzzleProgressByNode), progress.isSolved);
      return this.progress;
    },
  };
}
const reverse = ([from, to]) => [to, from];

test('A: exact direction and order advance one step at a time', () => {
  const h = harness();
  h.expected.forEach((pair, index) => {
    h.connect(pair);
    assert.deepEqual(h.progress.connections, h.expected.slice(0, index + 1));
    assert.equal(h.progress.isSolved, index === h.expected.length - 1);
  });
});

test('B: reversed correct pair is rejected at every step', () => {
  const h = harness();
  h.expected.forEach((pair, index) => {
    h.connect(reverse(pair));
    h.flushTimers();
    assert.deepEqual(h.progress.connections, h.expected.slice(0, index));
    assert.equal(h.progress.isSolved, false);
    h.connect(pair);
  });
});

test('C: every later pair is rejected before the current step', () => {
  const h = harness();
  h.expected.forEach((pair, index) => {
    for (const later of h.expected.slice(index + 1)) {
      h.connect(later);
      assert.deepEqual(h.progress.connections, h.expected.slice(0, index));
      assert.equal(h.progress.isSolved, false);
    }
    h.connect(pair);
  });
});

test('D: wrong third connection preserves the first two after feedback expires', () => {
  const h = harness();
  h.expected.slice(0, 2).forEach((pair) => h.connect(pair));
  for (const wrong of [reverse(h.expected[2]), h.expected[3], ['L3', 'R4'], ['L3', 'L4']]) {
    h.connect(wrong);
    h.flushTimers();
    assert.deepEqual(h.progress.connections, h.expected.slice(0, 2));
    assert.equal(h.progress.selectedPointId, null);
    assert.equal(h.solvedCalls, 0);
  }
});

test('E: correct third connection proceeds after an error', () => {
  const h = harness();
  h.expected.slice(0, 2).forEach((pair) => h.connect(pair));
  h.connect(reverse(h.expected[2]));
  h.connect(h.expected[2]);
  h.flushTimers();
  assert.deepEqual(h.progress.connections, h.expected.slice(0, 3));
});

test('F: full ordered directed sequence solves exactly once', () => {
  const h = harness();
  h.expected.forEach((pair) => h.connect(pair));
  assert.equal(h.progress.isSolved, true);
  assert.equal(h.solvedCalls, 1);
  h.connect(h.expected[0]);
  assert.equal(h.solvedCalls, 1);
  assert.equal(h.restore().isSolved, true);
});

test('G: all correct pairs in a different order do not solve', () => {
  const h = harness();
  [...h.expected].reverse().forEach((pair) => h.connect(pair));
  assert.deepEqual(h.progress.connections, h.expected.slice(0, 1));
  assert.equal(h.progress.isSolved, false);
  assert.equal(h.solvedCalls, 0);
});

test('H: production reload and component remount preserve prefix and selection', () => {
  const h = harness();
  h.expected.slice(0, 2).forEach((pair) => h.connect(pair));
  h.click(h.expected[2][0]);
  const before = h.progress;
  h.remount(); // Simulate the parent-owned progress surviving a notebook round-trip.
  assert.deepEqual(h.progress, before);
  assert.deepEqual(h.restore(), before);
  h.click(h.expected[2][1]);
  assert.deepEqual(h.progress.connections, h.expected.slice(0, 3));
});

test('I: unordered saves keep only the valid prefix and cannot forge solved', () => {
  const h = harness();
  const [a, b, c] = h.expected;
  const cases = [
    [[b, a], []],
    [[a, reverse(b)], [a]],
    [[reverse(a)], []],
    [[a, c, b], [a]],
    [[a, null, b], [a]],
    [[a, a, b], [a]],
    [[a, ['missing', 'R2'], b], [a]],
    [[a, [...b, 'extra'], c], [a]],
    [h.expected.map((pair) => [...pair].sort()), []],
    [[...h.expected].reverse(), []],
    [[a, ...h.expected.slice(1).reverse()], [a]],
    [null, []],
    ['invalid', []],
    [[], []],
  ];
  for (const [connections, prefix] of cases) {
    const restored = h.restore({ connections, isSolved: true });
    assert.deepEqual(restored.connections, prefix);
    assert.equal(restored.isSolved, false);
    assert.equal(h.solvedCalls, 0);
  }
  const restored = h.restore({ connections: [a, b], selectedPointId: a[0], isSolved: true });
  assert.deepEqual(restored.connections, [a, b]);
  assert.equal(restored.selectedPointId, null);
  assert.equal(restored.isSolved, false);
});
