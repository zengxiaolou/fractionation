
declare global {
  interface Window {
    ipc: {
      saveData: (data: any) => Promise<boolean>;
      getData: (query: any) => Promise<{ data: any[]; total: number } | undefined>;
    };
  }
}

export {};
