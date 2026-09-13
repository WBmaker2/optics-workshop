import { describe, expect, it } from 'vitest';
import { initialSession, sessionReducer, blankPrediction } from '../src/state/opticsSession';
const input = { lensType: 'converging' as const, focalLengthM: .1, objectDistanceM: .3, objectHeightM: .02, screenDistanceM: .15, objectAtInfinity: false };
const attempt = (id: string) => ({ id, task: 1, input, prediction: { location: '렌즈 뒤', type: '실상', orientation: '도립', size: '축소', rationale: '근거' }, result: { kind: 'focal-boundary' as const, reason: 'object-at-focal-plane' as const }, explanation: '' });
describe('session reducer', () => {
  it('initializes', () => expect(initialSession(input).taskId).toBe(1));
  it('updates input and clears prediction', () => { const s = initialSession(input); const n = sessionReducer(s, { type: 'input', input: { ...input, objectDistanceM: .2 } }); expect(n.prediction).toEqual(blankPrediction()); });
  it('selects task', () => expect(sessionReducer(initialSession(input), { type: 'select', taskId: 2, input }).taskId).toBe(2));
  it('records comparison progress', () => expect(sessionReducer(initialSession(input), { type: 'run', attempt: attempt('a') }).progress[1].compared).toBe(true));
  it('marks applied after second attempt', () => { let s = initialSession(input); s = sessionReducer(s, { type: 'run', attempt: attempt('a') }); s = sessionReducer(s, { type: 'run', attempt: attempt('b') }); expect(s.progress[1].applied).toBe(true); });
  it('edits explanation by id', () => { let s = sessionReducer(initialSession(input), { type: 'run', attempt: attempt('a') }); s = sessionReducer(s, { type: 'explanation', id: 'a', value: '수정' }); expect(s.attempts[0].explanation).toBe('수정'); expect(s.progress[1].explained).toBe(true); });
  it('reset clears transient fields', () => { let s = initialSession(input); s = sessionReducer(s, { type: 'reset', input }); expect(s.explanation).toBe(''); expect(s.attempts).toHaveLength(0); });
});
