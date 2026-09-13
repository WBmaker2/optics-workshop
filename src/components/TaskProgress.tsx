import type { Progress } from '../state/sessionReducer';

const labels: [keyof Progress, string][] = [['predicted', '예측함'], ['compared', '비교함'], ['explained', '설명함'], ['applied', '적용함']];
export function TaskProgress({ progress }: { progress: Progress }) {
  return <div className="progress" aria-label="과제 진행 상태">{labels.map(([key, label]) => <span key={key} className={progress[key] ? 'done' : ''}>{label} {progress[key] ? '✓' : '○'}</span>)}</div>;
}
