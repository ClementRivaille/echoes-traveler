import { PathId } from './pathsConfig';

const SAVE_KEY = 'ECHOES_TRAVELER_SAVE';

export type SaveFile = {
  [key in PathId]: boolean;
};

export function save(file: SaveFile): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(file));
    return true;
  } catch {
    return false;
  }
}

export function loadSave(): SaveFile | undefined {
  try {
    const fileStr = localStorage.getItem(SAVE_KEY);
    if (fileStr) {
      const file = JSON.parse(fileStr) as SaveFile;
      return file;
    }
    return;
  } catch {
    return;
  }
}

export function eraseSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}
