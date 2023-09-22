import { searchUsersActions } from './search-users.action';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { exhaustMap, map, catchError, of } from 'rxjs';
import { API } from 'src/app/shared/utils/api.endpoints';
import { SearchUsersStore } from '../../sections/user/components/search-users/store/search-users.store';

export const searchUsers = createEffect(
  (
    searchUsersStore = inject(SearchUsersStore),
    actions$ = inject(Actions),
    apiService = inject(ApiService)
  ) => {
    return actions$.pipe(
      ofType(searchUsersActions.searchUsers),
      exhaustMap((params) => {
        searchUsersStore.SearchUsers();
        return apiService.request(API.SEARCHUSERS, null, params).pipe(
          map((response: any) => {
            searchUsersStore.SearchUsersSuccess(response);
            return searchUsersActions.searchUsersSuccess();
          }),
          catchError(({ error }) => {
            searchUsersStore.SearchUsersFailure(error);
            return of(searchUsersActions.searchUsersFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);
