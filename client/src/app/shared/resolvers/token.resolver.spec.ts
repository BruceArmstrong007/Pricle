import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tokenResolver } from './token.resolver';

describe('tokenResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tokenResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
