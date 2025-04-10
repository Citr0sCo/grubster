export class FileNameService {
    public static fileSafeDate(date: Date): string {
        return date.toISOString().replace(/:/g, '-').split('.')[0];
    }
}
