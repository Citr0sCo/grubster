import { ReplaySubject } from 'rxjs';
import { StorageKeys } from './storage.keys';

export class Store {
    private static _instance: Store;

    public static instance(): Store {
        if (!this._instance) {
            this._instance = new Store();
        }

        return this._instance;
    }

    public DATABASE_NAME: string = 'GrubsterDatabase';
    public DATABASE_VERSION: number = 2;
    public db: ReplaySubject<IDBDatabase> = new ReplaySubject<IDBDatabase>();
    private storageKeys: string[] = [StorageKeys.Suggestions, StorageKeys.History, StorageKeys.Tabs, StorageKeys.Collections, StorageKeys.Tests];

    private constructor() {
        const openDatabase = window.indexedDB.open(this.DATABASE_NAME, this.DATABASE_VERSION);
        openDatabase.onsuccess = (error: any) => this.handleSuccess(error);
        openDatabase.onerror = (error: any) => this.handleGlobalError(error);
        openDatabase.onupgradeneeded = (payload: any) => this.setupDatabase(payload);
    }

    private handleSuccess(event: any): void {
        console.info('Database is ready.');

        const database: IDBDatabase = event.target.result;
        this.db.next(database);

        database.onerror = (error: any) => this.handleError(error);
        database.onversionchange = (payload: any) => this.setupDatabase(payload);
    }

    private handleError(error: any): void {
        console.error('Database error.', error);
    }

    private handleGlobalError(error: any): void {
        console.error('Global database error occurred.', error);
    }

    private setupDatabase(event: any): void {
        console.info('Database will migrate.');

        const database: IDBDatabase = event.target.result;

        this.storageKeys.forEach((storageKey) => {
            if (!database.objectStoreNames.contains(storageKey)) {
                const objectStore = database.createObjectStore(storageKey, { keyPath: 'id' });
                objectStore.createIndex(`${storageKey}_id`, 'id', { unique: true });
            }
        });
    }
}
