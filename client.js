import { Meteor } from 'meteor/meteor';

const appendToConnectionDebugger = msg =>
  console.warn(`[APPEND-TO-CONNECTION] - ${msg}`);

class AppendToConnectionHooks {
  constructor() {
    this._hooks = [];
    this._hooksChanged = new Tracker.Dependency();
    this._isDebugEnabled = false;
  }

  register(hooks) {
    if (!hooks || (Array.isArray(hooks) && !hooks?.length)) return;
    this._hooks.push(hooks);
    this._hooksChanged.changed();
  }

  enableDebug() {
    this._isDebugEnabled = true;
  }

  _reduceAll() {
    const hooks = this._hooks;
    if (!hooks.length) return false;

    return hooks.reduce((acc, hook) => ({ ...acc, ...hook() }), {});
  }

  _pushToServer() {
    const objectToAppend = this._reduceAll();

    if (this._isDebugEnabled) {
      appendToConnectionDebugger(
        `Appending object: ${JSON.stringify(objectToAppend, undefined, 2)}`
      );
    }

    if (!objectToAppend) {
      return;
    }

    Meteor.call('appendDataToConnection', objectToAppend);
  }

  getHooks() {
    this._hooksChanged.depend();
    return this._hooks;
  }
}

export const AppendToConnection = new AppendToConnectionHooks();

const oldStatus = new ReactiveVar(null);
const oldHooksLength = new ReactiveVar(0);
Tracker.autorun(() => {
  const { status: currentStatus } = Meteor.status();
  const oldStatusValue = oldStatus.get();
  const oldHooksLengthValue = oldHooksLength.get();
  const currentHooksLength = AppendToConnection.getHooks()?.length;

  const isConnected = currentStatus === 'connected';
  const wasConnected = oldStatusValue === 'connected';

  if (currentStatus !== oldStatusValue) {
    oldStatus.set(currentStatus);
  }

  if (AppendToConnectionHooks._isDebugEnabled) {
    appendToConnectionDebugger({
      wasConnected,
      isConnected,
      currentHooksLength,
      oldHooksLengthValue,
    });
  }

  if (
    (!wasConnected && isConnected && !!currentHooksLength) ||
    (currentHooksLength !== oldHooksLengthValue && isConnected)
  ) {
    AppendToConnection._pushToServer();
  }
});
