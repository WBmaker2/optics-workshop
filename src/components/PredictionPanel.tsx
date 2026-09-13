import type { Prediction, PredictionField } from '../state/sessionReducer';

export const PREDICTION_OPTIONS: Record<PredictionField, { value: string; label: string }[]> = {
  location: [{ value: '렌즈와 초점 사이', label: '렌즈와 초점 사이' }, { value: '초점 위치', label: '초점 위치' }, { value: '초점과 2F 사이', label: '초점과 2F 사이' }, { value: '2F보다 먼 위치', label: '2F보다 먼 위치' }, { value: '렌즈 앞쪽', label: '렌즈 앞쪽(허상)' }],
  type: [{ value: '실상', label: '실상' }, { value: '허상', label: '허상' }, { value: '평행 출사', label: '평행 출사(초점면)' }],
  orientation: [{ value: '도립', label: '도립' }, { value: '정립', label: '정립' }, { value: '방향 없음', label: '방향 없음(평행 출사)' }],
  size: [{ value: '축소', label: '축소' }, { value: '같은 크기', label: '같은 크기' }, { value: '확대', label: '확대' }, { value: '크기 계산 불가', label: '크기 계산 불가' }],
};
const labels: Record<PredictionField, string> = { location: '상 위치', type: '상 종류', orientation: '방향', size: '크기' };

export function PredictionPanel({ prediction, error, onChange }: { prediction: Prediction; error: string; onChange: (field: keyof Prediction, value: string) => void }) {
  return <div className="prediction"><h2>1. 먼저 예측</h2><p>각 항목을 선택하고, 왜 그렇게 생각했는지 근거를 적어 보세요.</p>{(Object.keys(labels) as PredictionField[]).map((field) => <label key={field}>{labels[field]}<select value={prediction[field]} onChange={(event) => onChange(field, event.target.value)}><option value="">선택하세요</option>{PREDICTION_OPTIONS[field].map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}<label>근거<textarea aria-label="예측 근거" value={prediction.rationale} onChange={(event) => onChange('rationale', event.target.value)} placeholder="기준 광선 또는 렌즈 공식을 근거로 써 보세요." /></label>{error && <p role="alert" className="error">{error}</p>}</div>;
}
