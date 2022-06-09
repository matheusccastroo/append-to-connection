import { Meteor } from 'meteor/meteor';

class AppendToConnectionHooks {
  constructor() {
    this._callbacks = [];
  }
  register(cb) {
    if (!cb) return;
    this._callbacks.push(cb);
  }
  _reduceAll(...args) {
    const cbs = this._callbacks;
    if (!cbs.length) return;

    return cbs.reduce((acc, cb) => ({ ...acc, ...cb(...args) }), {});
  }
  _pushToServer(...args) {
    const objectToAppend = this._reduceAll(...args);
    Meteor.call('appendDataToConnection', objectToAppend);
  }
}

export const AppendToConnection = new AppendToConnectionHooks();

const oldStatus = new ReactiveVar(null);
Tracker.autorun(() => {
  const { status: currentStatus } = Meteor.status();
  const oldStatusValue = oldStatus.get();

  const isConnected = currentStatus === 'connected';
  const wasConnected = oldStatusValue === 'connected';

  if (currentStatus !== oldStatusValue) {
    oldStatus.set(currentStatus);
  }

  if (!wasConnected && isConnected) {
    AppendToConnection._pushToServer();
  }
});

import { Accounts } from 'meteor/accounts-base';
Accounts.onLogin(args => {
  if (args.error) return;
  AppendToConnection._pushToServer(...args);
});
