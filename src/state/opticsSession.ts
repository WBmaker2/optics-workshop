import { LensInput, LensResult } from '../domain/opticsTypes';
export type Prediction = { location: string; type: string; orientation: string; size: string; rationale: string };
export type Progress = { predicted: boolean; compared: boolean; explained: boolean; applied: boolean };
export type Attempt = { id: string; task: number; input: LensInput; prediction: Prediction; result: LensResult; explanation: string };
export type SessionState = { taskId: number; input: LensInput; prediction: Prediction; explanation: string; attempts: Attempt[]; progress: Record<number, Progress>; error: string };
export const blankPrediction = (): Prediction => ({ location: '', type: '', orientation: '', size: '', rationale: '' });
export const initialSession = (input: LensInput): SessionState => ({ taskId: 1, input, prediction: blankPrediction(), explanation: '', attempts: [], progress: {}, error: '' });
export type Action = { type: 'select'; taskId: number; input: LensInput } | { type: 'input'; input: LensInput } | { type: 'prediction'; prediction: Prediction } | { type: 'run'; attempt: Attempt } | { type: 'explanation'; id: string; value: string } | { type: 'reset'; input: LensInput };
export function sessionReducer(state: SessionState, action: Action): SessionState {
  if (action.type === 'select') return { ...state, taskId: action.taskId, input: action.input, prediction: blankPrediction(), explanation: '', error: '' };
  if (action.type === 'input') return { ...state, input: action.input, prediction: blankPrediction(), explanation: '', error: '' };
  if (action.type === 'prediction') return { ...state, prediction: action.prediction, error: '' };
  if (action.type === 'reset') return { ...state, input: action.input, prediction: blankPrediction(), explanation: '', error: '' };
  if (action.type === 'explanation') return { ...state, explanation: action.value, attempts: state.attempts.map((a) => a.id === action.id ? { ...a, explanation: action.value } : a), progress: { ...state.progress, [state.taskId]: { ...(state.progress[state.taskId] ?? { predicted: false, compared: false, applied: false }), explained: Boolean(action.value.trim()) } } };
  const count = state.attempts.filter((a) => a.task === action.attempt.task).length + 1; return { ...state, attempts: [...state.attempts, action.attempt], explanation: '', progress: { ...state.progress, [action.attempt.task]: { predicted: true, compared: true, explained: false, applied: count >= 2 } } };
}
