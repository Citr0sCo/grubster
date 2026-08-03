import { firstValueFrom, of } from 'rxjs';
import { TestCaseMapper } from '../../app/sidebar/tests-view/mappers/test-case.mapper';
import { CurlParserService } from './curl-parser/curl-parser.service';
import { FileNameService } from './filename/file-name.service';
import { FileSizeService } from './memory/fileSize.service';
import { timeoutWhen } from './operators/timeout-when';
import { UrlParser } from './url-parser/url-parser.service';

describe('utility services', () => {
    describe('CurlParserService', () => {
        it('parses the URL, method, headers, and body from curl', () => {
            const curl = 'curl https://example.com/items \\ -X POST \\ -H \'Content-Type: application/json\' \\ --data-raw \'{"name":"item"}\'';
            const result = new CurlParserService().parseCurl(curl);

            expect(result).toEqual({
                url: 'https://example.com/items',
                method: 'post',
                headers: [{ key: 'Content-Type', value: 'application/json' }],
                body: '{\n    "name": "item"\n}'
            });
        });

        it('keeps default values when no optional curl arguments are provided', () => {
            expect(new CurlParserService().parseCurl('curl https://example.com')).toEqual({
                url: 'https://example.com',
                method: 'GET',
                headers: [],
                body: ''
            });
        });
    });

    describe('FileNameService', () => {
        it('formats a date without colons or milliseconds', () => {
            expect(FileNameService.fileSafeDate(new Date('2026-08-01T12:50:35.727Z'))).toBe('2026-08-01T12-50-35');
        });
    });

    describe('FileSizeService', () => {
        it('calculates the memory size of primitive values', () => {
            expect(FileSizeService.sizeOf({ flag: true, text: 'ab', count: 1 })).toBe(16);
            expect(FileSizeService.memorySizeOf('abc')).toBe('6 B');
        });

        it('avoids counting the same object twice', () => {
            const shared = { value: 'shared' };

            expect(FileSizeService.sizeOf({ first: shared, second: shared })).toBe(12);
        });

        it('formats decimal and binary byte units', () => {
            expect(FileSizeService.formatByteSize(1024)).toBe('1.0 KiB');
            expect(FileSizeService.formatByteSize(1000, true)).toBe('1.0 kB');
            expect(FileSizeService.formatByteSize(12, false, 0)).toBe('12 B');
        });
    });

    describe('UrlParser', () => {
        it('extracts host and resource from a URL', () => {
            expect(UrlParser.getHost('https://example.com/items')).toBe('example.com');
            expect(UrlParser.getResource('https://example.com/items')).toBe('items');
        });

        it('returns empty host and original resource for an empty URL', () => {
            expect(UrlParser.getHost('')).toBe('');
            expect(UrlParser.getResource('')).toBe('');
        });
    });

    describe('TestCaseMapper', () => {
        it('maps test case request data to a tab', () => {
            const testCase = {
                id: 'test-id',
                name: 'Get items',
                url: 'https://example.com/items',
                method: 'get',
                request: { body: '', headers: [], auth: {} },
                response: { body: '', headers: [], statusCode: 200 }
            } as any;

            expect(TestCaseMapper.map(testCase)).toEqual({
                id: testCase.id,
                name: testCase.name,
                url: testCase.url,
                method: testCase.method,
                request: testCase.request,
                response: testCase.response
            });
        });
    });

    describe('timeoutWhen', () => {
        it('passes through values when the condition is false', async () => {
            await expect(firstValueFrom(of('value').pipe(timeoutWhen(false, 1)))).resolves.toBe('value');
        });

        it('emits values before the timeout when the condition is true', async () => {
            await expect(firstValueFrom(of('value').pipe(timeoutWhen(true, 1000)))).resolves.toBe('value');
        });
    });
});
