export class Database {
    private static _instance: Database;

    private constructor() {
        if (!window.indexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
    }

    public static instance(): Database {
        if (!this._instance) {
            this._instance = new Database();
        }

        return this._instance;
    }

    public hasItem(storageKey: string): boolean {
        return !!localStorage.getItem(storageKey);
    }

    public getItem(storageKey: string): any {
        return JSON.parse(localStorage.getItem(storageKey));
    }

    public setItem(storageKey: string, payload: any): void {
        return localStorage.setItem(storageKey, JSON.stringify(payload));
    }
}
