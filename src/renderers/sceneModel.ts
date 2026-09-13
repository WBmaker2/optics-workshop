import type { LensInput, LensResult } from '../domain/opticsTypes';
import { sampleRays } from '../engine/raySampler';

export type SceneBounds = { x: number; y: number };
export function getSceneBounds(input: LensInput, result: LensResult): SceneBounds {
  const rays = sampleRays(input, result);
  const xValues = [-input.objectDistanceM * 1000, input.screenDistanceM * 1000, -Math.abs(input.focalLengthM * 1000), Math.abs(input.focalLengthM * 1000), result.kind === 'finite-image' ? result.imageDistanceM * 1000 : 0, ...rays.flatMap((ray) => [ray.outgoing.x, ray.virtualExtension?.x ?? 0])];
  const yValues = [input.objectHeightM * 1000, -input.objectHeightM * 1000, ...rays.flatMap((ray) => [ray.from.y, ray.lens.y, ray.outgoing.y, ray.virtualExtension?.y ?? 0])];
  return { x: Math.max(500, ...xValues.map(Math.abs)) * 1.15, y: Math.max(120, ...yValues.map(Math.abs)) * 1.3 };
}
