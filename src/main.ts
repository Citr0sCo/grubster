import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { DEPLOY_URL } from './app/deploy-url';

if (environment.production) {
    enableProdMode();
}

const deployUrl = (() => {
    const scripts = document.getElementsByTagName('script');
    const index = scripts.length - 1;
    const mainScript = scripts[index];
    return mainScript.src.replace(/main.*?\.js$/, '');
})();

const DEPLOY_URL_PROVIDER = {
    provide: DEPLOY_URL,
    useValue: deployUrl
};

platformBrowserDynamic([DEPLOY_URL_PROVIDER])
    .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
    .catch((err) => console.error(err));
