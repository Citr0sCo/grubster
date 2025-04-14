export class BeautifyHelper {
    public static beautify(request: string): string {
        try {
            request = JSON.stringify(JSON.parse(request), null, 4);
        } catch (e) {
            //console.info('Failed to prettify.', request, e);
            return request;
        }

        return request;
    }

    public static uglify(request: string): string {
        try {
            request = JSON.stringify(JSON.parse(JSON.parse(request)));
        } catch (e) {
            //console.info('Failed to uglify.', request, e);
            return request;
        }

        return request;
    }
}
