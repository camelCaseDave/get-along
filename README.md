## Get Along in Dynamics 365
Notifies you when someone else modifies the form you're viewing. Helps prevent conflicts so everyone can get along.

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

If the form you have open is modified and saved by another user, you'll receive a notification.

![alt text](https://i.imgur.com/wrhTbHQ.png)
