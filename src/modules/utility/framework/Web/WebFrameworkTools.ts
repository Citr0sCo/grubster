export class WebFrameworkTools {
    public static downloadFile(fileName: string, data: any, indent?: boolean): void {
        const dataJson = JSON.stringify(data, null, indent ? 4 : 0);
        const blob = new Blob([dataJson], { type: 'text/json' });
        const element: HTMLElement = document.getElementById('download-anchor') as HTMLElement;
        element.setAttribute('href', window.URL.createObjectURL(blob));
        element.setAttribute('download', fileName);
        element.click();
        element.removeAttribute('href');
        element.removeAttribute('download');
    }
}
