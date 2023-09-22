import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ContactDetails, ContactsState } from './contacts.model';
import { contactsActions } from './contacts.action';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ContactStatus, ContactType } from 'src/app/shared/utils/variables';

const adaptor: EntityAdapter<ContactDetails> =
  createEntityAdapter<ContactDetails>({
    selectId: (s: ContactDetails) => s._id,
  });

const initialState: ContactsState = adaptor.getInitialState({
  isLoading: false,
});

export const contactsFeature = createFeature({
  name: 'contacts',
  reducer: createReducer(
    initialState,
    on(
      contactsActions.contacts,
      contactsActions.acceptRequest,
      contactsActions.cancelRequest,
      contactsActions.declineRequest,
      contactsActions.removeContact,
      contactsActions.sendRequest,
      (state): ContactsState => ({ ...state, isLoading: true })
    ),
    on(
      contactsActions.contactsFailure,
      contactsActions.acceptRequestFailure,
      contactsActions.cancelRequestFailure,
      contactsActions.sendRequestFailure,
      contactsActions.removeContactFailure,
      contactsActions.declineRequestFailure,
      (state): ContactsState => ({ ...state, isLoading: false })
    ),
    on(
      contactsActions.contactsSuccess,
      (state, action): ContactsState =>
        adaptor.setAll(action?.contacts, { ...state, isLoading: false })
    ),
    on(
      contactsActions.acceptRequestSuccess,
      contactsActions.cancelRequestSuccess,
      contactsActions.declineRequestSuccess,
      contactsActions.removeContactSuccess,
      contactsActions.sendRequestSuccess,
      (state): ContactsState => ({ ...state, isLoading: false })
    ),
    on(
      contactsActions.resetState,
      (state): ContactsState => ({ ...state, ...initialState })
    )
  ),
  extraSelectors: ({ selectContactsState }) => {
    const selectors = adaptor.getSelectors(selectContactsState);
    const selectAll = selectors.selectAll;
    return {
      ...selectors,
      friendsList: createSelector(selectAll, (selectAll) => {
        return [
          ...selectAll.filter(
            (contact) =>
              contact.status === ContactStatus.ACCEPTED ||
              contact.status === ContactStatus.FRIENDS
          ),
        ];
      }),
      friendsIDs: createSelector(selectAll, (selectAll) => {
        return [
          ...selectAll.filter(
            (contact) =>
              contact.status === ContactStatus.ACCEPTED ||
              contact.status === ContactStatus.FRIENDS
          ).flatMap((friend) => friend?._id),
        ];
      }),
      sentRequestList: createSelector(selectAll, (selectAll) => {
        return [
          ...selectAll.filter(
            (contact) =>
              (contact.status === ContactStatus.SENT ||
                contact.status === ContactStatus.RECEIVED) &&
              contact.type === ContactType.RECEIVER
          ),
        ];
      }),
      receivedRequestList: createSelector(selectAll, (selectAll) => {
        return [
          ...selectAll.filter(
            (contact) =>
              (contact.status === ContactStatus.SENT ||
                contact.status === ContactStatus.RECEIVED) &&
              contact.type === ContactType.SENDER
          ),
        ];
      }),
      acceptedCount: createSelector(selectAll, (selectAll) => {
        const accepted = [
          ...selectAll.filter(
            (contact) =>
              contact.type === ContactType.RECEIVER &&
              contact.status === ContactStatus.ACCEPTED
          ),
        ];
        return accepted?.length;
      }),
      receivedCount: createSelector(selectAll, (selectAll) => {
        const received = [
          ...selectAll.filter(
            (contact) =>
              contact.type === ContactType.SENDER &&
              contact.status === ContactStatus.SENT
          ),
        ];
        return received?.length;
      }),
      friendListIDs: createSelector(selectAll, (selectAll) => {
        return [
          ...selectAll
            .filter(
              (contact) =>
                contact.status === ContactStatus.ACCEPTED ||
                contact.status === ContactStatus.FRIENDS
            )
            .flatMap((contact) => contact?._id),
        ];
      }),
    };
  },
});
