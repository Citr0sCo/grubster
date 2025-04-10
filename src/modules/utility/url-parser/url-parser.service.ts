export class UrlParser {
    public static getResource(fullUrl: string): string {
        const parsedName = this.parseURLName(fullUrl);
        return parsedName.resource === '' ? fullUrl : parsedName.resource;
    }

    public static getHost(fullUrl: string): string {
        const parsedName = this.parseURLName(fullUrl);
        return parsedName.resource === '' ? '' : parsedName.host;
    }

    private static parseURLName(urlString: string): any {
        if (!urlString) {
            return {
                host: '',
                resource: ''
            };
        }

        let parsed = {} as URL;

        try {
            parsed = new URL(urlString);
        } catch (e) {
            // invalid URL
        }

        if (parsed.protocol === null) {
            try {
                parsed = new URL(`http://${urlString}`);
            } catch (e) {
                // invalid URL
            }
        }

        if (parsed.hostname === null || parsed.hostname === '') {
            return {
                host: urlString,
                resource: ''
            };
        }

        const split = {
            host: parsed.hostname,
            resource: parsed.pathname?.substring(1, parsed.pathname.length)
        };

        return {
            host: split.host === null ? split.resource : split.host,
            resource: split.host === null ? '' : split.resource
        };
    }
}
