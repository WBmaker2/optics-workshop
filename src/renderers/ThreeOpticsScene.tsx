import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import * as THREE from 'three';
import { LensInput, LensResult } from '../domain/opticsTypes';
import { sampleRays } from '../engine/raySampler';
import { SvgOpticsFallback } from './SvgOpticsFallback';
import { getSceneBounds } from './sceneModel';

export function ThreeOpticsScene({ input, result, onInputChange, screenLocked = false }: { input: LensInput; result: LensResult; onInputChange?: (key: 'objectDistanceM' | 'screenDistanceM', valueM: number) => void; screenLocked?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boundXRef = useRef(1000);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (failed || !canvasRef.current) return;
    let renderer: THREE.WebGLRenderer | undefined;
    const scene = new THREE.Scene();
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      const rays = sampleRays(input, result);
      const bounds = getSceneBounds(input, result);
      const boundX = bounds.x;
      boundXRef.current = boundX;
      const boundY = bounds.y;
      const camera = new THREE.OrthographicCamera(-boundX, boundX, boundY, -boundY, 0.1, 10);
      camera.position.z = 5;
      const material = (color: number, dashed = false) => dashed ? new THREE.LineDashedMaterial({ color, dashSize: 14, gapSize: 8, linewidth: 2 }) : new THREE.LineBasicMaterial({ color, linewidth: 2 });
      const addLine = (points: [number, number][], color: number, dashed = false) => { const geometry = new THREE.BufferGeometry().setFromPoints(points.map(([x, y]) => new THREE.Vector3(x, y, 0))); const line = new THREE.Line(geometry, material(color, dashed)); if (dashed) line.computeLineDistances(); scene.add(line); };
      addLine([[-boundX, 0], [boundX, 0]], 0x687c7b);
      addLine([[0, -boundY], [0, boundY]], 0x16847c);
      addLine([[-input.objectDistanceM * 1000, 0], [-input.objectDistanceM * 1000, input.objectHeightM * 1000]], 0xc97836);
      [-Math.abs(input.focalLengthM * 1000), Math.abs(input.focalLengthM * 1000)].forEach((x) => addLine([[x, -10], [x, 10]], 0x8d6a37));
      if (input.screenDistanceM > 0) addLine([[input.screenDistanceM * 1000, -boundY], [input.screenDistanceM * 1000, boundY]], 0x657a9a);
      rays.forEach((r) => { addLine([[r.from.x, r.from.y], [r.lens.x, r.lens.y], [r.outgoing.x, r.outgoing.y]], 0xd15e31); if (r.virtualExtension) addLine([[r.lens.x, r.lens.y], [r.virtualExtension.x, r.virtualExtension.y]], 0xd15e31, true); });
      if (result.kind === 'finite-image') addLine([[result.imageDistanceM * 1000, 0], [result.imageDistanceM * 1000, result.imageHeightM * 1000]], 0x16847c);
      const resize = () => { const rect = canvasRef.current!.getBoundingClientRect(); renderer!.setPixelRatio(Math.min(2, window.devicePixelRatio)); renderer!.setSize(rect.width, rect.height, false); renderer!.render(scene, camera); };
      resize(); window.addEventListener('resize', resize);
      return () => { window.removeEventListener('resize', resize); scene.traverse((o) => { const line = o as THREE.Line; line.geometry?.dispose(); (line.material as THREE.Material)?.dispose(); }); renderer?.dispose(); };
    } catch { setFailed(true); renderer?.dispose(); }
  }, [input, result, failed]);
  if (failed) return <SvgOpticsFallback input={input} result={result} />;
  const drag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const worldX = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * boundXRef.current;
    const objectX = -input.objectDistanceM * 1000;
    const screenX = input.screenDistanceM * 1000;
    const target = Math.abs(worldX - objectX) < 35 ? 'objectDistanceM' : !screenLocked && Math.abs(worldX - screenX) < 35 ? 'screenDistanceM' : null;
    if (!target) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const move = (e: globalThis.PointerEvent) => { const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * boundXRef.current; const value = target === 'objectDistanceM' ? Math.min(5000, Math.max(30, Math.round(-x))) : Math.min(5000, Math.max(-1000, Math.round(x))); (onInputChange ?? ((k, v) => window.dispatchEvent(new CustomEvent('optics-drag', { detail: { key: k, valueM: v } })) ))(target, value / 1000); };
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); window.removeEventListener('pointercancel', stop); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });
  };
  return <><canvas className="bench three-bench" ref={canvasRef} aria-label="Three.js 얇은렌즈 광학대" onPointerDown={drag} /><small className="drag-hint">물체·스크린을 드래그하거나 숫자로 조절하세요.</small></>;
}
