import '@angular/compiler';
import { Animations } from './animations';
import { BeautifyHelper } from './beautify.helper';
import { Copy } from './copy';
import { Guid } from './guid';
import { HttpVerbs } from './http-verbs';
import { JsonPathHelper } from './json-path.helper';

describe('core helpers', () => {
    describe('Animations', () => {
        it('creates each animation trigger', () => {
            expect(Animations.fadeIn().name).toBe('fadeIn');
            expect(Animations.slideInRight().name).toBe('slideIn');
            expect(Animations.slideInUp().name).toBe('slideInUp');
        });
    });

    describe('BeautifyHelper', () => {
        it('beautifies valid JSON', () => {
            expect(BeautifyHelper.beautify('{"name":"Grubster"}')).toBe('{\n    "name": "Grubster"\n}');
        });

        it('returns invalid JSON unchanged when beautifying', () => {
            expect(BeautifyHelper.beautify('not json')).toBe('not json');
        });

        it('uglifies a JSON encoded JSON string', () => {
            expect(BeautifyHelper.uglify('"{\\"name\\":\\"Grubster\\"}"')).toBe('{"name":"Grubster"}');
        });

        it('returns invalid JSON unchanged when uglifying', () => {
            expect(BeautifyHelper.uglify('not json')).toBe('not json');
        });
    });

    describe('Copy', () => {
        it('creates a deep copy without shared nested references', () => {
            const original = { nested: { value: 'original' } };
            const copy = Copy.deep(original);

            copy.nested.value = 'changed';

            expect(original.nested.value).toBe('original');
        });

        it('creates a shallow copy', () => {
            const original = { value: 'original' };
            const copy = Copy.shallow(original);

            expect(copy).toEqual(original);
            expect(copy).not.toBe(original);
        });
    });

    describe('Guid', () => {
        it('creates a version four UUID', () => {
            expect(Guid.new()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });
    });

    it('returns supported HTTP verbs', () => {
        expect(HttpVerbs.all()).toEqual(['get', 'post', 'put', 'patch', 'delete']);
    });

    describe('JsonPathHelper', () => {
        it('returns matching JSON values', () => {
            expect(JsonPathHelper.apply('{"items":[{"name":"one"},{"name":"two"}]}', '$.items[*].name')).toBe('[\n    "one",\n    "two"\n]');
        });

        it('returns an empty string for invalid input', () => {
            expect(JsonPathHelper.apply('not json', '$.items')).toBe('');
        });
    });
});
