import { Meteor } from 'meteor/meteor';

class AppendToConnectionHooks {
  constructor() {
    this._hooks = [];
    this._hooksChanged = new Tracker.Dependency();
  }
  register(hooks) {
    if (!hooks || (Array.isArray(hooks) && !hooks?.length)) return;
    this._hooks.push(hooks);
    this._hooksChanged.changed();
  }
  _reduceAll() {
    const hooks = this._hooks;
    if (!hooks.length) return;

    return hooks.reduce((acc, hook) => ({ ...acc, ...hook() }), {});
  }
  _pushToServer() {
    const objectToAppend = this._reduceAll();
    Meteor.call('appendDataToConnection', objectToAppend);
  }
  getHooks() {
    this._hooksChanged.depend();
    return this._hooks;
  }
}

export const AppendToConnection = new AppendToConnectionHooks();

const oldStatus = new ReactiveVar(null);
Tracker.autorun(() => {
  const { status: currentStatus } = Meteor.status();
  const oldStatusValue = oldStatus.get();
  const hasHooks = !!AppendToConnection.getHooks()?.length;

  const isConnected = currentStatus === 'connected';
  const wasConnected = oldStatusValue === 'connected';

  if (currentStatus !== oldStatusValue) {
    oldStatus.set(currentStatus);
  }

  if (!wasConnected && isConnected && hasHooks) {
    AppendToConnection._pushToServer();
  }
});
