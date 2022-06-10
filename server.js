import { Meteor } from 'meteor/meteor';

let allowedFields;
export const AppendToConnectionAllowedFields = fields => {
  if (!Array.isArray(fields) || !fields?.length) {
    throw new Meteor.Error(
      '[APPEND-TO-CONNECTION] - Invalid value passed to allowed fields in appendToConnection package.'
    );
  }

  allowedFields = [...new Set(fields)];
};

Meteor.methods({
  appendDataToConnection(objectToAppend) {
    if (!objectToAppend || this.isSimulation) return;

    let valuesToAppend = objectToAppend;
    if (allowedFields?.length) {
      valuesToAppend = Object.fromEntries(
        allowedFields.map(f => [f, objectToAppend[f]]).filter(([, v]) => !!v)
      );
    }

    Object.assign(this.connection, valuesToAppend);
  },
});
