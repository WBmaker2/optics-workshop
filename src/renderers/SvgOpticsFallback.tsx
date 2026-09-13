import { LensInput, LensResult } from '../domain/opticsTypes';
import { sampleRays } from '../engine/raySampler';
import { getSceneBounds } from './sceneModel';

export function SvgOpticsFallback({ input, result }: { input: LensInput; result: LensResult }) {
  const rays = sampleRays(input, result);
  const bound = getSceneBounds(input, result).x;
  const sx = 380, sy = 150, scale = 330 / bound;
  const X = (m: number) => sx + m * scale;
  const Y = (m: number) => sy - m * scale;
  return <svg className="bench" viewBox="0 0 760 300" role="img" aria-label="얇은렌즈 광학대와 기준 광선">
    <rect x="20" y="25" width="720" height="230" rx="18" fill="#f5ecd9" />
    <line x1="30" y1={sy} x2="730" y2={sy} className="axis" /><text x="40" y="285">광축 · 눈금(mm)</text>
    <line x1={X(0)} y1="55" x2={X(0)} y2="245" className="lens" /><text x={X(0) - 24} y="45">렌즈</text>
    <line x1={X(-input.objectDistanceM * 1000)} y1={Y(input.objectHeightM * 1000)} x2={X(-input.objectDistanceM * 1000)} y2={sy} className="object" /><text x={X(-input.objectDistanceM * 1000) - 22} y="45">물체</text>
    {[-input.focalLengthM * 1000, input.focalLengthM * 1000].map((f, i) => <g key={i}><line x1={X(f)} y1={sy - 7} x2={X(f)} y2={sy + 7} className="focus" /><text x={X(f) - 8} y={sy + 24}>F</text></g>)}
    {input.screenDistanceM > 0 && <><line x1={X(input.screenDistanceM * 1000)} y1="65" x2={X(input.screenDistanceM * 1000)} y2="235" className="screen" /><text x={X(input.screenDistanceM * 1000) - 18} y="255">스크린</text></>}
    {rays.map((r, i) => <g key={i}><line x1={X(r.from.x)} y1={Y(r.from.y)} x2={X(r.lens.x)} y2={Y(r.lens.y)} className="ray" /><line x1={X(r.lens.x)} y1={Y(r.lens.y)} x2={X(r.outgoing.x)} y2={Y(r.outgoing.y)} className="ray" />{r.virtualExtension && <line x1={X(r.lens.x)} y1={Y(r.lens.y)} x2={X(r.virtualExtension.x)} y2={Y(r.virtualExtension.y)} className="ray extension" />}</g>)}
    {result.kind === 'finite-image' && <><line x1={X(result.imageDistanceM * 1000)} y1={Y(result.imageHeightM * 1000)} x2={X(result.imageDistanceM * 1000)} y2={sy} className="image" /><text x={X(result.imageDistanceM * 1000) - 15} y="45">상</text></>}
  </svg>;
}
