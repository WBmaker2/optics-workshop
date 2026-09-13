export type CompoundResult = { imageDistanceM: number; magnification: number; valid: boolean; message: string };
export function compoundLenses(objectDistanceM: number, focal1M: number, focal2M: number, separationM: number): CompoundResult {
  if (![objectDistanceM, focal1M, focal2M, separationM].every(Number.isFinite) || objectDistanceM <= 0 || focal1M === 0 || focal2M === 0) return { imageDistanceM: 0, magnification: 0, valid: false, message: '거리는 양수, 초점거리는 0이 아니어야 합니다.' };
  const d1 = 1 / (1 / focal1M - 1 / objectDistanceM);
  const object2 = separationM - d1;
  if (object2 === 0) return { imageDistanceM: 0, magnification: 0, valid: false, message: '두 번째 렌즈의 초점면 경계입니다.' };
  const d2 = 1 / (1 / focal2M - 1 / object2);
  return { imageDistanceM: separationM + d2, magnification: (-d1 / objectDistanceM) * (-d2 / object2), valid: Number.isFinite(d2), message: '두 얇은렌즈를 순서대로 계산했습니다.' };
}
export function depthOfField(focalM: number, apertureM: number, focusDistanceM: number, circleM = 0.00003) { if (focalM <= 0 || apertureM <= 0 || focusDistanceM <= focalM) return { valid: false, message: '초점거리·조리개·초점거리를 확인하세요.' }; const near = focusDistanceM * (focalM * focusDistanceM / (focalM * focusDistanceM + apertureM * circleM * (focusDistanceM - focalM))); const far = focusDistanceM * (focalM * focusDistanceM / (focalM * focusDistanceM - apertureM * circleM * (focusDistanceM - focalM))); return { valid: true, nearM: near, farM: far }; }
export function chromaticImage(focalM: number, dispersion: number) { return { blueM: focalM * (1 - dispersion), redM: focalM * (1 + dispersion), spreadM: 2 * focalM * Math.abs(dispersion) }; }
export function doubleSlitIntensity(positionM: number, wavelengthM: number, slitSeparationM: number, screenDistanceM: number) { if (wavelengthM <= 0 || slitSeparationM <= 0 || screenDistanceM <= 0) return { valid: false, intensity: 0 }; const phase = Math.PI * slitSeparationM * positionM / (wavelengthM * screenDistanceM); return { valid: true, intensity: Math.cos(phase) ** 2 }; }
