import { app, } from 'electron';
import dotenv from 'dotenv';
import { create } from '@/pages/main';
import { createTray } from '@/components/tray';

app
  .whenReady()
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    dotenv.config();
    create();
    await createTray();
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(error => {
    console.error(error);
  });
