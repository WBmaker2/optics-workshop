import { mToMm } from '../domain/units';
import type { LensInput, LensResult } from '../domain/opticsTypes';
import type { Attempt, Prediction } from '../state/sessionReducer';

const signed = (value: number, unit = 'mm') => `${value >= 0 ? '+' : ''}${mToMm(value).toFixed(1)} ${unit}`;
function resultCopy(result: LensResult): { title: string; explanation: string } {
  if (result.kind === 'invalid') return { title: '입력을 확인하세요', explanation: result.errors.map((error) => error.message).join(' ') };
  if (result.kind === 'focal-boundary') return { title: '초점면 경계', explanation: '물체가 초점에 있어 출사 광선은 평행해집니다. 유한한 상의 교차점이 없으므로 스크린에 선명한 상을 만들 수 없습니다.' };
  if (result.kind === 'near-focal') return { title: '초점면에 가까운 상태', explanation: `광선 교차점이 ${result.imageType === 'real' ? '렌즈 뒤' : '렌즈 앞'} 아주 먼 곳에 있습니다. 화면 밖의 유한 위치일 수 있으므로 스크린 위치와 구별하세요.` };
  if (result.kind === 'infinite-object') return { title: '무한히 먼 물체', explanation: `평행하게 들어온 광선이 ${result.imageType === 'real' ? '렌즈 뒤' : '렌즈 앞'} 초점에서 만납니다. 유한 물체의 확대율과 높이는 이 모델에서 계산하지 않습니다.` };
  const sign = result.imageDistanceM > 0 ? '양수이므로 렌즈 뒤에서 실제로 교차' : '음수이므로 렌즈 앞쪽으로 뒤로 연장한 광선이 교차';
  const screen = result.screenMatch === 'on-screen' ? '스크린 위치와 일치합니다.' : result.screenMatch === 'off-screen' ? '스크린 위치와 달라 스크린에는 선명한 상이 맺히지 않습니다.' : '허상이므로 스크린에 투사할 수 없습니다.';
  return { title: result.imageType === 'real' ? '실상' : '허상', explanation: `얇은렌즈식으로 dᵢ = ${signed(result.imageDistanceM)}이고, ${sign}합니다. 배율 부호는 ${result.magnification < 0 ? '음수(도립)' : '양수(정립)'}이며 ${screen}` };
}

export function ResultPanel({ input, result, prediction, attempt, onExplanation }: { input: LensInput; result?: LensResult; prediction: Prediction; attempt?: Attempt; onExplanation: (value: string) => void }) {
  if (!result || !attempt) return null;
  const copy = resultCopy(result);
  return <div className="results" aria-live="polite"><div className="result-heading"><div><h2>2. 실행 결과</h2><p className="kicker">시도 ID · {attempt.id}</p></div><div className="result-actions"><button type="button" onClick={() => { const blob = new Blob([JSON.stringify(attempt, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `optics-attempt-${attempt.id}.json`; a.click(); URL.revokeObjectURL(url); }}>JSON 저장</button><button type="button" onClick={() => window.print()}>인쇄/PDF</button></div></div><div className="result-card"><h3>{copy.title}</h3><p>{copy.explanation}</p>{result.kind === 'finite-image' && <div className="result-grid"><div><span>상 거리 dᵢ</span><strong>{signed(result.imageDistanceM)}</strong></div><div><span>배율 m</span><strong>{result.magnification.toFixed(2)}× · {result.orientation === 'inverted' ? '도립' : '정립'}</strong></div><div><span>상 높이</span><strong>{signed(result.imageHeightM)}</strong></div><div><span>스크린 판정</span><strong>{result.screenMatch === 'on-screen' ? `일치 (${mToMm(input.screenDistanceM).toFixed(0)} mm)` : result.screenMatch === 'off-screen' ? '불일치' : '투사 불가'}</strong></div></div>}</div><div className="your-prediction"><b>나의 예측</b><p>{prediction.location} · {prediction.type} · {prediction.orientation} · {prediction.size}</p></div><label className="explain"><b>3. 설명을 수정해 보세요</b><textarea value={attempt.explanation} onChange={(event) => onExplanation(event.target.value)} placeholder="예측과 달랐다면 부호·광선 교차를 포함해 설명을 고쳐 보세요." /></label></div>;
}
