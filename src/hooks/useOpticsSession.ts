import { useReducer } from 'react';
import { calculateLens } from '../engine/thinLens';
import { taskDefaults, tasks } from '../scenarios/opticsTasks';
import { blankPrediction, blankProgress, SessionState, sessionReducer } from '../state/sessionReducer';
import type { LensInput } from '../domain/opticsTypes';
export function useOpticsSession() {
  const initial: SessionState = { taskId: 1, inputs: { 1: taskDefaults(1) }, predictions: { 1: blankPrediction() }, attempts: {}, progress: {}, error: '' };
  const [state, dispatch] = useReducer(sessionReducer, initial);
  const task = tasks.find((item) => item.id === state.taskId) ?? tasks[0];
  const input = state.inputs[state.taskId] ?? taskDefaults(state.taskId);
  const prediction = state.predictions[state.taskId] ?? blankPrediction();
  const taskAttempts = state.attempts[state.taskId] ?? []; const attempts = Object.values(state.attempts).flat(); const latest = taskAttempts[taskAttempts.length - 1]; const progress = state.progress[state.taskId] ?? blankProgress();
  const changeInput = (key: keyof LensInput, valueM: number | boolean) => { if (state.taskId === 3 && key === 'screenDistanceM') return; dispatch({ type: 'change-input', taskId: state.taskId, input: { ...input, [key]: valueM } as LensInput }); };
  const changeLensType = (value: LensInput['lensType']) => { const sign = value === 'converging' ? 1 : -1; dispatch({ type: 'change-input', taskId: state.taskId, input: { ...input, lensType: value, focalLengthM: sign * Math.abs(input.focalLengthM) } }); };
  const selectTask = (id: number) => dispatch({ type: 'select-task', taskId: id, input: taskDefaults(id) });
  const run = () => { if (Object.values(prediction).some((value) => !value.trim())) { dispatch({ type: 'set-error', error: '예측 항목과 근거를 모두 입력하세요.' }); return; } dispatch({ type: 'run', taskId: state.taskId, id: `${Date.now()}-${state.taskId}`, result: calculateLens(input) }); };
  const hint = taskAttempts.length >= 3 ? '3회 단서: 평행·중심·초점 세 기준 광선을 각각 따라가세요.' : taskAttempts.length === 2 ? '2회 단서: 부호와 중심 광선이 곧게 간다는 점을 확인하세요.' : taskAttempts.length === 1 ? '1회 단서: 초점 위치와 얇은렌즈 식을 확인하세요.' : '';
  return { state, task, input, prediction, attempts, allAttemptsByTask: state.attempts, latest, progress, hint, changeInput, changeLensType, selectTask, run, changePrediction: (field: keyof typeof prediction, value: string) => dispatch({ type: 'change-prediction', taskId: state.taskId, field, value }), updateExplanation: (id: string, value: string) => dispatch({ type: 'update-explanation', taskId: state.taskId, attemptId: id, value }), preset: () => dispatch({ type: 'select-task', taskId: state.taskId, input: taskDefaults(state.taskId) }), resetSession: () => dispatch({ type: 'reset-session', input: taskDefaults(1) }) };
}
