import { describe, expect, it } from 'vitest';
import { calculateLens } from '../src/engine/thinLens';
import { sampleRays } from '../src/engine/raySampler';
const base = { lensType: 'converging' as const, focalLengthM: .1, objectDistanceM: .3, objectHeightM: .02, screenDistanceM: .15, objectAtInfinity: false };
describe('ray geometry', () => {
  it('uses lens equation slopes and meets at image', () => { const input = base; const result = calculateLens(input); const rays = sampleRays(input, result); expect(rays).toHaveLength(3); const imageX = result.kind === 'finite-image' ? result.imageDistanceM * 1000 : 0; rays.forEach((r) => expect(r.lens.y + (r.outgoing.y - r.lens.y) * imageX / r.outgoing.x).toBeCloseTo(result.kind === 'finite-image' ? result.imageHeightM * 1000 : 0)); });
  it('returns parallel outgoing rays at focal boundary', () => { const input = { ...base, objectDistanceM: .1 }; const rays = sampleRays(input, calculateLens(input)); expect(rays).toHaveLength(2); expect(rays[0].outgoing.y - rays[0].lens.y).toBeCloseTo(rays[1].outgoing.y - rays[1].lens.y); });
  it('adds backward extension for virtual image', () => { const input = { ...base, objectDistanceM: .06 }; const rays = sampleRays(input, calculateLens(input)); expect(rays.every((r) => r.virtualExtension)).toBe(true); expect(rays[0].outgoing.y).not.toBeCloseTo(rays[0].virtualExtension!.y); });
});
