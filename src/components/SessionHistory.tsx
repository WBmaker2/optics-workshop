import { mToMm } from '../domain/units';
import type { Attempt } from '../state/sessionReducer';
export const flattenAttempts = (attempts: Record<number, Attempt[]>) => Object.values(attempts).flat();

export function SessionHistory({ attempts }: { attempts: Record<number, Attempt[]> | Attempt[] }) { const all = Array.isArray(attempts) ? attempts : flattenAttempts(attempts);
  if (!all.length) return <section className="history"><h2>세션 기록 <span>아직 시도가 없습니다</span></h2><p>예측을 제출하면 시도별 조건과 설명이 여기에 남습니다.</p></section>;
  const download = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'optics-session.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 0); };
  return <section className="history"><h2>세션 기록 <span>{all.length}회</span></h2><ol>{all.map((attempt, i) => <li key={attempt.id}><b>과제 {attempt.taskId} · 시도 {i + 1}</b> · {new Date(attempt.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} · f {mToMm(attempt.input.focalLengthM).toFixed(0)} mm · dₒ {mToMm(attempt.input.objectDistanceM).toFixed(0)} mm{attempt.explanation ? ' · 설명 수정됨' : ''}</li>)}</ol><button type="button" onClick={download}>전체 세션 JSON 다운로드</button><button type="button" onClick={() => window.print()}>인쇄/PDF</button></section>;
}
