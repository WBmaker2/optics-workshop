import { useState } from 'react';
import { UpdateHistory } from './components/UpdateHistory';
import { LensControls } from './components/LensControls';
import { PredictionPanel } from './components/PredictionPanel';
import { ResultPanel } from './components/ResultPanel';
import { SessionHistory } from './components/SessionHistory';
import { TaskNavigator } from './components/TaskNavigator';
import { TaskProgress } from './components/TaskProgress';
import { OpticsModes } from './modes/OpticsModes';
import { OpticsScene } from './renderers/OpticsScene';
import { tasks } from './scenarios/opticsTasks';
import { useOpticsSession } from './hooks/useOpticsSession';
import './styles/app.css';
import './styles/responsive.css';

export default function App() {
  const session = useOpticsSession();
  const [showModes, setShowModes] = useState(true);
  return <main><header><div><div className="eyebrow">OPTICS WORKSHOP · SESSION LAB</div><h1>빛을 설계하는 광학 공방</h1><p className="sub">근축 기하광학 · 얇은렌즈 근사</p></div><div className="header-actions"><figure className="context-figure"><img src="/assets/workshop-context.png" alt="밝은 교실의 목재 광학대와 청록 렌즈 지지대" /><figcaption>맥락용 재구성</figcaption></figure><UpdateHistory /></div></header><TaskNavigator tasks={tasks} activeId={session.task.id} onSelect={session.selectTask} /><TaskProgress progress={session.progress} /><section className="layout"><div className="workspace"><div className="bench-head"><div><p className="kicker">과제 {session.task.id} · {session.task.title}</p><h2>{session.task.prompt}</h2></div><span className="model-note">부호 있는 근축 모델</span></div><OpticsScene input={session.input} result={session.state.activeResult ?? { kind: 'invalid', errors: [] }} onInputChange={(key, value) => session.changeInput(key, value)} screenLocked={session.task.id === 3} /><p className="caption">실선은 광선, 점선은 허상 연장입니다. 렌더러는 엔진 결과만 표현합니다.</p></div><LensControls input={session.input} taskId={session.task.id} onLensType={session.changeLensType} onInputChange={session.changeInput} onPreset={session.preset} onReset={session.resetSession} /></section><section className="learning"><PredictionPanel prediction={session.prediction} error={session.state.error} onChange={session.changePrediction} /><div className="run-area"><p className="kicker">예측을 저장한 다음</p><button type="button" className="primary-cta gi-pulse" onClick={session.run}>실행하고 비교</button><p className="next-action">{session.hint || '다음 필수 행동 · 예측 네 항목과 근거 작성'}</p></div><ResultPanel input={session.input} result={session.state.activeResult} prediction={session.prediction} attempt={session.latest} onExplanation={(value) => session.latest && session.updateExplanation(session.latest.id, value)} /></section><SessionHistory attempts={session.attempts} /><section className="modes-toggle"><button type="button" onClick={() => setShowModes((value) => !value)}>{showModes ? '후속 탐구 접기' : '후속 탐구 열기'}</button></section>{showModes && <OpticsModes />}</main>;
}
