import { Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchUsersStore } from './store/search-users.store';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { searchUsersActions } from 'src/app/stores/search-users/search-users.action';
import { ContactCardComponent } from 'src/app/shared/components/contact-card/contact-card.component';
import { NgFor, NgIf } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CardEvent } from 'src/app/shared/utils/types';
import { SearchUsersCard } from './store/types';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { contactsActions } from 'src/app/stores/contacts/contacts.action';
import { DividerModule } from 'primeng/divider';
import { User } from 'src/app/stores/user/user.model';

@Component({
  selector: 'app-search-users',
  standalone: true,
  imports: [InputTextModule, DividerModule, ContactCardComponent, NgFor, NgIf],
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss'],
})
export class SearchUsersComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly searchUsersStore = inject(SearchUsersStore);
  readonly state = this.searchUsersStore.instance;
  private readonly subscribe = new Subject();
  private ref: DynamicDialogRef | undefined;
  dialogService = inject(DialogService);

  constructor() {
    this.searchUsersStore.nameEvent
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.subscribe)
      )
      .subscribe((name: string) => {
        if (!name) {
          this.clear();
          return;
        }
        const queryParams = `name=${name}`;
        this.store.dispatch(searchUsersActions.searchUsers({ queryParams }));
      });
  }

  clear() {
    this.searchUsersStore.usersState([]);
    this.searchUsersStore.nameState('');
  }

  setName(event: any) {
    this.searchUsersStore.nameState(event?.target?.value);
  }

  clickCard(event: CardEvent) {
    switch (event.type) {
      case SearchUsersCard.SEND:
        this.requestPopup(event.contactID, event.type);
        break;
      default:
    }
  }

  requestPopup(contactID: string, key: SearchUsersCard) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to ' + key + ' this request !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        if (key === SearchUsersCard.SEND) {
          this.store.dispatch(contactsActions.sendRequest({ contactID }));
        }
      }
    });
  }

  trackBy(index: number, user: User): string {
    return user._id;
  }

  ngOnDestroy(): void {
    this.subscribe.complete();
    this.subscribe.unsubscribe();
  }
}
