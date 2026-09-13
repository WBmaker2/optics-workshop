import { describe, expect, it } from 'vitest';
import { getSceneBounds } from '../src/renderers/sceneModel';
import { taskDefaults } from '../src/scenarios/opticsTasks';
import { calculateLens } from '../src/engine/thinLens';

describe('shared scene model', () => {
  it('bounds finite images and focus markers', () => { const input = taskDefaults(1); const bounds = getSceneBounds(input, calculateLens(input)); expect(bounds.x).toBeGreaterThan(300); expect(bounds.y).toBeGreaterThan(100); });
  it('keeps an SVG-safe bound for focal boundary', () => { const input = { ...taskDefaults(1), objectDistanceM: .1 }; const bounds = getSceneBounds(input, calculateLens(input)); expect(Number.isFinite(bounds.x)).toBe(true); });
});
