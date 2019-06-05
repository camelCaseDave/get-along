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

    /** Handles function calls at a set time interval. */
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

    /** Collection of functions used for making data human-readable. */
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

    /** Interacts directly with the Xrm Web API. */
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

    /** Data of the record in CRM. */
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
                            if (modifiedOnHasChanged && notificationCallback) {
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

    /** Record metadata used to query the CRM API. */
    var Metadata = /** @class */ (function () {
        function Metadata(formContext) {
            this.entityId = formContext.data.entity.getId();
            this.entityName = formContext.data.entity.getEntityName();
        }
        /**
         * Prevents form attributes from being submitted when the record is saved.
         */
        Metadata.prototype.preventSave = function (formContext) {
            formContext.data.entity.attributes.forEach(function (attribute) {
                attribute.setSubmitMode("never");
            });
        };
        return Metadata;
    }());

    /** A form in Dynamics 365 CE. */
    var Form = /** @class */ (function () {
        function Form(executionContext) {
            this.formContext = executionContext.getFormContext();
            this.data = new Data(this.formContext);
            this.metadata = new Metadata(this.formContext);
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
         * Returns true if the form type is not create or undefined.
         */
        Form.prototype.isValid = function () {
            var formType = this.formContext.ui.getFormType();
            return formType !== undefined &&
                formType !== 0 &&
                formType !== 1;
        };
        return Form;
    }());

    /** Ui of the form dialog. */
    var DialogUi = /** @class */ (function () {
        function DialogUi(confirmStrings) {
            this.defaultHeight = 200;
            this.defaultWidth = 450;
            this.defaultConfirmButtonLabel = "Refresh";
            this.defaultCancelButtonLabel = "Close";
            this.confirmStrings = confirmStrings;
        }
        DialogUi.prototype.getConfirmStringsWithDefaults = function () {
            var confirmStringsWithDefaults = {
                cancelButtonLabel: this.defaultCancelButtonLabel,
                confirmButtonLabel: this.defaultConfirmButtonLabel,
                subtitle: this.confirmStrings.subtitle,
                text: this.confirmStrings.text,
                title: this.confirmStrings.title,
            };
            return confirmStringsWithDefaults;
        };
        return DialogUi;
    }());

    /** Confirm dialog notifying user of a form conflict. */
    var Dialog = /** @class */ (function () {
        function Dialog(confirmStrings, formContext, metadata) {
            this.formContext = formContext;
            this.metadata = metadata;
            this.ui = new DialogUi(confirmStrings);
        }
        /** Opens the dialog, notifying user of a conflict. */
        Dialog.prototype.open = function () {
            var _this = this;
            return function () { return _this.openCallback(function () {
                _this.metadata.preventSave(_this.formContext);
                Xrm.Navigation.openForm({ entityId: _this.metadata.entityId, entityName: _this.metadata.entityName });
            }, function () {
                _this.metadata.preventSave(_this.formContext);
                _this.formContext.ui.close();
            }); };
        };
        /**
         * Opens a confirm dialog to notify user of a form conflict and prevent them from making further changes.
         */
        Dialog.prototype.openCallback = function (confirmCallback, cancelCallback) {
            var confirmOptions = { height: this.ui.defaultHeight, width: this.ui.defaultWidth };
            var confirmStrings = this.ui.getConfirmStringsWithDefaults();
            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(function (success) {
                if (success.confirmed) {
                    confirmCallback();
                }
                else {
                    cancelCallback();
                }
            });
        };
        return Dialog;
    }());

    /** Form notification banner notifying user of a form conflict. */
    var Notification = /** @class */ (function () {
        function Notification(text, formContext) {
            this.formContext = formContext;
            this.text = text;
        }
        /** Opens the notification, notifying user of a conflict. */
        Notification.prototype.open = function () {
            var _this = this;
            return function () {
                return _this.formContext.ui.setFormNotification(_this.text, "INFO", "GetAlongNotification");
            };
        };
        return Notification;
    }());

    /** Notifies users when a record they're viewing is modified elsewhere. */
    var GetAlong = /** @class */ (function () {
        function GetAlong() {
        }
        /**
         * Loads Get Along, polls for conflicts and notifies the user if any are found.
         * @param executionContext passed by default from Dynamics CRM form.
         * @param timeout duration in seconds to timeout between poll operations.
         */
        GetAlong.pollForConflicts = function (executionContext, config) {
            return __awaiter(this, void 0, Promise, function () {
                var e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            this.handleConfig(config);
                            this.form = new Form(executionContext);
                            if (!this.form.isValid()) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.form.data.getModifiedOn()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Poll.poll(function () { return _this.form.data.checkIfModifiedOnHasChanged(_this.userNotification.open); }, 1800 / config.timeout, config.timeout)];
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
        /** Checks for conflicts and notifies the user if any are found. */
        GetAlong.checkForConflicts = function () {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    try {
                        this.form.data.checkIfModifiedOnHasChanged(this.userNotification.open);
                    }
                    catch (e) {
                        console.error("getalong.js has encountered an error. " + e);
                    }
                    return [2 /*return*/];
                });
            });
        };
        GetAlong.handleConfig = function (config) {
            if (config.confirmDialog === undefined || config.confirmDialog === false) {
                this.userNotification = this.handleNotification();
            }
            else if (config.confirmDialog === true && config.confirmStrings !== undefined) {
                this.userNotification = this.handleDialog(config);
            }
            else {
                console.error("Get Along has been configured incorrectly. Show dialog has been selected but no confirm strings have been passed.");
            }
        };
        GetAlong.handleNotification = function () {
            var notificationText = "This form has been modified by " + this.form.data.latestModifiedBy + " at " + this.form.data.latestModifiedOn + ". Refresh the form to see latest changes.";
            return new Notification(notificationText, this.form.formContext);
        };
        GetAlong.handleDialog = function (config) {
            return new Dialog(config.confirmStrings, this.form.formContext, this.form.metadata);
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhL1BvbGwudHMiLCIuLi9zcmMvZGF0YS9Qcm9jZXNzb3IudHMiLCIuLi9zcmMvZGF0YS9RdWVyeS50cyIsIi4uL3NyYy9mb3JtL0RhdGEudHMiLCIuLi9zcmMvZm9ybS9NZXRhZGF0YS50cyIsIi4uL3NyYy9mb3JtL0Zvcm0udHMiLCIuLi9zcmMvbm90aWZpY2F0aW9uL0RpYWxvZ1VpLnRzIiwiLi4vc3JjL25vdGlmaWNhdGlvbi9EaWFsb2cudHMiLCIuLi9zcmMvbm90aWZpY2F0aW9uL05vdGlmaWNhdGlvbi50cyIsIi4uL3NyYy9HZXRBbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogSGFuZGxlcyBmdW5jdGlvbiBjYWxscyBhdCBhIHNldCB0aW1lIGludGVydmFsLiAqL1xyXG5jbGFzcyBQb2xsIHtcclxuICAgIC8qKlxyXG4gICAgICogUG9sbHMgYSBmdW5jdGlvbiBldmVyeSBzcGVjaWZpZWQgbnVtYmVyIG9mIHNlY29uZHMgdW50aWwgaXQgcmV0dXJucyB0cnVlIG9yIHRpbWVvdXQgaXMgcmVhY2hlZC5cclxuICAgICAqIEBwYXJhbSBmbiBjYWxsYmFjayBQcm9taXNlIHRvIHBvbGwuXHJcbiAgICAgKiBAcGFyYW0gdGltZW91dCBzZWNvbmRzIHRvIGNvbnRpbnVlIHBvbGxpbmcgZm9yLlxyXG4gICAgICogQHBhcmFtIGludGVydmFsIHNlY29uZHMgYmV0d2VlbiBwb2xsaW5nIGNhbGxzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGwoZm46IGFueSwgdGltZW91dDogbnVtYmVyLCBpbnRlcnZhbDogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBjb25zdCBlbmRUaW1lID0gTnVtYmVyKG5ldyBEYXRlKCkpICsgKHRpbWVvdXQgKiAxMDAwKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2hlY2tDb25kaXRpb24gPSAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gZm4oKTtcclxuXHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyKG5ldyBEYXRlKCkpIDwgZW5kVGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2hlY2tDb25kaXRpb24uYmluZCh0aGlzKSwgaW50ZXJ2YWwgKiAxMDAwLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoY29uc29sZS5sb2coXCJHZXRBbG9uZyBoYXMgYmVlbiBwb2xsaW5nIGZvciAzMCBtaW51dGVzIGFuZCB3aWxsIHN0b3Agbm93LlwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShjaGVja0NvbmRpdGlvbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvbGw7XHJcbiIsIi8qKiBDb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB1c2VkIGZvciBtYWtpbmcgZGF0YSBodW1hbi1yZWFkYWJsZS4gKi9cclxuY2xhc3MgUHJvY2Vzc29yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWRvbiBkYXRlIGFzIGEgcmVhZGFibGUsIHVzZXIgbG9jYWxlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgXCJtb2RpZmllZG9uXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkRhdGUgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRvbilcclxuICAgICAgICAgICAgPyBgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0RhdGVTdHJpbmcoKX0sYCArXHJcbiAgICAgICAgICAgIGAgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1gXHJcbiAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRPblRpbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uRGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWQgYnkgdXNlcidzIGZ1bGwgbmFtZS5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgZXhwYW5kZWQgXCJtb2RpZmllZGJ5LmZ1bGxuYW1lXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRCeVVzZXIgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZGJ5LmZ1bGxuYW1lKVxyXG4gICAgICAgICAgICA/IGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcclxuICAgICAgICAgICAgOiB0aGlzLmRlZmF1bHRNb2RpZmllZEJ5VXNlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkQnlVc2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRNb2RpZmllZEJ5VXNlciA9IFwiYW5vdGhlciB1c2VyXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRPblRpbWUgPSBcInRoZSBzYW1lIHRpbWVcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvY2Vzc29yO1xyXG4iLCIvKiogSW50ZXJhY3RzIGRpcmVjdGx5IHdpdGggdGhlIFhybSBXZWIgQVBJLiAqL1xyXG5jbGFzcyBRdWVyeSB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGxzIENSTSBBUEkgYW5kIHJldHVybnMgdGhlIGdpdmVuIGVudGl0eSdzIG1vZGlmaWVkIG9uIGRhdGUuXHJcbiAgICAgKiBAcGFyYW0gZW50aXR5TmFtZSBzY2hlbWEgbmFtZSBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxyXG4gICAgICogQHBhcmFtIGVudGl0eUlkIGlkIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0TGF0ZXN0TW9kaWZpZWRPbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBlbnRpdHlOYW1lPzogc3RyaW5nLCBlbnRpdHlJZD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSB0aGlzLmVudGl0eU5hbWUgfHwgZW50aXR5TmFtZSB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKHRoaXMuZW50aXR5TmFtZSwgdGhpcy5lbnRpdHlJZCxcclxuICAgICAgICAgICAgXCI/JHNlbGVjdD1tb2RpZmllZG9uJiRleHBhbmQ9bW9kaWZpZWRieSgkc2VsZWN0PWZ1bGxuYW1lKVwiKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5TmFtZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBRdWVyeTtcclxuIiwiaW1wb3J0IFByb2Nlc3NvciBmcm9tIFwiLi4vZGF0YS9Qcm9jZXNzb3JcIjtcclxuaW1wb3J0IFF1ZXJ5IGZyb20gXCIuLi9kYXRhL1F1ZXJ5XCI7XHJcblxyXG4vKiogRGF0YSBvZiB0aGUgcmVjb3JkIGluIENSTS4gKi9cclxuY2xhc3MgRGF0YSB7XHJcbiAgICBwdWJsaWMgaW5pdGlhbE1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRPbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGxhdGVzdE1vZGlmaWVkQnk6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcclxuICAgICAgICB0aGlzLmFkZFJlc2V0T25TYXZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBmb3JtIG1vZGlmaWVkIG9uIGRhdGUuIENhbGxzIENSTSBBUEkgaWYgbW9kaWZpZWQgb24gYXR0cmlidXRlIGlzIG5vdCBvbiB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGdldE1vZGlmaWVkT24oKTogUHJvbWlzZTxEYXRlIHwgdW5kZWZpbmVkPiB7XHJcbiAgICAgICAgbGV0IG1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkF0dHJpYnV0ZTogWHJtLkF0dHJpYnV0ZXMuRGF0ZUF0dHJpYnV0ZSA9IHRoaXMuZm9ybUNvbnRleHQuZ2V0QXR0cmlidXRlKFwibW9kaWZpZWRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25BdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgbW9kaWZpZWRPbiA9IG1vZGlmaWVkT25BdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcGlSZXNwb25zZSA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24odGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICAgICAgICAgIG1vZGlmaWVkT24gPSBhcGlSZXNwb25zZS5tb2RpZmllZG9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IG1vZGlmaWVkT247XHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIG1vZGlmaWVkIG9uIGZyb20gQ1JNIHNlcnZlci4gUmV0dXJucyB0cnVlIGlmIGl0IGhhcyBjaGFuZ2VkLCBhbmQgbm90aWZpZXMgdGhlIHVzZXIuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQobm90aWZpY2F0aW9uQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdGhpcy5pbml0aWFsTW9kaWZpZWRPbiB8fCBhd2FpdCB0aGlzLmdldE1vZGlmaWVkT24oKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRCeSA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpO1xyXG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRPbiA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRPbkRhdGUoYXBpUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBjb25zdCBtb2RpZmllZE9uSGFzQ2hhbmdlZCA9IGFwaVJlc3BvbnNlLm1vZGlmaWVkb24gJiZcclxuICAgICAgICAgICAgKG5ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pID4gbmV3IERhdGUodGhpcy5pbml0aWFsTW9kaWZpZWRPbiEpKVxyXG4gICAgICAgICAgICA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25IYXNDaGFuZ2VkICYmIG5vdGlmaWNhdGlvbkNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbkNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkhhc0NoYW5nZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldHMgbW9kaWZpZWQgb24gY2FjaGUgd2hlbiBmb3JtIGlzIHNhdmVkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFJlc2V0T25TYXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuYWRkT25TYXZlKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0YTtcclxuIiwiLyoqIFJlY29yZCBtZXRhZGF0YSB1c2VkIHRvIHF1ZXJ5IHRoZSBDUk0gQVBJLiAqL1xyXG5jbGFzcyBNZXRhZGF0YSB7XHJcbiAgICBwdWJsaWMgZW50aXR5SWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXR5TmFtZSA9IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByZXZlbnRzIGZvcm0gYXR0cmlidXRlcyBmcm9tIGJlaW5nIHN1Ym1pdHRlZCB3aGVuIHRoZSByZWNvcmQgaXMgc2F2ZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcmV2ZW50U2F2ZShmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgYXR0cmlidXRlLnNldFN1Ym1pdE1vZGUoXCJuZXZlclwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWV0YWRhdGE7XHJcbiIsImltcG9ydCBEYXRhIGZyb20gXCIuL0RhdGFcIjtcclxuaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuL01ldGFkYXRhXCI7XHJcblxyXG4vKiogQSBmb3JtIGluIER5bmFtaWNzIDM2NSBDRS4gKi9cclxuY2xhc3MgRm9ybSB7XHJcbiAgICBwdWJsaWMgZGF0YTogRGF0YTtcclxuICAgIHB1YmxpYyBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xyXG4gICAgcHVibGljIG1ldGFkYXRhOiBNZXRhZGF0YTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZXhlY3V0aW9uQ29udGV4dC5nZXRGb3JtQ29udGV4dCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBuZXcgTWV0YWRhdGEodGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWxvYWRzIHRoZSBmb3JtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVsb2FkKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eUlkID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xyXG4gICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcclxuXHJcbiAgICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkZvcm0oeyBlbnRpdHlJZCwgZW50aXR5TmFtZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZm9ybSB0eXBlIGlzIG5vdCBjcmVhdGUgb3IgdW5kZWZpbmVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNWYWxpZCgpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBmb3JtVHlwZTogWHJtRW51bS5Gb3JtVHlwZSA9IHRoaXMuZm9ybUNvbnRleHQudWkuZ2V0Rm9ybVR5cGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZvcm1UeXBlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgZm9ybVR5cGUgIT09IDAgJiZcclxuICAgICAgICAgICAgZm9ybVR5cGUgIT09IDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZvcm07XHJcbiIsImltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5cclxuLyoqIFVpIG9mIHRoZSBmb3JtIGRpYWxvZy4gKi9cclxuY2xhc3MgRGlhbG9nVWkge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRIZWlnaHQ6IG51bWJlciA9IDIwMDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0V2lkdGg6IG51bWJlciA9IDQ1MDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29uZmlybUJ1dHRvbkxhYmVsOiBzdHJpbmcgPSBcIlJlZnJlc2hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q2FuY2VsQnV0dG9uTGFiZWw6IHN0cmluZyA9IFwiQ2xvc2VcIjtcclxuXHJcbiAgICBwcml2YXRlIGNvbmZpcm1TdHJpbmdzOiBJQ29uZmlybVN0cmluZ3M7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncykge1xyXG4gICAgICAgIHRoaXMuY29uZmlybVN0cmluZ3MgPSBjb25maXJtU3RyaW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHMoKTogWHJtLk5hdmlnYXRpb24uQ29uZmlybVN0cmluZ3Mge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzOiBYcm0uTmF2aWdhdGlvbi5Db25maXJtU3RyaW5ncyA9IHtcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENvbmZpcm1CdXR0b25MYWJlbCxcclxuICAgICAgICAgICAgc3VidGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3Muc3VidGl0bGUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlybVN0cmluZ3MudGV4dCxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3MudGl0bGUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dVaTtcclxuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuLi9mb3JtL01ldGFkYXRhXCI7XHJcbmltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBEaWFsb2dVaSBmcm9tIFwiLi9EaWFsb2dVaVwiO1xyXG5cclxuLyoqIENvbmZpcm0gZGlhbG9nIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cclxuY2xhc3MgRGlhbG9nIGltcGxlbWVudHMgSVVzZXJOb3RpZmljYXRpb24ge1xyXG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xyXG4gICAgcHJpdmF0ZSBtZXRhZGF0YTogTWV0YWRhdGE7XHJcbiAgICBwcml2YXRlIHVpOiBEaWFsb2dVaTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maXJtU3RyaW5nczogSUNvbmZpcm1TdHJpbmdzLCBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBtZXRhZGF0YTogTWV0YWRhdGEpIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybUNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgRGlhbG9nVWkoY29uZmlybVN0cmluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBPcGVucyB0aGUgZGlhbG9nLCBub3RpZnlpbmcgdXNlciBvZiBhIGNvbmZsaWN0LiAqL1xyXG4gICAgcHVibGljIG9wZW4oKTogKCkgPT4gdm9pZCB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMub3BlbkNhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkZvcm0oeyBlbnRpdHlJZDogdGhpcy5tZXRhZGF0YS5lbnRpdHlJZCwgZW50aXR5TmFtZTogdGhpcy5tZXRhZGF0YS5lbnRpdHlOYW1lIH0pO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtQ29udGV4dC51aS5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb3BlbkNhbGxiYWNrKGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCwgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb25maXJtT3B0aW9ucyA9IHsgaGVpZ2h0OiB0aGlzLnVpLmRlZmF1bHRIZWlnaHQsIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzID0gdGhpcy51aS5nZXRDb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cygpO1xyXG5cclxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuQ29uZmlybURpYWxvZyhjb25maXJtU3RyaW5ncywgY29uZmlybU9wdGlvbnMpLnRoZW4oKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MuY29uZmlybWVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maXJtQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nO1xyXG4iLCJpbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcblxyXG4vKiogRm9ybSBub3RpZmljYXRpb24gYmFubmVyIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cclxuY2xhc3MgTm90aWZpY2F0aW9uIGltcGxlbWVudHMgSVVzZXJOb3RpZmljYXRpb24ge1xyXG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nLCBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm1Db250ZXh0O1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIE9wZW5zIHRoZSBub3RpZmljYXRpb24sIG5vdGlmeWluZyB1c2VyIG9mIGEgY29uZmxpY3QuICovXHJcbiAgICBwdWJsaWMgb3BlbigpOiAoKSA9PiB2b2lkIHtcclxuICAgICAgICByZXR1cm4gKCkgPT5cclxuICAgICAgICAgICAgdGhpcy5mb3JtQ29udGV4dC51aS5zZXRGb3JtTm90aWZpY2F0aW9uKFxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0LFxyXG4gICAgICAgICAgICAgICAgXCJJTkZPXCIsXHJcbiAgICAgICAgICAgICAgICBcIkdldEFsb25nTm90aWZpY2F0aW9uXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb247XHJcbiIsImltcG9ydCBQb2xsIGZyb20gXCIuL2RhdGEvUG9sbFwiO1xyXG5pbXBvcnQgRm9ybSBmcm9tIFwiLi9mb3JtL0Zvcm1cIjtcclxuaW1wb3J0IERpYWxvZyBmcm9tIFwiLi9ub3RpZmljYXRpb24vRGlhbG9nXCI7XHJcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSBcIi4vbm90aWZpY2F0aW9uL05vdGlmaWNhdGlvblwiO1xyXG5pbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gXCIuL3R5cGVzL0lHZXRBbG9uZ0NvbmZpZ1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4vdHlwZXMvSVVzZXJOb3RpZmljYXRpb25cIjtcclxuXHJcbi8qKiBOb3RpZmllcyB1c2VycyB3aGVuIGEgcmVjb3JkIHRoZXkncmUgdmlld2luZyBpcyBtb2RpZmllZCBlbHNld2hlcmUuICovXHJcbmNsYXNzIEdldEFsb25nIHtcclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgR2V0IEFsb25nLCBwb2xscyBmb3IgY29uZmxpY3RzIGFuZCBub3RpZmllcyB0aGUgdXNlciBpZiBhbnkgYXJlIGZvdW5kLlxyXG4gICAgICogQHBhcmFtIGV4ZWN1dGlvbkNvbnRleHQgcGFzc2VkIGJ5IGRlZmF1bHQgZnJvbSBEeW5hbWljcyBDUk0gZm9ybS5cclxuICAgICAqIEBwYXJhbSB0aW1lb3V0IGR1cmF0aW9uIGluIHNlY29uZHMgdG8gdGltZW91dCBiZXR3ZWVuIHBvbGwgb3BlcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsRm9yQ29uZmxpY3RzKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNvbmZpZyhjb25maWcpO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm0gPSBuZXcgRm9ybShleGVjdXRpb25Db250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5mb3JtLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZvcm0uZGF0YS5nZXRNb2RpZmllZE9uKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IFBvbGwucG9sbCgoKSA9PiB0aGlzLmZvcm0uZGF0YS5jaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQodGhpcy51c2VyTm90aWZpY2F0aW9uLm9wZW4pLCAxODAwIC8gY29uZmlnLnRpbWVvdXQsIGNvbmZpZy50aW1lb3V0KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGdldGFsb25nLmpzIGhhcyBlbmNvdW50ZXJlZCBhbiBlcnJvci4gJHtlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQ2hlY2tzIGZvciBjb25mbGljdHMgYW5kIG5vdGlmaWVzIHRoZSB1c2VyIGlmIGFueSBhcmUgZm91bmQuICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGNoZWNrRm9yQ29uZmxpY3RzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybS5kYXRhLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZCh0aGlzLnVzZXJOb3RpZmljYXRpb24ub3Blbik7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBnZXRhbG9uZy5qcyBoYXMgZW5jb3VudGVyZWQgYW4gZXJyb3IuICR7ZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZm9ybTogRm9ybTtcclxuICAgIHByaXZhdGUgc3RhdGljIHVzZXJOb3RpZmljYXRpb246IElVc2VyTm90aWZpY2F0aW9uO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhhbmRsZUNvbmZpZyhjb25maWc6IElHZXRBbG9uZ0NvbmZpZykge1xyXG4gICAgICAgIGlmIChjb25maWcuY29uZmlybURpYWxvZyA9PT0gdW5kZWZpbmVkIHx8IGNvbmZpZy5jb25maXJtRGlhbG9nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJOb3RpZmljYXRpb24gPSB0aGlzLmhhbmRsZU5vdGlmaWNhdGlvbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiYgY29uZmlnLmNvbmZpcm1TdHJpbmdzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy51c2VyTm90aWZpY2F0aW9uID0gdGhpcy5oYW5kbGVEaWFsb2coY29uZmlnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiR2V0IEFsb25nIGhhcyBiZWVuIGNvbmZpZ3VyZWQgaW5jb3JyZWN0bHkuIFNob3cgZGlhbG9nIGhhcyBiZWVuIHNlbGVjdGVkIGJ1dCBubyBjb25maXJtIHN0cmluZ3MgaGF2ZSBiZWVuIHBhc3NlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhhbmRsZU5vdGlmaWNhdGlvbigpOiBOb3RpZmljYXRpb24ge1xyXG4gICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvblRleHQgPSBgVGhpcyBmb3JtIGhhcyBiZWVuIG1vZGlmaWVkIGJ5ICR7dGhpcy5mb3JtLmRhdGEubGF0ZXN0TW9kaWZpZWRCeX0gYXQgJHt0aGlzLmZvcm0uZGF0YS5sYXRlc3RNb2RpZmllZE9ufS4gUmVmcmVzaCB0aGUgZm9ybSB0byBzZWUgbGF0ZXN0IGNoYW5nZXMuYDtcclxuICAgICAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbihub3RpZmljYXRpb25UZXh0LCB0aGlzLmZvcm0uZm9ybUNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhhbmRsZURpYWxvZyhjb25maWc6IElHZXRBbG9uZ0NvbmZpZyk6IERpYWxvZyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEaWFsb2coY29uZmlnLmNvbmZpcm1TdHJpbmdzISwgdGhpcy5mb3JtLmZvcm1Db250ZXh0LCB0aGlzLmZvcm0ubWV0YWRhdGEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHZXRBbG9uZztcclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTtJQUNBO1FBQUE7U0EwQkM7Ozs7Ozs7UUFuQnVCLFNBQUksR0FBeEIsVUFBeUIsRUFBTyxFQUFFLE9BQWUsRUFBRSxRQUFnQjsyQ0FBRyxPQUFPOzs7O29CQUNuRSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBRWhELGNBQWMsR0FBRyxVQUFDLE9BQU8sRUFBRSxNQUFNO3dCQUNuQyxJQUFNLFFBQVEsR0FBRyxFQUFFLEVBQUUsQ0FBQzt3QkFFdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVE7NEJBQ25CLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQ0FDbkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzZCQUNyQjtpQ0FBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFO2dDQUNyQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsRUFBRSxRQUFRLEdBQUcsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFN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
