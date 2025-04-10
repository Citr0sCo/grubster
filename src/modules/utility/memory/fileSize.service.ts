export class FileSizeService {
    public static memorySizeOf(obj: string): string {
        return this.formatByteSize(this.sizeOf(obj));
    }

    public static formatByteSize(bytes: number, binary: boolean = false, decimals: number = 1): string {
        const thresh = binary ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = binary ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** decimals;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return `${bytes.toFixed(decimals)} ${units[u]}`;
    }

    public static sizeOf(object: any): number {
        const objectList = [];
        const stack = [object];
        let bytes = 0;

        while (stack.length) {
            const value = stack.pop();

            if (typeof value === 'boolean') {
                bytes += 4;
            } else if (typeof value === 'string') {
                bytes += value.length * 2;
            } else if (typeof value === 'number') {
                bytes += 8;
            } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
                objectList.push(value);
                for (const i in value) {
                    if (value.hasOwnProperty(i)) {
                        stack.push(value[i]);
                    }
                }
            }
        }
        return bytes;
    }
}
