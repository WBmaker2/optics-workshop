import { OrthographicCamera } from 'three';
export function createOpticsCamera(width = 760, height = 300) {
  return new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 100);
}
