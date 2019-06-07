<p align="center"><a href="#" target="_blank" rel="noopener noreferrer">
            <img width="550" src="https://i.imgur.com/npeIQxD.png" alt="get-along.js"></a></p>

<p align="center"><b>Get along</b> in Dynamics 365</p>
<p align="center">
    <a href="https://travis-ci.com/camelCaseDave/get-along"><img
            src="https://img.shields.io/travis/camelCaseDave/get-along/master.svg?style=flat-square"
            alt="Build Status"></a>
    <a href="https://unpkg.com/get-along-xrm/dist/getalong.min.js"><img src="http://img.badgesize.io/https://unpkg.com/get-along-xrm/dist/getalong.min.js?compression=gzip&style=flat-square" alt="Gzip Size"></a>
    <a href="https://github.com/camelcasedave/get-along/blob/master/LICENSE"><img
            src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="License"></a>    
</p>

> Get Along notifies you when someone else modifies the record you're viewing. Helps prevent conflicts so everyone can get along.

---

Dynamics 365 encourages concurrent record usage between users. If two users modify and save the same record at the same time, the resulting record in the database is a combination of the two sets of changes. If the users modified the same field, the resulting value in the database comes from whichever user last saved the record.

This isn't always desired behaviour;
* A process within the business might dictate that only one user should be updating a record at one time.
* Form logic might execute on update of certain fields, that all users should be made aware of. Because form logic is client-side, users will not see this change unless they're notified to refresh the record.
* Users may be used to notification behaviour if they use other collaboration tools such as Microsoft Excel or [Confluence](https://www.atlassian.com/software/confluence).

### 1. Usage

`Get Along` can be customised to <b>poll</b> for changes at a set time interval, or to check for changes <b>on-demand</b> e.g. a button click, or when the record is saved.

You can also customise whether to notify users with either a simple, non-intrusive <b>notification</b> banner or with a <b>dialog box</b>.

#### Polling

To poll for changes, add `getalong.min.js` as a form library, and register an event handler on load of the form:

* Function: `GetAlong.pollForConflicts`
* Tick "pass `executionContext` as first parameter".
* Pass config parameter as described below.

#### On-demand

To check for changes on-demand, add `getalong.min.js` as a form library, and register an event handler on change of a field, on save of the form or include as part of a ribbon button command:

* Function: `GetAlong.checkForConflicts`
* Tick "pass `executionContext` as first parameter".
* Pass config paramater as described below.

#### Notification

To notify users of a change with a simple notification, just pass an object with the `timeout` property; a number which specifies how long `Get Along` should wait between polls. If you're running on-demand, you don't need to pass anything.

##### Example

![alt-text](https://i.imgur.com/k5fpFeJ.png)

##### Demo

![alt-text](https://i.imgur.com/Upn8uVC.gif)

#### Dialog

To notify users of a change with a dialog box, pass an object as your config parameter:

* `timeout`: duration in seconds to timeout between poll operations.
* `confirmDialog`: (optional) true to show a confirm dialog when a conflict is found, otherwise shows a form notification. False by default.
* `confirmStrings`: optional, but required if confirmDialog is true. An object containing the strings to be used in the confirmation dialog.
* `subtitle`: (optional) the subtitle to be displayed in the confirmation dialog.
* `text`: the message to be displayed in the confirmation dialog.
* `title`: (optional) the title to be displayed in the confirmation dialog.

##### Example

![alt-text](https://i.imgur.com/rvAQ3wn.png)

```js
{
    "timeout": 1,
    "confirmDialog": true,
    "confirmStrings": { 
        "subtitle": "This record has been modified by another user.",
        "text": "Your changes will not be saved. Please refresh to see the latest changes.",
        "title": "Form conflict"
    }
}
```

##### Demo

![alt-text](https://i.imgur.com/DuPzEZM.gif)

### 2. Considerations

 - *API Limits*: the number of API requests made by a user cannot exceed 4000 within a 5 minute timeframe, or 13 requests per second. `Get Along` uses polling, which sends one API request per given, configurable time interval. Configure the time interval so that users do not reach the API limit. Consider that users often open multiple browser tabs.

### 3. Contributing

Install with `npm install`

Build with `npm run build`. 
To build, you must install [rollup.js](https://rollupjs.org/guide/en) globally, which you can do using `npm install -g rollup`

---

> Photo credit: [Connor Wilkins](https://unsplash.com/photos/4dY4gxT9WOA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
