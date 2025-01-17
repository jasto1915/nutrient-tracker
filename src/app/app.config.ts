import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {DatabaseService} from './database.service';
import {provideHttpClient} from '@angular/common/http';
import {ExternalAPIService} from './external-api.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), DatabaseService,provideHttpClient(),
    ExternalAPIService
  ]
};
