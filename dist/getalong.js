var GetAlong = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var DialogUi = /** @class */ (function () {
        function DialogUi() {
            this.defaultHeight = 200;
            this.defaultWidth = 450;
            this.defaultConfirmButtonLabel = "Refresh";
            this.defaultCancelButtonLabel = "Close";
        }
        return DialogUi;
    }());

    var Dialog = /** @class */ (function () {
        function Dialog(confirmStrings, formContext, metadata) {
            this.confirmStrings = confirmStrings;
            this.ui = new DialogUi();
            this.callback = this.getCallback(formContext, metadata);
        }
        /**
         * Opens a confirm dialog to notify user of a form conflict and prevent them from making further changes.
         */
        Dialog.prototype.open = function (confirmCallback, cancelCallback) {
            var confirmOptions = { height: this.ui.defaultHeight, width: this.ui.defaultWidth };
            var confirmStrings = this.getConfirmStringsWithDefaults();
            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(function (success) {
                if (success.confirmed) {
                    confirmCallback();
                }
                else {
                    cancelCallback();
                }
            });
        };
        Dialog.prototype.getCallback = function (formContext, metadata) {
            var _this = this;
            return function () { return _this.open(function () {
                Xrm.Navigation.openForm({ entityId: metadata.entityId, entityName: metadata.entityName });
            }, function () {
                formContext.ui.close();
            }); };
        };
        Dialog.prototype.getConfirmStringsWithDefaults = function () {
            var confirmStringsWithDefaults = {
                cancelButtonLabel: this.ui.defaultCancelButtonLabel,
                confirmButtonLabel: this.ui.defaultConfirmButtonLabel,
                subtitle: this.confirmStrings.subtitle,
                text: this.confirmStrings.text,
                title: this.confirmStrings.title,
            };
            return confirmStringsWithDefaults;
        };
        return Dialog;
    }());

    var Notification = /** @class */ (function () {
        function Notification(text, formContext) {
            this.formContext = formContext;
            this.text = text;
            this.callback = this.getCallback();
        }
        /**
         * Sets a form notification to notify user of a form conflict.
         */
        Notification.prototype.setFormNotification = function () {
            this.formContext.ui.setFormNotification(this.text, "INFO", "GetAlongNotification");
        };
        Notification.prototype.getCallback = function () {
            var _this = this;
            return function () { return _this.setFormNotification(); };
        };
        return Notification;
    }());

    var Processor = /** @class */ (function () {
        function Processor() {
        }
        /**
         * Returns modifiedon date as a readable, user locale string.
         * @param apiResponse CRM API response that includes "modifiedon" column.
         */
        Processor.processModifiedOnDate = function (apiResponse) {
            var modifiedOnDate = (apiResponse && apiResponse.modifiedon)
                ? new Date(apiResponse.modifiedon).toDateString() + "," +
                    (" " + new Date(apiResponse.modifiedon).toLocaleTimeString())
                : this.defaultModifiedOnTime;
            return modifiedOnDate;
        };
        /**
         * Returns modified by user's full name.
         * @param apiResponse CRM API response that includes expanded "modifiedby.fullname" column.
         */
        Processor.processModifiedByUser = function (apiResponse) {
            var modifiedByUser = (apiResponse && apiResponse.modifiedby && apiResponse.modifiedby.fullname)
                ? apiResponse.modifiedby.fullname
                : this.defaultModifiedByUser;
            return modifiedByUser;
        };
        Processor.defaultModifiedByUser = "another user";
        Processor.defaultModifiedOnTime = "the same time";
        return Processor;
    }());

    var Query = /** @class */ (function () {
        function Query() {
        }
        /**
         * Calls CRM API and returns the given entity's modified on date.
         * @param entityName schema name of the entity to query.
         * @param entityId id of the entity to query.
         */
        Query.getLatestModifiedOn = function (formContext, entityName, entityId) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    this.entityId = this.entityId || entityId || formContext.data.entity.getId();
                    this.entityName = this.entityName || entityName || formContext.data.entity.getEntityName();
                    return [2 /*return*/, Xrm.WebApi.retrieveRecord(this.entityName, this.entityId, "?$select=modifiedon&$expand=modifiedby($select=fullname)").then(function (response) {
                            return response;
                        })];
                });
            });
        };
        return Query;
    }());

    var Data = /** @class */ (function () {
        function Data(formContext) {
            this.formContext = formContext;
            this.addResetOnSave();
        }
        /**
         * Gets the form modified on date. Calls CRM API if modified on attribute is not on the form.
         */
        Data.prototype.getModifiedOn = function () {
            return __awaiter(this, void 0, Promise, function () {
                var modifiedOn, modifiedOnAttribute, apiResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            modifiedOnAttribute = this.formContext.getAttribute("modifiedon");
                            if (!modifiedOnAttribute) return [3 /*break*/, 1];
                            modifiedOn = modifiedOnAttribute.getValue();
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, Query.getLatestModifiedOn(this.formContext)];
                        case 2:
                            apiResponse = _a.sent();
                            modifiedOn = apiResponse.modifiedon;
                            _a.label = 3;
                        case 3:
                            this.initialModifiedOn = modifiedOn;
                            return [2 /*return*/, modifiedOn];
                    }
                });
            });
        };
        /**
         * Gets modified on from CRM server. Returns true if it has changed, and notifies the user.
         */
        Data.prototype.checkIfModifiedOnHasChanged = function (notificationCallback) {
            return __awaiter(this, void 0, Promise, function () {
                var _a, _b, apiResponse, modifiedOnHasChanged;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this;
                            _b = this.initialModifiedOn;
                            if (_b) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getModifiedOn()];
                        case 1:
                            _b = (_c.sent());
                            _c.label = 2;
                        case 2:
                            _a.initialModifiedOn = _b;
                            return [4 /*yield*/, Query.getLatestModifiedOn(this.formContext)];
                        case 3:
                            apiResponse = _c.sent();
                            this.latestModifiedBy = Processor.processModifiedByUser(apiResponse);
                            this.latestModifiedOn = Processor.processModifiedOnDate(apiResponse);
                            modifiedOnHasChanged = apiResponse.modifiedon &&
                                (new Date(apiResponse.modifiedon) > new Date(this.initialModifiedOn))
                                ? true : false;
                            if (modifiedOnHasChanged) {
                                notificationCallback();
                            }
                            return [2 /*return*/, modifiedOnHasChanged];
                    }
                });
            });
        };
        /**
         * Resets modified on cache when form is saved.
         */
        Data.prototype.addResetOnSave = function () {
            var _this = this;
            this.formContext.data.entity.addOnSave(function () {
                _this.initialModifiedOn = undefined;
            });
        };
        return Data;
    }());

    var Metadata = /** @class */ (function () {
        function Metadata(formContext) {
            this.entityId = formContext.data.entity.getId();
            this.entityName = formContext.data.entity.getEntityName();
        }
        return Metadata;
    }());

    var Form = /** @class */ (function () {
        function Form(executionContext, showDialog, confirmStrings) {
            this.formContext = executionContext.getFormContext();
            this.data = new Data(this.formContext);
            this.metadata = new Metadata(this.formContext);
            this.setDialog(showDialog, confirmStrings);
            this.setNotification(showDialog);
        }
        /**
         * Reloads the form.
         */
        Form.prototype.reload = function () {
            var entityId = this.formContext.data.entity.getId();
            var entityName = this.formContext.data.entity.getEntityName();
            Xrm.Navigation.openForm({ entityId: entityId, entityName: entityName });
        };
        /**
         * Prevents form attributes from being submitted when the record is saved.
         */
        Form.prototype.preventSave = function () {
            this.formContext.data.entity.attributes.forEach(function (attribute) {
                attribute.setSubmitMode("never");
            });
        };
        /**
         * Returns true if the form type is not create or undefined.
         */
        Form.prototype.isValid = function () {
            var formType = this.formContext.ui.getFormType();
            return formType !== undefined &&
                formType !== 0 &&
                formType !== 1;
        };
        Form.prototype.setDialog = function (showDialog, confirmStrings) {
            var _this = this;
            if (showDialog === true && confirmStrings !== undefined) {
                this.dialog = new Dialog(confirmStrings, this.formContext, this.metadata);
                this.notifyUserCallback = function () {
                    _this.preventSave();
                    _this.dialog.callback();
                };
            }
            else {
                console.error("Get Along has been configured incorrectly. Show dialog has been selected but no confirm strings have been passed.");
            }
        };
        Form.prototype.setNotification = function (showDialog) {
            var _this = this;
            if (showDialog === undefined || showDialog === false) {
                var notificationText = "This form has been modified by " + this.data.latestModifiedBy + " at " + this.data.latestModifiedOn + ". Refresh the form to see latest changes.";
                this.notification = new Notification(notificationText, this.formContext);
                this.notifyUserCallback = function () {
                    _this.preventSave();
                    _this.notification.callback();
                };
            }
        };
        return Form;
    }());

    var Poll = /** @class */ (function () {
        function Poll() {
        }
        /**
         * Polls a function every specified number of seconds until it returns true or timeout is reached.
         * @param fn callback Promise to poll.
         * @param timeout seconds to continue polling for.
         * @param interval seconds between polling calls.
         */
        Poll.poll = function (fn, timeout, interval) {
            return __awaiter(this, void 0, Promise, function () {
                var endTime, checkCondition;
                var _this = this;
                return __generator(this, function (_a) {
                    endTime = Number(new Date()) + (timeout * 1000);
                    checkCondition = function (resolve, reject) {
                        var callback = fn();
                        callback.then(function (response) {
                            if (response === true) {
                                resolve(response);
                            }
                            else if (Number(new Date()) < endTime) {
                                setTimeout(checkCondition.bind(_this), interval * 1000, resolve, reject);
                            }
                            else {
                                reject(console.log("GetAlong has been polling for 30 minutes and will stop now."));
                            }
                        });
                    };
                    return [2 /*return*/, new Promise(checkCondition)];
                });
            });
        };
        return Poll;
    }());

    var GetAlong = /** @class */ (function () {
        function GetAlong() {
        }
        /**
         * Loads Get Along.
         * @param executionContext passed by default from Dynamics CRM form.
         * @param timeout duration in seconds to timeout between poll operations.
         */
        GetAlong.load = function (executionContext, config) {
            return __awaiter(this, void 0, Promise, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            this.config = config;
                            this.executionContext = executionContext;
                            this.form = new Form(this.executionContext, config.confirmDialog, config.confirmStrings);
                            if (!this.form.isValid()) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.form.data.getModifiedOn()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.pollForModifications(this.form.notifyUserCallback)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error("getalong.js has encountered an error. " + e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Polls for modifications to the current form.
         * @param executionContext passed by default from Dynamics CRM form.
         * @param timeout duration in seconds to timeout between poll operations.
         */
        GetAlong.pollForModifications = function (notificationCallback) {
            return __awaiter(this, void 0, Promise, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    Poll.poll(function () { return _this.form.data.checkIfModifiedOnHasChanged(notificationCallback); }, 1800 / this.config.timeout, this.config.timeout);
                    return [2 /*return*/];
                });
            });
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9ub3RpZmljYXRpb24vRGlhbG9nVWkudHMiLCIuLi9zcmMvbm90aWZpY2F0aW9uL0RpYWxvZy50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vTm90aWZpY2F0aW9uLnRzIiwiLi4vc3JjL1Byb2Nlc3Nvci50cyIsIi4uL3NyYy9RdWVyeS50cyIsIi4uL3NyYy9mb3JtL0RhdGEudHMiLCIuLi9zcmMvZm9ybS9NZXRhZGF0YS50cyIsIi4uL3NyYy9mb3JtL0Zvcm0udHMiLCIuLi9zcmMvUG9sbC50cyIsIi4uL3NyYy9HZXRBbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBEaWFsb2dVaSB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdEhlaWdodDogbnVtYmVyID0gMjAwO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRXaWR0aDogbnVtYmVyID0gNDUwO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRDb25maXJtQnV0dG9uTGFiZWw6IHN0cmluZyA9IFwiUmVmcmVzaFwiO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRDYW5jZWxCdXR0b25MYWJlbDogc3RyaW5nID0gXCJDbG9zZVwiO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dVaTtcclxuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuLi9mb3JtL01ldGFkYXRhXCI7XHJcbmltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5pbXBvcnQgRGlhbG9nVWkgZnJvbSBcIi4vRGlhbG9nVWlcIjtcclxuXHJcbmNsYXNzIERpYWxvZyB7XHJcbiAgICBwdWJsaWMgY2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25maXJtU3RyaW5nczogSUNvbmZpcm1TdHJpbmdzO1xyXG4gICAgcHJpdmF0ZSB1aTogRGlhbG9nVWk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncywgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCwgbWV0YWRhdGE6IE1ldGFkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5jb25maXJtU3RyaW5ncyA9IGNvbmZpcm1TdHJpbmdzO1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgRGlhbG9nVWkoKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gdGhpcy5nZXRDYWxsYmFjayhmb3JtQ29udGV4dCwgbWV0YWRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvcGVuKGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCwgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb25maXJtT3B0aW9ucyA9IHsgaGVpZ2h0OiB0aGlzLnVpLmRlZmF1bHRIZWlnaHQsIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzID0gdGhpcy5nZXRDb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cygpO1xyXG5cclxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuQ29uZmlybURpYWxvZyhjb25maXJtU3RyaW5ncywgY29uZmlybU9wdGlvbnMpLnRoZW4oKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MuY29uZmlybWVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maXJtQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldENhbGxiYWNrKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQsIG1ldGFkYXRhOiBNZXRhZGF0YSk6ICgpID0+IHZvaWQge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB0aGlzLm9wZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuRm9ybSh7IGVudGl0eUlkOiBtZXRhZGF0YS5lbnRpdHlJZCwgZW50aXR5TmFtZTogbWV0YWRhdGEuZW50aXR5TmFtZSB9KTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvcm1Db250ZXh0LnVpLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cygpOiBYcm0uTmF2aWdhdGlvbi5Db25maXJtU3RyaW5ncyB7XHJcbiAgICAgICAgY29uc3QgY29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHM6IFhybS5OYXZpZ2F0aW9uLkNvbmZpcm1TdHJpbmdzID0ge1xyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25MYWJlbDogdGhpcy51aS5kZWZhdWx0Q2FuY2VsQnV0dG9uTGFiZWwsXHJcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25MYWJlbDogdGhpcy51aS5kZWZhdWx0Q29uZmlybUJ1dHRvbkxhYmVsLFxyXG4gICAgICAgICAgICBzdWJ0aXRsZTogdGhpcy5jb25maXJtU3RyaW5ncy5zdWJ0aXRsZSxcclxuICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maXJtU3RyaW5ncy50ZXh0LFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5jb25maXJtU3RyaW5ncy50aXRsZSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gY29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERpYWxvZztcclxuIiwiY2xhc3MgTm90aWZpY2F0aW9uIHtcclxuICAgIHB1YmxpYyBjYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcbiAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcsIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybUNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gdGhpcy5nZXRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBhIGZvcm0gbm90aWZpY2F0aW9uIHRvIG5vdGlmeSB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEZvcm1Ob3RpZmljYXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC51aS5zZXRGb3JtTm90aWZpY2F0aW9uKFxyXG4gICAgICAgICAgICB0aGlzLnRleHQsXHJcbiAgICAgICAgICAgIFwiSU5GT1wiLFxyXG4gICAgICAgICAgICBcIkdldEFsb25nTm90aWZpY2F0aW9uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q2FsbGJhY2soKTogKCkgPT4gdm9pZCB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMuc2V0Rm9ybU5vdGlmaWNhdGlvbigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb247XHJcbiIsImNsYXNzIFByb2Nlc3NvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIG1vZGlmaWVkb24gZGF0ZSBhcyBhIHJlYWRhYmxlLCB1c2VyIGxvY2FsZSBzdHJpbmcuXHJcbiAgICAgKiBAcGFyYW0gYXBpUmVzcG9uc2UgQ1JNIEFQSSByZXNwb25zZSB0aGF0IGluY2x1ZGVzIFwibW9kaWZpZWRvblwiIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzTW9kaWZpZWRPbkRhdGUoYXBpUmVzcG9uc2UpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25EYXRlID0gKGFwaVJlc3BvbnNlICYmIGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pXHJcbiAgICAgICAgICAgID8gYCR7bmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikudG9EYXRlU3RyaW5nKCl9LGAgK1xyXG4gICAgICAgICAgICBgICR7bmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikudG9Mb2NhbGVUaW1lU3RyaW5nKCl9YFxyXG4gICAgICAgICAgICA6IHRoaXMuZGVmYXVsdE1vZGlmaWVkT25UaW1lO1xyXG5cclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIG1vZGlmaWVkIGJ5IHVzZXIncyBmdWxsIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gYXBpUmVzcG9uc2UgQ1JNIEFQSSByZXNwb25zZSB0aGF0IGluY2x1ZGVzIGV4cGFuZGVkIFwibW9kaWZpZWRieS5mdWxsbmFtZVwiIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkQnlVc2VyID0gKGFwaVJlc3BvbnNlICYmIGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieS5mdWxsbmFtZSlcclxuICAgICAgICAgICAgPyBhcGlSZXNwb25zZS5tb2RpZmllZGJ5LmZ1bGxuYW1lXHJcbiAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRCeVVzZXI7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZEJ5VXNlcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRCeVVzZXIgPSBcImFub3RoZXIgdXNlclwiO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZGVmYXVsdE1vZGlmaWVkT25UaW1lID0gXCJ0aGUgc2FtZSB0aW1lXCI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2Nlc3NvcjtcclxuIiwiY2xhc3MgUXVlcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxscyBDUk0gQVBJIGFuZCByZXR1cm5zIHRoZSBnaXZlbiBlbnRpdHkncyBtb2RpZmllZCBvbiBkYXRlLlxyXG4gICAgICogQHBhcmFtIGVudGl0eU5hbWUgc2NoZW1hIG5hbWUgb2YgdGhlIGVudGl0eSB0byBxdWVyeS5cclxuICAgICAqIEBwYXJhbSBlbnRpdHlJZCBpZCBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGdldExhdGVzdE1vZGlmaWVkT24oZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCwgZW50aXR5TmFtZT86IHN0cmluZywgZW50aXR5SWQ/OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSB0aGlzLmVudGl0eUlkIHx8IGVudGl0eUlkIHx8IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCk7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlOYW1lID0gdGhpcy5lbnRpdHlOYW1lIHx8IGVudGl0eU5hbWUgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0RW50aXR5TmFtZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gWHJtLldlYkFwaS5yZXRyaWV2ZVJlY29yZCh0aGlzLmVudGl0eU5hbWUsIHRoaXMuZW50aXR5SWQsXHJcbiAgICAgICAgICAgIFwiPyRzZWxlY3Q9bW9kaWZpZWRvbiYkZXhwYW5kPW1vZGlmaWVkYnkoJHNlbGVjdD1mdWxsbmFtZSlcIikudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3RhdGljIGVudGl0eU5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUXVlcnk7XHJcbiIsImltcG9ydCBQcm9jZXNzb3IgZnJvbSBcIi4uL1Byb2Nlc3NvclwiO1xyXG5pbXBvcnQgUXVlcnkgZnJvbSBcIi4uL1F1ZXJ5XCI7XHJcblxyXG5jbGFzcyBEYXRhIHtcclxuICAgIHB1YmxpYyBpbml0aWFsTW9kaWZpZWRPbjogRGF0ZSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBsYXRlc3RNb2RpZmllZE9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRCeTogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm1Db250ZXh0O1xyXG4gICAgICAgIHRoaXMuYWRkUmVzZXRPblNhdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGZvcm0gbW9kaWZpZWQgb24gZGF0ZS4gQ2FsbHMgQ1JNIEFQSSBpZiBtb2RpZmllZCBvbiBhdHRyaWJ1dGUgaXMgbm90IG9uIHRoZSBmb3JtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZ2V0TW9kaWZpZWRPbigpOiBQcm9taXNlPERhdGUgfCB1bmRlZmluZWQ+IHtcclxuICAgICAgICBsZXQgbW9kaWZpZWRPbjogRGF0ZSB8IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCBtb2RpZmllZE9uQXR0cmlidXRlOiBYcm0uQXR0cmlidXRlcy5EYXRlQXR0cmlidXRlID0gdGhpcy5mb3JtQ29udGV4dC5nZXRBdHRyaWJ1dGUoXCJtb2RpZmllZG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAobW9kaWZpZWRPbkF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICBtb2RpZmllZE9uID0gbW9kaWZpZWRPbkF0dHJpYnV0ZS5nZXRWYWx1ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFwaVJlc3BvbnNlID0gYXdhaXQgUXVlcnkuZ2V0TGF0ZXN0TW9kaWZpZWRPbih0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgbW9kaWZpZWRPbiA9IGFwaVJlc3BvbnNlLm1vZGlmaWVkb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gbW9kaWZpZWRPbjtcclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgbW9kaWZpZWQgb24gZnJvbSBDUk0gc2VydmVyLiBSZXR1cm5zIHRydWUgaWYgaXQgaGFzIGNoYW5nZWQsIGFuZCBub3RpZmllcyB0aGUgdXNlci5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZChub3RpZmljYXRpb25DYWxsYmFjazogKCkgPT4gdm9pZCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSB0aGlzLmluaXRpYWxNb2RpZmllZE9uIHx8IGF3YWl0IHRoaXMuZ2V0TW9kaWZpZWRPbigpO1xyXG5cclxuICAgICAgICBjb25zdCBhcGlSZXNwb25zZSA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24odGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZEJ5ID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk7XHJcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZE9uID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25IYXNDaGFuZ2VkID0gYXBpUmVzcG9uc2UubW9kaWZpZWRvbiAmJlxyXG4gICAgICAgICAgICAobmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikgPiBuZXcgRGF0ZSh0aGlzLmluaXRpYWxNb2RpZmllZE9uISkpXHJcbiAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAobW9kaWZpZWRPbkhhc0NoYW5nZWQpIHtcclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uSGFzQ2hhbmdlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0cyBtb2RpZmllZCBvbiBjYWNoZSB3aGVuIGZvcm0gaXMgc2F2ZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkUmVzZXRPblNhdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hZGRPblNhdmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXRhO1xyXG4iLCJjbGFzcyBNZXRhZGF0YSB7XHJcbiAgICBwdWJsaWMgZW50aXR5SWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXR5TmFtZSA9IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWV0YWRhdGE7XHJcbiIsImltcG9ydCBEaWFsb2cgZnJvbSBcIi4uL25vdGlmaWNhdGlvbi9EaWFsb2dcIjtcclxuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tIFwiLi4vbm90aWZpY2F0aW9uL05vdGlmaWNhdGlvblwiO1xyXG5pbXBvcnQgSUNvbmZpcm1TdHJpbmdzIGZyb20gXCIuLi90eXBlcy9JQ29uZmlybVN0cmluZ3NcIjtcclxuaW1wb3J0IERhdGEgZnJvbSBcIi4vRGF0YVwiO1xyXG5pbXBvcnQgTWV0YWRhdGEgZnJvbSBcIi4vTWV0YWRhdGFcIjtcclxuXHJcbmNsYXNzIEZvcm0ge1xyXG4gICAgcHVibGljIGRhdGE6IERhdGE7XHJcbiAgICBwdWJsaWMgbm90aWZ5VXNlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIHByaXZhdGUgZGlhbG9nOiBEaWFsb2c7XHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcbiAgICBwcml2YXRlIG1ldGFkYXRhOiBNZXRhZGF0YTtcclxuICAgIHByaXZhdGUgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCBzaG93RGlhbG9nPzogYm9vbGVhbiwgY29uZmlybVN0cmluZ3M/OiBJQ29uZmlybVN0cmluZ3MpIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZXhlY3V0aW9uQ29udGV4dC5nZXRGb3JtQ29udGV4dCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBuZXcgTWV0YWRhdGEodGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zZXREaWFsb2coc2hvd0RpYWxvZywgY29uZmlybVN0cmluZ3MpO1xyXG4gICAgICAgIHRoaXMuc2V0Tm90aWZpY2F0aW9uKHNob3dEaWFsb2cpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVsb2FkcyB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBlbnRpdHlJZCA9IHRoaXMuZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIFhybS5OYXZpZ2F0aW9uLm9wZW5Gb3JtKHsgZW50aXR5SWQsIGVudGl0eU5hbWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcmV2ZW50cyBmb3JtIGF0dHJpYnV0ZXMgZnJvbSBiZWluZyBzdWJtaXR0ZWQgd2hlbiB0aGUgcmVjb3JkIGlzIHNhdmVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJldmVudFNhdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGUuc2V0U3VibWl0TW9kZShcIm5ldmVyXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBmb3JtIHR5cGUgaXMgbm90IGNyZWF0ZSBvciB1bmRlZmluZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGZvcm1UeXBlOiBYcm1FbnVtLkZvcm1UeXBlID0gdGhpcy5mb3JtQ29udGV4dC51aS5nZXRGb3JtVHlwZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9ybVR5cGUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERpYWxvZyhzaG93RGlhbG9nPzogYm9vbGVhbiwgY29uZmlybVN0cmluZ3M/OiBJQ29uZmlybVN0cmluZ3MpOiB2b2lkIHtcclxuICAgICAgICBpZiAoc2hvd0RpYWxvZyA9PT0gdHJ1ZSAmJiBjb25maXJtU3RyaW5ncyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nID0gbmV3IERpYWxvZyhjb25maXJtU3RyaW5ncywgdGhpcy5mb3JtQ29udGV4dCwgdGhpcy5tZXRhZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5VXNlckNhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2ZW50U2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2cuY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2V0IEFsb25nIGhhcyBiZWVuIGNvbmZpZ3VyZWQgaW5jb3JyZWN0bHkuIFNob3cgZGlhbG9nIGhhcyBiZWVuIHNlbGVjdGVkIGJ1dCBubyBjb25maXJtIHN0cmluZ3MgaGF2ZSBiZWVuIHBhc3NlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Tm90aWZpY2F0aW9uKHNob3dEaWFsb2c/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHNob3dEaWFsb2cgPT09IHVuZGVmaW5lZCB8fCBzaG93RGlhbG9nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBjb25zdCBub3RpZmljYXRpb25UZXh0ID0gYFRoaXMgZm9ybSBoYXMgYmVlbiBtb2RpZmllZCBieSAke3RoaXMuZGF0YS5sYXRlc3RNb2RpZmllZEJ5fSBhdCAke3RoaXMuZGF0YS5sYXRlc3RNb2RpZmllZE9ufS4gUmVmcmVzaCB0aGUgZm9ybSB0byBzZWUgbGF0ZXN0IGNoYW5nZXMuYDtcclxuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvblRleHQsIHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVVzZXJDYWxsYmFjayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJldmVudFNhdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGb3JtO1xyXG4iLCJjbGFzcyBQb2xsIHtcclxuICAgIC8qKlxyXG4gICAgICogUG9sbHMgYSBmdW5jdGlvbiBldmVyeSBzcGVjaWZpZWQgbnVtYmVyIG9mIHNlY29uZHMgdW50aWwgaXQgcmV0dXJucyB0cnVlIG9yIHRpbWVvdXQgaXMgcmVhY2hlZC5cclxuICAgICAqIEBwYXJhbSBmbiBjYWxsYmFjayBQcm9taXNlIHRvIHBvbGwuXHJcbiAgICAgKiBAcGFyYW0gdGltZW91dCBzZWNvbmRzIHRvIGNvbnRpbnVlIHBvbGxpbmcgZm9yLlxyXG4gICAgICogQHBhcmFtIGludGVydmFsIHNlY29uZHMgYmV0d2VlbiBwb2xsaW5nIGNhbGxzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGwoZm46IGFueSwgdGltZW91dDogbnVtYmVyLCBpbnRlcnZhbDogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBjb25zdCBlbmRUaW1lID0gTnVtYmVyKG5ldyBEYXRlKCkpICsgKHRpbWVvdXQgKiAxMDAwKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2hlY2tDb25kaXRpb24gPSAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gZm4oKTtcclxuXHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyKG5ldyBEYXRlKCkpIDwgZW5kVGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2hlY2tDb25kaXRpb24uYmluZCh0aGlzKSwgaW50ZXJ2YWwgKiAxMDAwLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoY29uc29sZS5sb2coXCJHZXRBbG9uZyBoYXMgYmVlbiBwb2xsaW5nIGZvciAzMCBtaW51dGVzIGFuZCB3aWxsIHN0b3Agbm93LlwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShjaGVja0NvbmRpdGlvbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvbGw7XHJcbiIsImltcG9ydCBGb3JtIGZyb20gXCIuL2Zvcm0vRm9ybVwiO1xyXG5pbXBvcnQgUG9sbCBmcm9tIFwiLi9Qb2xsXCI7XHJcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4vdHlwZXMvSUdldEFsb25nQ29uZmlnXCI7XHJcblxyXG5jbGFzcyBHZXRBbG9uZyB7XHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIEdldCBBbG9uZy5cclxuICAgICAqIEBwYXJhbSBleGVjdXRpb25Db250ZXh0IHBhc3NlZCBieSBkZWZhdWx0IGZyb20gRHluYW1pY3MgQ1JNIGZvcm0uXHJcbiAgICAgKiBAcGFyYW0gdGltZW91dCBkdXJhdGlvbiBpbiBzZWNvbmRzIHRvIHRpbWVvdXQgYmV0d2VlbiBwb2xsIG9wZXJhdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgbG9hZChleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQsIGNvbmZpZzogSUdldEFsb25nQ29uZmlnKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0aW9uQ29udGV4dCA9IGV4ZWN1dGlvbkNvbnRleHQ7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybSA9IG5ldyBGb3JtKHRoaXMuZXhlY3V0aW9uQ29udGV4dCwgY29uZmlnLmNvbmZpcm1EaWFsb2csIGNvbmZpZy5jb25maXJtU3RyaW5ncyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZm9ybS5pc1ZhbGlkKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5mb3JtLmRhdGEuZ2V0TW9kaWZpZWRPbigpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBvbGxGb3JNb2RpZmljYXRpb25zKHRoaXMuZm9ybS5ub3RpZnlVc2VyQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGdldGFsb25nLmpzIGhhcyBlbmNvdW50ZXJlZCBhbiBlcnJvci4gJHtlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb25maWc6IElHZXRBbG9uZ0NvbmZpZztcclxuICAgIHByaXZhdGUgc3RhdGljIGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dDtcclxuICAgIHByaXZhdGUgc3RhdGljIGZvcm06IEZvcm07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb2xscyBmb3IgbW9kaWZpY2F0aW9ucyB0byB0aGUgY3VycmVudCBmb3JtLlxyXG4gICAgICogQHBhcmFtIGV4ZWN1dGlvbkNvbnRleHQgcGFzc2VkIGJ5IGRlZmF1bHQgZnJvbSBEeW5hbWljcyBDUk0gZm9ybS5cclxuICAgICAqIEBwYXJhbSB0aW1lb3V0IGR1cmF0aW9uIGluIHNlY29uZHMgdG8gdGltZW91dCBiZXR3ZWVuIHBvbGwgb3BlcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgcG9sbEZvck1vZGlmaWNhdGlvbnMobm90aWZpY2F0aW9uQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBQb2xsLnBvbGwoKCkgPT4gdGhpcy5mb3JtLmRhdGEuY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKG5vdGlmaWNhdGlvbkNhbGxiYWNrKSwgMTgwMCAvIHRoaXMuY29uZmlnLnRpbWVvdXQsIHRoaXMuY29uZmlnLnRpbWVvdXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHZXRBbG9uZztcclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTtRQUFBO1lBQ29CLGtCQUFhLEdBQVcsR0FBRyxDQUFDO1lBQzVCLGlCQUFZLEdBQVcsR0FBRyxDQUFDO1lBQzNCLDhCQUF5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
