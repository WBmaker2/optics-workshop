import { lazy, Suspense } from 'react';
import type { LensInput, LensResult } from '../domain/opticsTypes';
import { SvgOpticsFallback } from './SvgOpticsFallback';

const ThreeScene = lazy(() => import('./ThreeOpticsScene').then((module) => ({ default: module.ThreeOpticsScene })));
export function OpticsScene({ input, result, onInputChange, screenLocked, forceSvg = false }: { input: LensInput; result: LensResult; onInputChange: (key: 'objectDistanceM' | 'screenDistanceM', valueM: number) => void; screenLocked?: boolean; forceSvg?: boolean }) {
  if (forceSvg) return <SvgOpticsFallback input={input} result={result} />;
  return <Suspense fallback={<SvgOpticsFallback input={input} result={result} />}><ThreeScene input={input} result={result} onInputChange={onInputChange} screenLocked={screenLocked} /></Suspense>;
}
