# Magic Message Functions

This is a server component for my MMM-MessageToMirror module, which is a module for MagicMirror. See my [magic](https://github.com/ottopaulsen/magic) repository for more information.

This component is a service used by the mirror to register, and used by the app to get available screens and to send messages.

## Installation

Clone the repository from github. 

In order to deploy to Firebase hosting, you need to init firebase:

```
firebase init functions
```

Select project and Typescript, but do not overwrite existing files.

Run npm install:

```
cd functions
npm install
```


Select functions, then select project and TypeScript.

## Run locally

```
tsc; firebase serve --only functions
```

Deploy command: 

```
firebase deploy --only functions
```

[Firebase Console](https://console.firebase.google.com/project/magic-acf51/overview)

Functions URL:
https://us-central1-magic-acf51.cloudfunctions.net/app/

## Authentication

In order to use this API, you must authenticate using Google Firebase Auth, and pass the Firebase ID Token in the Authorization http header like this:

```
'Authorization': 'Bearer <token>'
```

## API Reference

### POST /screens

Used by the MMM-MagicMessage MagicMirror module to register a new screen. Body contains:

``` json
{
    "name": "Mirror name from config",
    "emails": [
        "email 1",
        "email 2",
        ...
    ]
}
```

The email array is a list of legal users.

### POST /screens/:id/messages

Used by the app to send message to mirror. Body:
``` json
{
    "message": "The message to the mirror",
    "sentBy": "email",
    "lifetime": 60 // Minutes the message shall live
}
```

The :id is the screen id. The screen module is using a uuid for this.

### GET /screens

Used by the app to get the name and id of the screens that the authenticated user can send messages to. The result is an array of screen objects:

``` json
[
    {
        "name": "Screen display name",
        "key": "Unique screen key"
    },
    ...
]
```