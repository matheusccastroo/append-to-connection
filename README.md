# meteor/append-to-connection

As SockJS doesn't allow us to pass cookies and/or other data to the connection, we have to manually do that by calling a method to the meteor server.
This is specially useful for cordova in multi tenant apps.
This package is just a helper to do that.

Note: don't use this for authentication. This should be used just for scopes/identification.

## Usage
`AppendToConnection.register` register your hook. You must return an object with the fields you want to append.

```
import { AppendToConnection } from "meteor/matheusccastro:append-to-connection";

AppendToConnection.register(() => {
    // your function here
    return {};
});
```

It's also good (but not required) to specify the allowed fields to be inserted (on server):
```
import { AppendToConnectionAllowedFields } from "meteor/matheusccastro:append-to-connection";

AppendToConnectionAllowedFields(['field1', 'field2'])
```
