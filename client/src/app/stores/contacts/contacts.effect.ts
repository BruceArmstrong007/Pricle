import { catchError, of, map, exhaustMap } from 'rxjs';
import { API } from 'src/app/shared/utils/api.endpoints';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { contactsActions } from './contacts.action';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { channelsActions } from '../channels/channels.action';
import { userFeature } from '../user/user.reducer';

export const contacts = createEffect(
  (actions$ = inject(Actions), apiService = inject(ApiService)) => {
    return actions$.pipe(
      ofType(contactsActions.contacts),
      exhaustMap((request) => {
        return apiService.request(API.CONTACTS, request).pipe(
          map((response: any) => {
            return contactsActions.contactsSuccess(response);
          }),
          catchError(({ error }) => {
            return of(contactsActions.contactsFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const removeContact = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    store = inject(Store),
    toastService = inject(MessageService)
  ) => {
    return actions$.pipe(
      ofType(contactsActions.removeContact),
      exhaustMap((request) => {
        return apiService.request(API.REMOVECONTACT, request).pipe(
          map((response: any) => {
            toast(
              toastService,
              'success',
              'Success',
              'Contact removed successfully.'
            );
            store.dispatch(contactsActions.contacts());
            const user = store.selectSignal(userFeature.selectDetails);
            store.dispatch(
              channelsActions.removeRoom({
                roomID: generateRoomIDs(user()?._id as string, request?.contactID),
              })
            );
            return contactsActions.removeContactSuccess(response);
          }),
          catchError(({ error }) => {
            toast(
              toastService,
              'error',
              'Error',
              error?.message ?? 'Error while removing contact'
            );
            return of(contactsActions.removeContactFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const acceptRequest = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    apiService = inject(ApiService),
    toastService = inject(MessageService)
  ) => {
    return actions$.pipe(
      ofType(contactsActions.acceptRequest),
      exhaustMap((request) => {
        return apiService.request(API.ACCEPTREQUEST, request).pipe(
          map((response: any) => {
            toast(
              toastService,
              'success',
              'Success',
              'Friend request accepted.'
            );
            store.dispatch(contactsActions.contacts());
            return contactsActions.acceptRequestSuccess(response);
          }),
          catchError(({ error }) => {
            toast(
              toastService,
              'error',
              'Error',
              error?.message ?? 'Error while accepting friend request.'
            );
            return of(contactsActions.acceptRequestFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const declineRequest = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    apiService = inject(ApiService),
    toastService = inject(MessageService)
  ) => {
    return actions$.pipe(
      ofType(contactsActions.declineRequest),
      exhaustMap((request) => {
        return apiService.request(API.DECLINEREQUEST, request).pipe(
          map((response: any) => {
            toast(
              toastService,
              'success',
              'Success',
              'Friend request declined.'
            );
            store.dispatch(contactsActions.contacts());
            return contactsActions.declineRequestSuccess(response);
          }),
          catchError(({ error }) => {
            toast(
              toastService,
              'error',
              'Error',
              error?.message ?? 'Error while accepting friend request.'
            );
            return of(contactsActions.declineRequestFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const sendRequest = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    store = inject(Store),
    toastService = inject(MessageService)
  ) => {
    return actions$.pipe(
      ofType(contactsActions.sendRequest),
      exhaustMap((request) => {
        return apiService.request(API.SENDREQUEST, request).pipe(
          map((response: any) => {
            toast(toastService, 'success', 'Success', 'Friend request sent.');
            store.dispatch(contactsActions.contacts());
            return contactsActions.sendRequestSuccess(response);
          }),
          catchError(({ error }) => {
            toast(
              toastService,
              'error',
              'Error',
              error?.message ?? 'Error while sending friend request.'
            );
            return of(contactsActions.sendRequestFailure);
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const cancelRequest = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    apiService = inject(ApiService),
    toastService = inject(MessageService)
  ) => {
    return actions$.pipe(
      ofType(contactsActions.cancelRequest),
      exhaustMap((request) => {
        return apiService.request(API.CANCELREQUEST, request).pipe(
          map((response: any) => {
            toast(
              toastService,
              'success',
              'Success',
              'Friend request cancelled.'
            );
            store.dispatch(contactsActions.contacts());
            return contactsActions.cancelRequestSuccess(response);
          }),
          catchError(({ error }) => {
            toast(
              toastService,
              'error',
              'Error',
              error?.message ?? 'Error while cancelling friend request.'
            );
            return of(contactsActions.acceptRequestFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const seenContact = createEffect(
  (
    store = inject(Store),
    actions$ = inject(Actions),
    apiService = inject(ApiService)
  ) => {
    return actions$.pipe(
      ofType(contactsActions.seenContact),
      exhaustMap(({ request }) => {
        return apiService.request(API.SEENCONTACT, request).pipe(
          map((response: any) => {
            store.dispatch(contactsActions.contacts());
            return contactsActions.seenContactSuccess(response);
          }),
          catchError(({ error }) => {
            return of(contactsActions.seenContactFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

const toast = (
  toastService: MessageService,
  severity: 'success' | 'error',
  summary: string,
  detail: string
) => {
  toastService.add({
    severity,
    summary,
    detail,
  });
};

function generateRoomIDs(id1: string, id2: string): string {
  return [id1, id2].sort().join('-');
}
