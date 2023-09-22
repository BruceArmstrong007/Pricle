import { ComponentStore } from '@ngrx/component-store';
import { SearchUserDetails, SearchUsersCard, SearchUsersState } from './types';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';

@Injectable()
export class SearchUsersStore extends ComponentStore<SearchUsersState> {
  private readonly users = this.selectSignal((s) => s.users);
  private readonly isLoading = this.selectSignal((s) => s.isLoading);
  private readonly error = this.selectSignal((s) => s.error);
  private readonly name = this.selectSignal((s) => s.name);
  private readonly items = this.selectSignal((s) => s.items);
  private readonly store = inject(Store);
  private readonly contactIDs = this.store.selectSignal(
    contactsFeature.selectIds
  );
  readonly instance = this.selectSignal(
    this.users,
    this.isLoading,
    this.error,
    this.name,
    this.items,
    (users, isLoading, error, name, items) => ({
      users,
      isLoading,
      error,
      name,
      items,
    })
  );

  readonly nameEvent = this.select((s) => s.name);

  constructor() {
    super({
      users: [],
      isLoading: false,
      error: null,
      name: '',
      items: [
        {
          label: 'Send Request',
          key: SearchUsersCard.SEND,
          icon: 'send',
        },
      ],
    });
  }

  usersState = this.updater(
    (s: SearchUsersState, users: SearchUserDetails[]): SearchUsersState => ({
      ...s,
      users,
    })
  );

  nameState = this.updater(
    (s: SearchUsersState, name: string): SearchUsersState => ({
      ...s,
      name,
    })
  );

  loadingState = this.updater(
    (s: SearchUsersState, isLoading: boolean): SearchUsersState => ({
      ...s,
      isLoading,
    })
  );

  readonly SearchUsers = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly SearchUsersSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((res: any) => {
        const users = res?.users?.map((user: SearchUserDetails) => {
          const contacts: any[] = this.contactIDs();
          if (contacts) {
            const isExist = contacts?.find(
              (contactID: string | number) => contactID === user?._id
            );
            if (isExist) {
              return {
                ...user,
                isContact: true,
              };
            }
          }
          return user;
        });
        this.usersState(users);
        this.loadingState(false);
      })
    )
  );

  readonly SearchUsersFailure = this.effect((trigger$) =>
    trigger$.pipe(
      tap((err: any) => {
        this.loadingState(false);
      })
    )
  );
}
