# meteor/append-to-connection

As SockJS doesn't allow us to pass cookies and/or other data to the connection, we have to manually do that by calling a method to the meteor server.

This package is just a helper to do that.

## Usage
`AppendToConnection.register` register your hook. You must return an object with the fields you want to append.

```
import { AppendToConnection } from "meteor/append-to-connection";

AppendToConnection.register(() => {
    // your function here
    return {};
});
```

There are two types of hooks, the `onConnection` hook and the `onLogin` hook. You register both the same way, but the `onLogin` hook has different parameters:
```
// onLogin -> To know what is what, check the onLogin meteor docs: https://docs.meteor.com/api/accounts-multi.html#AccountsCommon-onLogin
AppendToConnection.register(({error, loginDetails}) => {});

// onConnection
AppendToConnection.register(() => {});
```
