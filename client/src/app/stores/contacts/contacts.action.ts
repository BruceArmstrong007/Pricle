import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ContactDetails, SeenContact } from './contacts.model';

export const contactsActions = createActionGroup({
  source: 'Contacts Actions',
  events: {
    Contacts: emptyProps(),
    ContactsSuccess: props<{ contacts: ContactDetails[] }>(),
    ContactsFailure: emptyProps(),
    RemoveContact: props<{ contactID: string }>(),
    RemoveContactSuccess: props<{ contactID: string }>(),
    RemoveContactFailure: emptyProps(),
    SendRequest: props<{ contactID: string }>(),
    SendRequestSuccess: props<{ contactID: string }>(),
    SendRequestFailure: emptyProps(),
    CancelRequest: props<{ contactID: string }>(),
    CancelRequestSuccess: props<{ contactID: string }>(),
    CancelRequestFailure: emptyProps(),
    AcceptRequest: props<{ contactID: string }>(),
    AcceptRequestSuccess: props<{ contactID: string }>(),
    AcceptRequestFailure: emptyProps(),
    DeclineRequest: props<{ contactID: string }>(),
    DeclineRequestSuccess: props<{ contactID: string }>(),
    DeclineRequestFailure: emptyProps(),
    SeenContact: props<{ request: SeenContact }>(),
    SeenContactSuccess: props<{ contactID: string }>(),
    SeenContactFailure: emptyProps(),

    ResetState: emptyProps(),

  },
});
