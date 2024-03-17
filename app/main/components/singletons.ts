import StateManager from '@/store';
import StoreManager from '@/store/store';
import DatabaseManager from '@/pages/main/database';

const databaseManager = new DatabaseManager();
const stateManager = new StateManager();
const store = StoreManager.getInstance();

export {  stateManager, store, databaseManager };
