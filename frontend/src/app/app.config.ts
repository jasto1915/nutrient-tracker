import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

// No router: the whole app is one screen, which either shows the setup form or
// the tracker. Both services declare providedIn: 'root', so neither is listed
// here either.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
  ]
};
