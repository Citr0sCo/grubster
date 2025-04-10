import * as jsonpath from 'jsonpath';

export class JsonPathHelper {
    public static apply(text: string, jsonPathQuery: string): string {
        try {
            const response = jsonpath.query(JSON.parse(text), jsonPathQuery) as [];

            if (!response) {
                return '';
            }

            return JSON.stringify(response, null, 4);
        } catch (e) {
            return '';
        }
    }
}
