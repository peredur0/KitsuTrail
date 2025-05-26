import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
    timeInput: 'HH:mm'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    timeInput: 'HH:mm',
    timeOptionLabel: 'HH:mm',
    monthYearLabel: 'YYYY-MM',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'YYYY-MM',
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      })
    ),
    provideHttpClient(),
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr' }
  ]
};
