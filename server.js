import { Meteor } from 'meteor/meteor';

Meteor.methods({
  appendDataToConnection(objectToAppend) {
    if (!objectToAppend) return;
    Object.assign(this.connection, objectToAppend);
  },
});
