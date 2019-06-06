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

This isn't always desired behaviour. 
* A process within the business might dictate that only one user should be updating a record at one time.
* Form logic might execute on update of certain fields, that all users should be made aware of. Because form logic is client-side, users will not see this change unless they're notified to refresh the record.
* Users may be used to notification behaviour if they use other collaboration tools such as Microsoft Excel or [Confluence](https://www.atlassian.com/software/confluence).

### Features

 - Shows a form notification when the record you're viewing is modified by someone else
 - Shows the name of the user who modified the record in the notification
 - Polls for record modifications at a specified interval
 - Stops polling after half an hour if no other modifications are found

### Usage

#### 1. Import [getalong.min.js](https://github.com/camelCaseDave/get-along/blob/master/dist/getalong.min.js) into CRM as a JavaScript web resource

![alt text](https://i.imgur.com/rsDfteC.png)

#### 2. Include getalong.min.js as a form library.

Include it on the form you want to run it on (e.g. Account or Contact) by pressing "Form Properties" within the Form Editor.

![alt text](https://i.imgur.com/4m6HkxP.png)

#### 3. Register an OnLoad event handler on the form. 

Tick "Pass execution context as first parameter". Pass one parameter, a time in seconds, to wait between polling events to check for form updates from another user.

![alt text](https://i.imgur.com/XFFfQzu.png)

#### 4. Test it out. 

If the record you have open is modified and saved by another user, you'll receive a notification.

![alt text](https://i.imgur.com/jpjF7yD.gif)

### Considerations

 - *API Limits*: the number of API requests made by a user cannot exceed 4000 within a 5 minute timeframe, or 13 requests per second. `get-along` uses polling, which sends one API request per given, configurable time interval. Configure the time interval so that users do not reach the API limit. Consider that users often open multiple browser tabs.

### Contributing

Install with `npm install`

Build with `npm run build`. 
To build, you must install [rollup.js](https://rollupjs.org/guide/en) globally, which you can do using `npm install -g rollup`

 ### Backlog

  - Support interactive notifications with button options to "refresh the form", "hide notification" or "don't show notification again on current form"
  - Option to load a modal dialog instead of a notification banner using [Xrm.Navigation API](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-navigation)
  
---

> Photo credit: [Connor Wilkins](https://unsplash.com/photos/4dY4gxT9WOA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
