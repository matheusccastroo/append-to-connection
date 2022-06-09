import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onLogin(({ connection, user }) => {
  const currentUserId = user._id;
  if (currentUserId) connection.userId = currentUserId;

  return connection;
});

Meteor.methods({
  appendDataToConnection(objectToAppend) {
    if (!objectToAppend) return;
    Object.assign(this.connection, objectToAppend);
  },
});
