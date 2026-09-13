import { useState } from 'react';
import { chromaticImage, compoundLenses, depthOfField, doubleSlitIntensity } from '../engine/advancedOptics';

type Mode = 'compound' | 'depth' | 'color' | 'wave';
type Values = Record<string, number>;
const names: Record<Mode, string> = { compound: '두 렌즈', depth: '조리개·심도', color: '색수차', wave: '파동광학' };
const initial: Values = { object: .3, f1: .1, f2: .08, gap: .2, focal: .05, aperture: .002, focus: 2, dispersion: .03, position: .01, wavelength: 550, slit: .2, distance: 1 };
const fields: Record<Mode, [string, string][]> = { compound: [['object', '물체 거리 (m)'], ['f1', '렌즈 1 초점거리 (m)'], ['f2', '렌즈 2 초점거리 (m)'], ['gap', '렌즈 간격 (m)']], depth: [['focal', '초점거리 (m)'], ['aperture', '조리개 지름 (m)'], ['focus', '초점 거리 (m)']], color: [['focal', '기준 초점거리 (m)'], ['dispersion', '분산 계수']], wave: [['position', '스크린 x (m)'], ['wavelength', '파장 (nm)'], ['slit', '슬릿 간격 (mm)'], ['distance', '스크린 거리 (m)']] };
const choices: Record<Mode, string[]> = { compound: ['상은 더 멀리 맺힌다', '상은 더 가까이 맺힌다', '배율이 커진다'], depth: ['심도가 깊어진다', '심도가 얕아진다'], color: ['색별 초점 차이가 커진다', '색별 초점 차이가 작다'], wave: ['간섭 무늬가 밝다', '간섭 무늬가 어둡다'] };
type ModeResult = ReturnType<typeof compoundLenses> | ReturnType<typeof depthOfField> | ReturnType<typeof chromaticImage> | ReturnType<typeof doubleSlitIntensity>;

export function OpticsModes() {
  const [mode, setMode] = useState<Mode>('compound');
  const [values, setValues] = useState<Values>(initial);
  const [prediction, setPrediction] = useState('');
  const [reason, setReason] = useState('');
  const [result, setResult] = useState<ModeResult>();
  const [attempted, setAttempted] = useState(false);
  const change = (key: string, value: number) => { setValues((current) => ({ ...current, [key]: value })); setPrediction(''); setReason(''); setResult(undefined); setAttempted(false); };
  const selectMode = (next: Mode) => { setMode(next); setPrediction(''); setReason(''); setResult(undefined); setAttempted(false); };
  const run = () => { setAttempted(true); if (!prediction.trim() || !reason.trim()) return; const v = values; setResult(mode === 'compound' ? compoundLenses(v.object, v.f1, v.f2, v.gap) : mode === 'depth' ? depthOfField(v.focal, v.aperture, v.focus) : mode === 'color' ? chromaticImage(v.focal, v.dispersion) : doubleSlitIntensity(v.position, v.wavelength * 1e-9, v.slit * 1e-3, v.distance)); };
  return <section className="modes"><h2>후속 광학 탐구</h2><div className="mode-tabs">{(Object.keys(names) as Mode[]).map((item) => <button type="button" key={item} aria-pressed={mode === item} className={mode === item ? 'active' : ''} onClick={() => selectMode(item)}>{names[item]}</button>)}</div><p>{mode === 'wave' ? '기하광학과 별도 모델: 두 슬릿 간섭 세기를 계산합니다.' : '조건을 바꾸면 이전 예측과 결과가 초기화됩니다.'}</p>{fields[mode].map(([key, label]) => <label key={key}>{label}<input type="number" value={values[key]} onChange={(event) => change(key, Number(event.target.value))} /></label>)}<label>결과 예측<select value={prediction} onChange={(event) => setPrediction(event.target.value)}><option value="">선택하세요</option>{choices[mode].map((choice) => <option key={choice}>{choice}</option>)}</select></label><label>근거<textarea aria-label="후속 모드 근거" placeholder="변화 방향을 설명하세요." value={reason} onChange={(event) => setReason(event.target.value)} /></label>{attempted && (!prediction || !reason.trim()) && <p role="alert" className="error">결과 예측과 근거를 모두 입력하세요.</p>}<button type="button" className="primary-cta" onClick={run}>이 모드 실행</button>{result && <ModeResultView mode={mode} result={result} />}</section>;
}

function ModeResultView({ mode, result }: { mode: Mode; result: ModeResult }) {
  if ('valid' in result && result.valid === false) return <div role="alert" className="error">입력 범위를 확인하세요. {'message' in result ? result.message : '계산할 수 없습니다.'}</div>;
  if (mode === 'compound' && 'imageDistanceM' in result) return <div className="mode-card"><b>두 렌즈의 최종 상</b><p>상 위치 {result.imageDistanceM.toFixed(3)} m · 배율 {result.magnification.toFixed(2)}×</p><svg viewBox="0 0 300 45" aria-label="두 렌즈 상 위치 시각화"><line x1="10" y1="22" x2="290" y2="22" stroke="#16847c" strokeWidth="3" /><circle cx="90" cy="22" r="5" fill="#c97836" /><circle cx="210" cy="22" r="5" fill="#657a9a" /></svg></div>;
  if (mode === 'depth' && 'nearM' in result) return <div className="mode-card"><b>허용 가능한 심도</b><p>앞 {(result.nearM ?? 0).toFixed(2)} m · 초점 · 뒤 {(result.farM ?? 0).toFixed(2)} m</p><svg viewBox="0 0 300 35" aria-label="심도 범위 시각화"><line x1="20" y1="18" x2="280" y2="18" stroke="#16847c" strokeWidth="8" /><circle cx="150" cy="18" r="7" fill="#c97836" /></svg></div>;
  if (mode === 'color' && 'spreadM' in result) return <div className="mode-card"><b>색수차 결과</b><p>빨강 {result.redM.toFixed(3)} m · 파랑 {result.blueM.toFixed(3)} m · 차이 {result.spreadM.toFixed(3)} m</p><svg viewBox="0 0 300 35" aria-label="색별 초점 위치 시각화"><line x1="30" y1="18" x2="270" y2="18" stroke="#c97836" strokeWidth="4" /><circle cx="100" cy="18" r="6" fill="#d15e31" /><circle cx="200" cy="18" r="6" fill="#5579c6" /></svg></div>;
  if ('intensity' in result) return <div className="mode-card"><b>간섭 세기</b><p>{result.intensity.toFixed(3)} (0~1) · {result.intensity > .5 ? '밝은 무늬' : '어두운 무늬'}</p><svg viewBox="0 0 300 45" aria-label="간섭 무늬 시각화"><path d="M5 22 Q25 2 45 22 T85 22 T125 22 T165 22 T205 22 T245 22 T285 22" fill="none" stroke="#c97836" strokeWidth="3" /></svg></div>;
  return null;
}
