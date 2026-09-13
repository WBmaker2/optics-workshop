import { LensInput, LensResult } from '../domain/opticsTypes';

export type Ray = {
  kind: 'parallel' | 'central' | 'focal';
  from: { x: number; y: number };
  lens: { x: number; y: number };
  outgoing: { x: number; y: number };
  virtualExtension?: { x: number; y: number };
};

export function sampleRays(input: LensInput, result: LensResult): Ray[] {
  if (result.kind === 'invalid') return [];
  const h = input.objectHeightM * 1000;
  const endX = 900;
  const f = input.focalLengthM * 1000;
  const doMm = input.objectDistanceM * 1000;
  const infinity = input.objectAtInfinity;
  const heights = infinity ? [h, 0, -h] : [h, 0, h * f / (f - doMm)];
  const validHeights = heights.filter((y) => Number.isFinite(y));
  return validHeights.map((y, index) => {
    const incomingSlope = infinity ? 0 : (y - h) / doMm;
    const outgoingSlope = incomingSlope - y / f;
    const outgoing = { x: endX, y: y + outgoingSlope * endX };
    const extension = result.kind === 'finite-image' && result.imageType === 'virtual'
      ? { x: result.imageDistanceM * 1000, y: y + outgoingSlope * result.imageDistanceM * 1000 }
      : undefined;
    return { kind: index === 0 ? 'parallel' : index === 1 ? 'central' : 'focal', from: { x: infinity ? -endX : -doMm, y: infinity ? y : h }, lens: { x: 0, y }, outgoing, virtualExtension: extension };
  });
}
