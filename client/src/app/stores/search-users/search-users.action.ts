import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const searchUsersActions = createActionGroup({
  source: 'Search Users Actions',
  events: {
    SearchUsers: props<{ queryParams: string }>(),
    SearchUsersSuccess: emptyProps(),
    SearchUsersFailure: emptyProps(),
  },
});
