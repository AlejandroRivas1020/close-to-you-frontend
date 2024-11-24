export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  AddContact: { onContactAdded: () => void };
  ContactList: { refresh?: boolean };
  ContactDetails: { contactId: string };
  EditContact: { contactId: string };
};
