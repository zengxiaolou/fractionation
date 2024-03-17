import path from 'node:path';
import { Tray } from 'electron';
import { MAIN_DIRECTORY } from '@/const';

export const createTray = async () => {
  return new Tray(path.resolve(MAIN_DIRECTORY, '../../assets/tray16.png'));
};
