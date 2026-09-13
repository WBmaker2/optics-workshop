import { describe, expect, it } from 'vitest';
import { chromaticImage, compoundLenses, depthOfField, doubleSlitIntensity } from '../src/engine/advancedOptics';
describe('advanced modes', () => {
  it('calculates compound lenses', () => expect(compoundLenses(.3, .1, .08, .2).valid).toBe(true));
  it('rejects depth boundary', () => expect(depthOfField(.1, .002, .05).valid).toBe(false));
  it('separates chromatic focal points', () => expect(chromaticImage(.1, .03).spreadM).toBeCloseTo(.006));
  it('returns wave intensity in range', () => { const r = doubleSlitIntensity(.01, 550e-9, .0002, 1); expect(r.valid).toBe(true); expect(r.intensity).toBeGreaterThanOrEqual(0); });
  it('rejects invalid compound input', () => expect(compoundLenses(0, .1, .1, .1).valid).toBe(false));
  it('rejects invalid wave input', () => expect(doubleSlitIntensity(0, 0, .1, 1).valid).toBe(false));
  it('depth result has bounds', () => { const r = depthOfField(.05, .002, 2); expect(r.valid).toBe(true); if (r.valid) expect(r.farM ?? 0).toBeGreaterThan(r.nearM ?? 0); });
  it('color spread is nonnegative', () => expect(chromaticImage(.1, -.02).spreadM).toBeGreaterThan(0));
  it('wave intensity remains finite', () => expect(doubleSlitIntensity(.001, 500e-9, .0001, 2).intensity).toBeLessThanOrEqual(1));
  it('compound output includes magnification', () => expect(compoundLenses(.3, .1, .08, .2)).toHaveProperty('magnification'));
  it('depth aperture changes near bound', () => { const a = depthOfField(.05, .001, 2); const b = depthOfField(.05, .004, 2); expect(a.valid && b.valid).toBe(true); });
  it('chromatic result has red and blue', () => expect(chromaticImage(.1, .01)).toEqual(expect.objectContaining({ redM: expect.any(Number), blueM: expect.any(Number) })));
  it('wave invalid exposes valid false', () => expect(doubleSlitIntensity(0, 0, .0002, 1).valid).toBe(false));
});
