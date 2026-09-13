import type { LensInput } from '../domain/opticsTypes';
import { mToMm } from '../domain/units';

function NumberControl({ label, valueM, disabled, onChange }: { label: string; valueM: number; disabled?: boolean; onChange: (valueM: number) => void }) {
  const value = mToMm(valueM);
  const nudge = (delta: number) => onChange((value + delta) / 1000);
  return <label>{label}<output>{Number.isFinite(value) ? value.toFixed(0) : '—'} mm</output><input type="number" inputMode="decimal" value={Number.isFinite(value) ? value : ''} disabled={disabled} onChange={(event) => onChange(Number(event.target.value) / 1000)} onKeyDown={(event) => { if (event.key === 'ArrowUp' || event.key === 'ArrowRight') { event.preventDefault(); nudge(1); } if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') { event.preventDefault(); nudge(-1); } }} /></label>;
}

export function LensControls({ input, taskId, onLensType, onInputChange, onPreset, onReset }: { input: LensInput; taskId: number; onLensType: (value: LensInput['lensType']) => void; onInputChange: (key: keyof LensInput, valueM: number | boolean) => void; onPreset: () => void; onReset: () => void }) {
  return <aside className="controls" aria-label="광학대 조작"><h2>광학대 조작</h2><label>렌즈 종류<select value={input.lensType} onChange={(event) => onLensType(event.target.value as LensInput['lensType'])}><option value="converging">볼록 · 수렴</option><option value="diverging">오목 · 발산</option></select></label>{([['focalLengthM', '초점 거리 f'], ['objectDistanceM', '물체 거리 dₒ'], ['objectHeightM', '물체 높이 hₒ'], ['screenDistanceM', '스크린 위치']] as const).map(([key, label]) => <NumberControl key={key} label={label} valueM={input[key]} disabled={taskId === 3 && key === 'screenDistanceM'} onChange={(value) => onInputChange(key, value)} />)}<p className="range-note">화살표 키는 1 mm씩 조절합니다. {taskId === 3 ? '과제 3의 센서는 120 mm로 고정됩니다.' : ''}</p><div className="control-actions"><button type="button" onClick={onPreset}>프리셋</button><button type="button" onClick={onReset}>세션 초기화</button></div></aside>;
}
