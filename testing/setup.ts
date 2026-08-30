import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { type Provider, type Type } from '@angular/core';

/**
 * Nearly every component pulls in <syn-icon>, which loads its SVG over
 * HttpClient: without the provider the view fails to create with NG0201.
 */
export async function setupComponent<T>(component: Type<T>, providers: Provider[] = []) {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [provideHttpClient(), provideHttpClientTesting(), ...providers],
  }).compileComponents();

  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();

  return fixture;
}
