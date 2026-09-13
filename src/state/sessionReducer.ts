import type { LensInput, LensResult } from '../domain/opticsTypes';

export type PredictionField = 'location' | 'type' | 'orientation' | 'size';
export type Prediction = Record<PredictionField, string> & { rationale: string };
export type Progress = { predicted: boolean; compared: boolean; explained: boolean; applied: boolean };
export type Attempt = {
  id: string;
  taskId: number;
  conditionVersion: number;
  input: LensInput;
  prediction: Prediction;
  result: LensResult;
  explanation: string;
  createdAt: string;
  explanationUpdatedAt?: string;
};

export const blankPrediction = (): Prediction => ({ location: '', type: '', orientation: '', size: '', rationale: '' });
export const blankProgress = (): Progress => ({ predicted: false, compared: false, explained: false, applied: false });
export type SessionState = {
  taskId: number;
  inputs: Record<number, LensInput>;
  predictions: Record<number, Prediction>;
  attempts: Record<number, Attempt[]>;
  progress: Record<number, Progress>;
  activeResult?: LensResult;
  error: string;
};

export type SessionAction =
  | { type: 'select-task'; taskId: number; input: LensInput }
  | { type: 'change-input'; taskId: number; input: LensInput }
  | { type: 'change-prediction'; taskId: number; field: keyof Prediction; value: string }
  | { type: 'run'; taskId: number; result: LensResult; id: string }
  | { type: 'update-explanation'; taskId: number; attemptId: string; value: string }
  | { type: 'reset-flow'; taskId: number }
  | { type: 'set-error'; error: string }
  | { type: 'reset-session'; input: LensInput };

const withTask = (state: SessionState, taskId: number, patch: Partial<SessionState>): SessionState => ({ ...state, ...patch, taskId });

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'select-task':
      return withTask(state, action.taskId, { inputs: { ...state.inputs, [action.taskId]: action.input }, activeResult: undefined, error: '' });
    case 'change-input': {
      const previous = state.progress[action.taskId] ?? blankProgress();
      return withTask(state, action.taskId, {
        inputs: { ...state.inputs, [action.taskId]: action.input }, activeResult: undefined, error: '',
        predictions: { ...state.predictions, [action.taskId]: blankPrediction() },
        progress: { ...state.progress, [action.taskId]: { ...previous, applied: (state.attempts[action.taskId]?.length ?? 0) > 0 } },
      });
    }
    case 'change-prediction':
      return { ...state, predictions: { ...state.predictions, [action.taskId]: { ...(state.predictions[action.taskId] ?? blankPrediction()), [action.field]: action.value } }, error: '' };
    case 'run': {
      const previous = state.progress[action.taskId] ?? blankProgress();
      const prediction = state.predictions[action.taskId] ?? blankPrediction();
      const list = state.attempts[action.taskId] ?? [];
      const attempt: Attempt = { id: action.id, taskId: action.taskId, conditionVersion: list.length + 1, input: state.inputs[action.taskId], prediction, result: action.result, explanation: '', createdAt: new Date().toISOString() };
      return { ...state, activeResult: action.result, error: '', attempts: { ...state.attempts, [action.taskId]: [...list, attempt] }, progress: { ...state.progress, [action.taskId]: { ...previous, predicted: true, compared: true } } };
    }
    case 'update-explanation': {
      const list = state.attempts[action.taskId] ?? [];
      const attempts = list.map((attempt) => attempt.id === action.attemptId ? { ...attempt, explanation: action.value, explanationUpdatedAt: new Date().toISOString() } : attempt);
      const current = state.progress[action.taskId] ?? blankProgress();
      return { ...state, attempts: { ...state.attempts, [action.taskId]: attempts }, progress: { ...state.progress, [action.taskId]: { ...current, explained: Boolean(action.value.trim()) } } };
    }
    case 'reset-flow':
      return withTask(state, action.taskId, { activeResult: undefined, error: '', predictions: { ...state.predictions, [action.taskId]: blankPrediction() } });
    case 'set-error':
      return { ...state, error: action.error };
    case 'reset-session':
      return { taskId: 1, inputs: { 1: action.input }, predictions: { 1: blankPrediction() }, attempts: {}, progress: {}, activeResult: undefined, error: '' };
    default:
      return state;
  }
}
