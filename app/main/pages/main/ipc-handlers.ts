import { ipcMain } from 'electron';
import { Channels } from '@/pages/main/channels';
import { databaseManager } from '@/components/singletons';
import { Data } from '@/pages/main/types';
export const registerIpcHandler = () => {
  ipcMain.handle(Channels.SAVE_DATA, async (event: any, arguments_: any) => {
    const data = arguments_.map((item: any) => ({customer_id: item['序号'], name: item['姓名'], level: item['评级']}))
    await databaseManager.saveAll(data)
    return true;
  })

  ipcMain.handle(
    Channels.GET_DATA,
    async (event, arguments_): Promise<{ data: Data[]; total: number } | undefined> => {
      try {
        const { data, total } = await databaseManager.getRowsByPage(arguments_);
        return { data, total };
      } catch (error: any) {
        console.error(error);
        event.sender.send(Channels.DATA_ERROR, error?.message);
      }
    }
  );
}
