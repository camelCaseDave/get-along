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
            this.isOpen = false;
            this.formContext = formContext;
            this.metadata = metadata;
            this.ui = new DialogUi(confirmStrings);
        }
        /** Opens the dialog, notifying user of a conflict. */
        Dialog.prototype.open = function () {
            var _this = this;
            if (!this.isOpen) {
                this.isOpen = true;
                this.openCallback(function () {
                    _this.metadata.preventSave(_this.formContext);
                    window.parent.location.reload(false);
                }, function () {
                    _this.metadata.preventSave(_this.formContext);
                    _this.formContext.ui.close();
                });
            }
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
        function Notification(form) {
            this.isOpen = false;
            this.data = form.data;
            this.formContext = form.formContext;
        }
        /** Opens the notification, notifying user of a conflict. */
        Notification.prototype.open = function () {
            if (!this.isOpen) {
                this.isOpen = true;
                this.formContext.ui.setFormNotification(this.getNotificationText(), "INFO", "GetAlongNotification");
            }
        };
        Notification.prototype.getNotificationText = function () {
            var text = "This form has been modified by " + this.data.latestModifiedBy + " at " + this.data.latestModifiedOn + ". Refresh the form to see latest changes.";
            return text;
        };
        return Notification;
    }());

    var projectName = "getalong.js";
    var configIsInvalid = projectName + " config is invalid.";
    var MESSAGES = {
        configIsInvalid: configIsInvalid + " and therefore won't load",
        configNotSpecified: configIsInvalid + " No config has been specified.",
        confirmStringsNotSpecified: configIsInvalid + " Use dialog has been selected but no confirm strings have been passed.",
        formIsInvalid: projectName + " thinks the form is invalid and therefore won't load",
        generic: projectName + " has encountered an error.",
        pollingTimeout: projectName + " has been polling for 30 minutes and will stop now.",
        timeoutNotSpecified: configIsInvalid + " No timeout has been specified.",
        timeoutOutsideValidRange: configIsInvalid + " Timeout is outside of valid range.",
    };

    /** Validates the config passed by CRM form properties. */
    var ConfigValidator = /** @class */ (function () {
        function ConfigValidator(config) {
            this.config = config;
            this.validationRules = [
                this.configIsDefined.bind(this),
                this.dialogSettingsAreValid.bind(this),
                this.timeoutIsDefined.bind(this),
                this.timeoutIsValid.bind(this),
            ];
        }
        /** Returns true if the config is valid, otherwise false. */
        ConfigValidator.prototype.isValid = function () {
            var isValid = this.validationRules.every(function (fn) { return fn() === true; });
            return isValid;
        };
        ConfigValidator.prototype.configIsDefined = function () {
            if (this.config !== undefined) {
                return true;
            }
            else {
                console.error(MESSAGES.configNotSpecified);
                return false;
            }
        };
        ConfigValidator.prototype.dialogSettingsAreValid = function () {
            if (this.config.confirmDialog === true && this.config.confirmStrings === undefined) {
                console.error(MESSAGES.confirmStringsNotSpecified);
                return false;
            }
            else {
                return true;
            }
        };
        ConfigValidator.prototype.timeoutIsDefined = function () {
            if (this.config.timeout !== undefined) {
                return true;
            }
            else {
                console.error(MESSAGES.timeoutNotSpecified);
                return false;
            }
        };
        ConfigValidator.prototype.timeoutIsValid = function () {
            if (this.config.timeout < 1 || this.config.timeout >= 1800) {
                console.error(MESSAGES.timeoutOutsideValidRange);
                return false;
            }
            else {
                return true;
            }
        };
        return ConfigValidator;
    }());

    var Config = /** @class */ (function () {
        function Config(config, form) {
            this.config = this.parseConfig(config);
            this.form = form;
        }
        /** Derives the user notification, either a form notification or a dialog, from config passed from the CRM form properties. */
        Config.prototype.getUserNotification = function () {
            var isUseDialogSelected = this.config.confirmDialog === true && this.config.confirmStrings !== undefined;
            var userNotification = isUseDialogSelected ? this.getDialog() : this.getNotification();
            return userNotification;
        };
        /** Returns true if the config passed from the CRM form properties is valid for use, otherwise false. */
        Config.prototype.isValid = function () {
            var validator = new ConfigValidator(this.config);
            var isValid = validator.isValid();
            return isValid;
        };
        Config.prototype.getNotification = function () {
            return new Notification(this.form);
        };
        Config.prototype.getDialog = function () {
            return new Dialog(this.config.confirmStrings, this.form.formContext, this.form.metadata);
        };
        Config.prototype.parseConfig = function (config) {
            if (typeof config === "number") {
                return {
                    timeout: config,
                };
            }
            else {
                return config;
            }
        };
        return Config;
    }());

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
                                reject(console.log(MESSAGES.pollingTimeout));
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
         * Asynchronously initialises data, caching initial modified on.
         */
        Data.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var apiResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Query.getLatestModifiedOn(this.formContext)];
                        case 1:
                            apiResponse = _a.sent();
                            this.cacheApiResponse(apiResponse);
                            this.initialModifiedOn = apiResponse.modifiedon;
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Gets modified on from CRM server. Returns true if it has changed, and notifies the user.
         */
        Data.prototype.checkIfModifiedOnHasChanged = function (notificationCallback) {
            return __awaiter(this, void 0, Promise, function () {
                var apiResponse, modifiedOnHasChanged;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.initialModifiedOn) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.init()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, false];
                        case 2: return [4 /*yield*/, Query.getLatestModifiedOn(this.formContext)];
                        case 3:
                            apiResponse = _a.sent();
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
        Data.prototype.cacheApiResponse = function (apiResponse) {
            this.latestModifiedBy = Processor.processModifiedByUser(apiResponse);
            this.latestModifiedOn = Processor.processModifiedOnDate(apiResponse);
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
         * Asyncronously initialises form data.
         */
        Form.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.data.init();
                    return [2 /*return*/];
                });
            });
        };
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

    /**
     * Notifies users when a record they're viewing is modified elsewhere.
     */
    var GetAlong = /** @class */ (function () {
        function GetAlong() {
        }
        /** Checks for conflicts and notifies the user if any are found. */
        GetAlong.checkForConflicts = function (executionContext, config) {
            return __awaiter(this, void 0, Promise, function () {
                var successfulInit, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, GetAlong.init(executionContext, config)];
                        case 1:
                            successfulInit = _a.sent();
                            if (!successfulInit) {
                                return [2 /*return*/];
                            }
                            GetAlong.form.data.checkIfModifiedOnHasChanged(GetAlong.userNotification.open.bind(GetAlong.userNotification));
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.error(MESSAGES.generic + " " + e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Polls for conflicts and notifies the user if any are found.
         * @param executionContext passed by default from Dynamics CRM form.
         * @param timeout duration in seconds to timeout between poll operations.
         */
        GetAlong.pollForConflicts = function (executionContext, config) {
            return __awaiter(this, void 0, Promise, function () {
                var successfulInit, e_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, GetAlong.init(executionContext, config)];
                        case 1:
                            successfulInit = _a.sent();
                            if (!successfulInit) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Poll.poll(function () { return _this.form.data.checkIfModifiedOnHasChanged(GetAlong.userNotification.open.bind(GetAlong.userNotification)); }, 1800 / config.timeout, config.timeout)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            console.error(MESSAGES.generic + " " + e_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /** Initialises Get Along. Returns true if successful, otherwise false. */
        GetAlong.init = function (executionContext, config) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            GetAlong.form = GetAlong.form || new Form(executionContext);
                            return [4 /*yield*/, GetAlong.form.init()];
                        case 1:
                            _a.sent();
                            if (!GetAlong.form.isValid()) {
                                console.log(MESSAGES.formIsInvalid);
                                return [2 /*return*/, false];
                            }
                            GetAlong.config = GetAlong.config || new Config(config, GetAlong.form);
                            if (!GetAlong.config.isValid()) {
                                console.log(MESSAGES.configIsInvalid);
                                return [2 /*return*/, false];
                            }
                            GetAlong.userNotification = GetAlong.userNotification || GetAlong.config.getUserNotification();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWFsb25nLmpzIiwic291cmNlcyI6WyIuLi9zcmMvbm90aWZpY2F0aW9uL2RpYWxvZy11aS50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vZGlhbG9nLnRzIiwiLi4vc3JjL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24udHMiLCIuLi9zcmMvY29uZmlnL21lc3NhZ2VzLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWctdmFsaWRhdG9yLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWcudHMiLCIuLi9zcmMvZGF0YS9wb2xsLnRzIiwiLi4vc3JjL2RhdGEvcHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RhdGEvcXVlcnkudHMiLCIuLi9zcmMvZm9ybS9kYXRhLnRzIiwiLi4vc3JjL2Zvcm0vbWV0YWRhdGEudHMiLCIuLi9zcmMvZm9ybS9mb3JtLnRzIiwiLi4vc3JjL2dldC1hbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUNvbmZpcm1TdHJpbmdzIGZyb20gXCIuLi90eXBlcy9jb25maXJtLXN0cmluZ3NcIjtcblxuLyoqIFVpIG9mIHRoZSBmb3JtIGRpYWxvZy4gKi9cbmNsYXNzIERpYWxvZ1VpIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdEhlaWdodDogbnVtYmVyID0gMjAwO1xuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0V2lkdGg6IG51bWJlciA9IDQ1MDtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENvbmZpcm1CdXR0b25MYWJlbDogc3RyaW5nID0gXCJSZWZyZXNoXCI7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRDYW5jZWxCdXR0b25MYWJlbDogc3RyaW5nID0gXCJDbG9zZVwiO1xuXG4gICAgcHJpdmF0ZSBjb25maXJtU3RyaW5nczogSUNvbmZpcm1TdHJpbmdzO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncykge1xuICAgICAgICB0aGlzLmNvbmZpcm1TdHJpbmdzID0gY29uZmlybVN0cmluZ3M7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzKCk6IFhybS5OYXZpZ2F0aW9uLkNvbmZpcm1TdHJpbmdzIHtcbiAgICAgICAgY29uc3QgY29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHM6IFhybS5OYXZpZ2F0aW9uLkNvbmZpcm1TdHJpbmdzID0ge1xuICAgICAgICAgICAgY2FuY2VsQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsLFxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkxhYmVsOiB0aGlzLmRlZmF1bHRDb25maXJtQnV0dG9uTGFiZWwsXG4gICAgICAgICAgICBzdWJ0aXRsZTogdGhpcy5jb25maXJtU3RyaW5ncy5zdWJ0aXRsZSxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlybVN0cmluZ3MudGV4dCxcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmNvbmZpcm1TdHJpbmdzLnRpdGxlLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpYWxvZ1VpO1xuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuLi9mb3JtL21ldGFkYXRhXCI7XG5pbXBvcnQgSUNvbmZpcm1TdHJpbmdzIGZyb20gXCIuLi90eXBlcy9jb25maXJtLXN0cmluZ3NcIjtcbmltcG9ydCBJVXNlck5vdGlmaWNhdGlvbiBmcm9tIFwiLi4vdHlwZXMvdXNlci1ub3RpZmljYXRpb25cIjtcbmltcG9ydCBEaWFsb2dVaSBmcm9tIFwiLi9kaWFsb2ctdWlcIjtcblxuLyoqIENvbmZpcm0gZGlhbG9nIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cbmNsYXNzIERpYWxvZyBpbXBsZW1lbnRzIElVc2VyTm90aWZpY2F0aW9uIHtcbiAgICBwdWJsaWMgaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XG4gICAgcHJpdmF0ZSBtZXRhZGF0YTogTWV0YWRhdGE7XG4gICAgcHJpdmF0ZSB1aTogRGlhbG9nVWk7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maXJtU3RyaW5nczogSUNvbmZpcm1TdHJpbmdzLCBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBtZXRhZGF0YTogTWV0YWRhdGEpIHtcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm1Db250ZXh0O1xuICAgICAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHRoaXMudWkgPSBuZXcgRGlhbG9nVWkoY29uZmlybVN0cmluZ3MpO1xuICAgIH1cblxuICAgIC8qKiBPcGVucyB0aGUgZGlhbG9nLCBub3RpZnlpbmcgdXNlciBvZiBhIGNvbmZsaWN0LiAqL1xuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMub3BlbkNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFkYXRhLnByZXZlbnRTYXZlKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5wYXJlbnQubG9jYXRpb24ucmVsb2FkKGZhbHNlKTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFkYXRhLnByZXZlbnRTYXZlKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuY2xvc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBvcGVuQ2FsbGJhY2soY29uZmlybUNhbGxiYWNrOiAoKSA9PiB2b2lkLCBjYW5jZWxDYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBjb25zdCBjb25maXJtT3B0aW9ucyA9IHsgaGVpZ2h0OiB0aGlzLnVpLmRlZmF1bHRIZWlnaHQsIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCB9O1xuICAgICAgICBjb25zdCBjb25maXJtU3RyaW5ncyA9IHRoaXMudWkuZ2V0Q29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHMoKTtcblxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuQ29uZmlybURpYWxvZyhjb25maXJtU3RyaW5ncywgY29uZmlybU9wdGlvbnMpLnRoZW4oKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgIGlmIChzdWNjZXNzLmNvbmZpcm1lZCkge1xuICAgICAgICAgICAgICAgIGNvbmZpcm1DYWxsYmFjaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYW5jZWxDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpYWxvZztcbiIsImltcG9ydCBJVXNlck5vdGlmaWNhdGlvbiBmcm9tIFwiLi4vdHlwZXMvdXNlci1ub3RpZmljYXRpb25cIjtcbmltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL2Zvcm1cIjtcbmltcG9ydCBEYXRhIGZyb20gXCIuLi9mb3JtL2RhdGFcIjtcblxuLyoqIEZvcm0gbm90aWZpY2F0aW9uIGJhbm5lciBub3RpZnlpbmcgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QuICovXG5jbGFzcyBOb3RpZmljYXRpb24gaW1wbGVtZW50cyBJVXNlck5vdGlmaWNhdGlvbiB7XG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBkYXRhOiBEYXRhO1xuICAgIHByaXZhdGUgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcblxuICAgIGNvbnN0cnVjdG9yKGZvcm06IEZvcm0pIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZm9ybS5kYXRhO1xuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybS5mb3JtQ29udGV4dDtcbiAgICB9XG5cbiAgICAvKiogT3BlbnMgdGhlIG5vdGlmaWNhdGlvbiwgbm90aWZ5aW5nIHVzZXIgb2YgYSBjb25mbGljdC4gKi9cbiAgICBwdWJsaWMgb3BlbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5mb3JtQ29udGV4dC51aS5zZXRGb3JtTm90aWZpY2F0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Tm90aWZpY2F0aW9uVGV4dCgpLFxuICAgICAgICAgICAgICAgIFwiSU5GT1wiLFxuICAgICAgICAgICAgICAgIFwiR2V0QWxvbmdOb3RpZmljYXRpb25cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vdGlmaWNhdGlvblRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGBUaGlzIGZvcm0gaGFzIGJlZW4gbW9kaWZpZWQgYnkgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRCeX0gYXQgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRPbn0uIFJlZnJlc2ggdGhlIGZvcm0gdG8gc2VlIGxhdGVzdCBjaGFuZ2VzLmA7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTm90aWZpY2F0aW9uO1xuIiwiY29uc3QgcHJvamVjdE5hbWUgPSBcImdldGFsb25nLmpzXCI7XG5jb25zdCBjb25maWdJc0ludmFsaWQgPSBgJHtwcm9qZWN0TmFtZX0gY29uZmlnIGlzIGludmFsaWQuYDtcblxuY29uc3QgTUVTU0FHRVMgPSB7XG4gICAgY29uZmlnSXNJbnZhbGlkOiBgJHtjb25maWdJc0ludmFsaWR9IGFuZCB0aGVyZWZvcmUgd29uJ3QgbG9hZGAsXG4gICAgY29uZmlnTm90U3BlY2lmaWVkOiBgJHtjb25maWdJc0ludmFsaWR9IE5vIGNvbmZpZyBoYXMgYmVlbiBzcGVjaWZpZWQuYCxcbiAgICBjb25maXJtU3RyaW5nc05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBVc2UgZGlhbG9nIGhhcyBiZWVuIHNlbGVjdGVkIGJ1dCBubyBjb25maXJtIHN0cmluZ3MgaGF2ZSBiZWVuIHBhc3NlZC5gLFxuICAgIGZvcm1Jc0ludmFsaWQ6IGAke3Byb2plY3ROYW1lfSB0aGlua3MgdGhlIGZvcm0gaXMgaW52YWxpZCBhbmQgdGhlcmVmb3JlIHdvbid0IGxvYWRgLFxuICAgIGdlbmVyaWM6IGAke3Byb2plY3ROYW1lfSBoYXMgZW5jb3VudGVyZWQgYW4gZXJyb3IuYCxcbiAgICBwb2xsaW5nVGltZW91dDogYCR7cHJvamVjdE5hbWV9IGhhcyBiZWVuIHBvbGxpbmcgZm9yIDMwIG1pbnV0ZXMgYW5kIHdpbGwgc3RvcCBub3cuYCxcbiAgICB0aW1lb3V0Tm90U3BlY2lmaWVkOiBgJHtjb25maWdJc0ludmFsaWR9IE5vIHRpbWVvdXQgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXG4gICAgdGltZW91dE91dHNpZGVWYWxpZFJhbmdlOiBgJHtjb25maWdJc0ludmFsaWR9IFRpbWVvdXQgaXMgb3V0c2lkZSBvZiB2YWxpZCByYW5nZS5gLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgTUVTU0FHRVM7XG4iLCJpbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gXCIuLi90eXBlcy9nZXQtYWxvbmctY29uZmlnXCI7XG5pbXBvcnQgTUVTU0FHRVMgZnJvbSBcIi4vbWVzc2FnZXNcIjtcblxuLyoqIFZhbGlkYXRlcyB0aGUgY29uZmlnIHBhc3NlZCBieSBDUk0gZm9ybSBwcm9wZXJ0aWVzLiAqL1xuY2xhc3MgQ29uZmlnVmFsaWRhdG9yIHtcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xuICAgIHByaXZhdGUgdmFsaWRhdGlvblJ1bGVzOiBBcnJheTwoKSA9PiBib29sZWFuPjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLnZhbGlkYXRpb25SdWxlcyA9IFtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnSXNEZWZpbmVkLmJpbmQodGhpcyksXG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1NldHRpbmdzQXJlVmFsaWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHRoaXMudGltZW91dElzRGVmaW5lZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SXNWYWxpZC5iaW5kKHRoaXMpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGNvbmZpZyBpcyB2YWxpZCwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0aW9uUnVsZXMuZXZlcnkoKGZuOiAoKSA9PiBib29sZWFuKSA9PiBmbigpID09PSB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdJc0RlZmluZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTUVTU0FHRVMuY29uZmlnTm90U3BlY2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGlhbG9nU2V0dGluZ3NBcmVWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiYgdGhpcy5jb25maWcuY29uZmlybVN0cmluZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy5jb25maXJtU3RyaW5nc05vdFNwZWNpZmllZCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGltZW91dElzRGVmaW5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKE1FU1NBR0VTLnRpbWVvdXROb3RTcGVjaWZpZWQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aW1lb3V0SXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpbWVvdXQgPCAxIHx8IHRoaXMuY29uZmlnLnRpbWVvdXQgPj0gMTgwMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0T3V0c2lkZVZhbGlkUmFuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZ1ZhbGlkYXRvcjtcbiIsImltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL2Zvcm1cIjtcbmltcG9ydCBEaWFsb2cgZnJvbSBcIi4uL25vdGlmaWNhdGlvbi9kaWFsb2dcIjtcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb25cIjtcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4uL3R5cGVzL2dldC1hbG9uZy1jb25maWdcIjtcbmltcG9ydCBJVXNlck5vdGlmaWNhdGlvbiBmcm9tIFwiLi4vdHlwZXMvdXNlci1ub3RpZmljYXRpb25cIjtcbmltcG9ydCBDb25maWdWYWxpZGF0b3IgZnJvbSBcIi4vY29uZmlnLXZhbGlkYXRvclwiO1xuXG5jbGFzcyBDb25maWcge1xuICAgIHByaXZhdGUgY29uZmlnOiBJR2V0QWxvbmdDb25maWc7XG4gICAgcHJpdmF0ZSBmb3JtOiBGb3JtO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBJR2V0QWxvbmdDb25maWcsIGZvcm06IEZvcm0pIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSB0aGlzLnBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgfVxuXG4gICAgLyoqIERlcml2ZXMgdGhlIHVzZXIgbm90aWZpY2F0aW9uLCBlaXRoZXIgYSBmb3JtIG5vdGlmaWNhdGlvbiBvciBhIGRpYWxvZywgZnJvbSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMuICovXG4gICAgcHVibGljIGdldFVzZXJOb3RpZmljYXRpb24oKTogSVVzZXJOb3RpZmljYXRpb24ge1xuICAgICAgICBjb25zdCBpc1VzZURpYWxvZ1NlbGVjdGVkID0gdGhpcy5jb25maWcuY29uZmlybURpYWxvZyA9PT0gdHJ1ZSAmJiB0aGlzLmNvbmZpZy5jb25maXJtU3RyaW5ncyAhPT0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCB1c2VyTm90aWZpY2F0aW9uID0gaXNVc2VEaWFsb2dTZWxlY3RlZCA/IHRoaXMuZ2V0RGlhbG9nKCkgOiB0aGlzLmdldE5vdGlmaWNhdGlvbigpO1xuXG4gICAgICAgIHJldHVybiB1c2VyTm90aWZpY2F0aW9uO1xuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGNvbmZpZyBwYXNzZWQgZnJvbSB0aGUgQ1JNIGZvcm0gcHJvcGVydGllcyBpcyB2YWxpZCBmb3IgdXNlLCBvdGhlcndpc2UgZmFsc2UuICovXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IG5ldyBDb25maWdWYWxpZGF0b3IodGhpcy5jb25maWcpO1xuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdG9yLmlzVmFsaWQoKTtcblxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vdGlmaWNhdGlvbigpOiBOb3RpZmljYXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbih0aGlzLmZvcm0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGlhbG9nKCk6IERpYWxvZyB7XG4gICAgICAgIHJldHVybiBuZXcgRGlhbG9nKHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzISwgdGhpcy5mb3JtLmZvcm1Db250ZXh0LCB0aGlzLmZvcm0ubWV0YWRhdGEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VDb25maWcoY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBJR2V0QWxvbmdDb25maWcge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiBjb25maWcsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29uZmlnO1xuIiwiaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuLi9jb25maWcvbWVzc2FnZXNcIjtcblxuLyoqIEhhbmRsZXMgZnVuY3Rpb24gY2FsbHMgYXQgYSBzZXQgdGltZSBpbnRlcnZhbC4gKi9cbmNsYXNzIFBvbGwge1xuICAgIC8qKlxuICAgICAqIFBvbGxzIGEgZnVuY3Rpb24gZXZlcnkgc3BlY2lmaWVkIG51bWJlciBvZiBzZWNvbmRzIHVudGlsIGl0IHJldHVybnMgdHJ1ZSBvciB0aW1lb3V0IGlzIHJlYWNoZWQuXG4gICAgICogQHBhcmFtIGZuIGNhbGxiYWNrIFByb21pc2UgdG8gcG9sbC5cbiAgICAgKiBAcGFyYW0gdGltZW91dCBzZWNvbmRzIHRvIGNvbnRpbnVlIHBvbGxpbmcgZm9yLlxuICAgICAqIEBwYXJhbSBpbnRlcnZhbCBzZWNvbmRzIGJldHdlZW4gcG9sbGluZyBjYWxscy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGwoZm46IGFueSwgdGltZW91dDogbnVtYmVyLCBpbnRlcnZhbDogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IE51bWJlcihuZXcgRGF0ZSgpKSArICh0aW1lb3V0ICogMTAwMCk7XG5cbiAgICAgICAgY29uc3QgY2hlY2tDb25kaXRpb24gPSAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGZuKCk7XG5cbiAgICAgICAgICAgIGNhbGxiYWNrLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyKG5ldyBEYXRlKCkpIDwgZW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNoZWNrQ29uZGl0aW9uLmJpbmQodGhpcyksIGludGVydmFsICogMTAwMCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoY29uc29sZS5sb2coTUVTU0FHRVMucG9sbGluZ1RpbWVvdXQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoY2hlY2tDb25kaXRpb24pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9sbDtcbiIsIi8qKiBDb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB1c2VkIGZvciBtYWtpbmcgZGF0YSBodW1hbi1yZWFkYWJsZS4gKi9cbmNsYXNzIFByb2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBtb2RpZmllZG9uIGRhdGUgYXMgYSByZWFkYWJsZSwgdXNlciBsb2NhbGUgc3RyaW5nLlxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgXCJtb2RpZmllZG9uXCIgY29sdW1uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc01vZGlmaWVkT25EYXRlKGFwaVJlc3BvbnNlKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkRhdGUgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRvbilcbiAgICAgICAgICAgID8gYCR7bmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikudG9EYXRlU3RyaW5nKCl9LGAgK1xuICAgICAgICAgICAgYCAke25ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pLnRvTG9jYWxlVGltZVN0cmluZygpfWBcbiAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRPblRpbWU7XG5cbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT25EYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgbW9kaWZpZWQgYnkgdXNlcidzIGZ1bGwgbmFtZS5cbiAgICAgKiBAcGFyYW0gYXBpUmVzcG9uc2UgQ1JNIEFQSSByZXNwb25zZSB0aGF0IGluY2x1ZGVzIGV4cGFuZGVkIFwibW9kaWZpZWRieS5mdWxsbmFtZVwiIGNvbHVtbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1vZGlmaWVkQnlVc2VyID0gKGFwaVJlc3BvbnNlICYmIGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieS5mdWxsbmFtZSlcbiAgICAgICAgICAgID8gYXBpUmVzcG9uc2UubW9kaWZpZWRieS5mdWxsbmFtZVxuICAgICAgICAgICAgOiB0aGlzLmRlZmF1bHRNb2RpZmllZEJ5VXNlcjtcblxuICAgICAgICByZXR1cm4gbW9kaWZpZWRCeVVzZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZGVmYXVsdE1vZGlmaWVkQnlVc2VyID0gXCJhbm90aGVyIHVzZXJcIjtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRPblRpbWUgPSBcInRoZSBzYW1lIHRpbWVcIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvY2Vzc29yO1xuIiwiLyoqIEludGVyYWN0cyBkaXJlY3RseSB3aXRoIHRoZSBYcm0gV2ViIEFQSS4gKi9cbmNsYXNzIFF1ZXJ5IHtcbiAgICAvKipcbiAgICAgKiBDYWxscyBDUk0gQVBJIGFuZCByZXR1cm5zIHRoZSBnaXZlbiBlbnRpdHkncyBtb2RpZmllZCBvbiBkYXRlLlxuICAgICAqIEBwYXJhbSBlbnRpdHlOYW1lIHNjaGVtYSBuYW1lIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXG4gICAgICogQHBhcmFtIGVudGl0eUlkIGlkIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBnZXRMYXRlc3RNb2RpZmllZE9uKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQsIGVudGl0eU5hbWU/OiBzdHJpbmcsIGVudGl0eUlkPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcbiAgICAgICAgdGhpcy5lbnRpdHlOYW1lID0gdGhpcy5lbnRpdHlOYW1lIHx8IGVudGl0eU5hbWUgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0RW50aXR5TmFtZSgpO1xuXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKHRoaXMuZW50aXR5TmFtZSwgdGhpcy5lbnRpdHlJZCxcbiAgICAgICAgICAgIFwiPyRzZWxlY3Q9bW9kaWZpZWRvbiYkZXhwYW5kPW1vZGlmaWVkYnkoJHNlbGVjdD1mdWxsbmFtZSlcIikudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgc3RhdGljIGVudGl0eU5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgUXVlcnk7XG4iLCJpbXBvcnQgUHJvY2Vzc29yIGZyb20gXCIuLi9kYXRhL3Byb2Nlc3NvclwiO1xuaW1wb3J0IFF1ZXJ5IGZyb20gXCIuLi9kYXRhL3F1ZXJ5XCI7XG5cbi8qKiBEYXRhIG9mIHRoZSByZWNvcmQgaW4gQ1JNLiAqL1xuY2xhc3MgRGF0YSB7XG4gICAgcHVibGljIGluaXRpYWxNb2RpZmllZE9uOiBEYXRlIHwgdW5kZWZpbmVkO1xuICAgIHB1YmxpYyBsYXRlc3RNb2RpZmllZE9uOiBzdHJpbmc7XG4gICAgcHVibGljIGxhdGVzdE1vZGlmaWVkQnk6IHN0cmluZztcblxuICAgIHByaXZhdGUgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcblxuICAgIGNvbnN0cnVjdG9yKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm1Db250ZXh0O1xuICAgICAgICB0aGlzLmFkZFJlc2V0T25TYXZlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXN5bmNocm9ub3VzbHkgaW5pdGlhbGlzZXMgZGF0YSwgY2FjaGluZyBpbml0aWFsIG1vZGlmaWVkIG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgICAgICBjb25zdCBhcGlSZXNwb25zZSA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24odGhpcy5mb3JtQ29udGV4dCk7XG4gICAgICAgIHRoaXMuY2FjaGVBcGlSZXNwb25zZShhcGlSZXNwb25zZSk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IGFwaVJlc3BvbnNlLm1vZGlmaWVkb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBtb2RpZmllZCBvbiBmcm9tIENSTSBzZXJ2ZXIuIFJldHVybnMgdHJ1ZSBpZiBpdCBoYXMgY2hhbmdlZCwgYW5kIG5vdGlmaWVzIHRoZSB1c2VyLlxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBjaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQobm90aWZpY2F0aW9uQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxNb2RpZmllZE9uKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFwaVJlc3BvbnNlID0gYXdhaXQgUXVlcnkuZ2V0TGF0ZXN0TW9kaWZpZWRPbih0aGlzLmZvcm1Db250ZXh0KTtcblxuICAgICAgICBjb25zdCBtb2RpZmllZE9uSGFzQ2hhbmdlZCA9IGFwaVJlc3BvbnNlLm1vZGlmaWVkb24gJiZcbiAgICAgICAgICAgIChuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKSA+IG5ldyBEYXRlKHRoaXMuaW5pdGlhbE1vZGlmaWVkT24hKSlcbiAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgIGlmIChtb2RpZmllZE9uSGFzQ2hhbmdlZCAmJiBub3RpZmljYXRpb25DYWxsYmFjaykge1xuICAgICAgICAgICAgbm90aWZpY2F0aW9uQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uSGFzQ2hhbmdlZDtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBtb2RpZmllZCBvbiBjYWNoZSB3aGVuIGZvcm0gaXMgc2F2ZWQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhZGRSZXNldE9uU2F2ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hZGRPblNhdmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWNoZUFwaVJlc3BvbnNlKGFwaVJlc3BvbnNlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZEJ5ID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk7XG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRPbiA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRPbkRhdGUoYXBpUmVzcG9uc2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YTtcbiIsIi8qKiBSZWNvcmQgbWV0YWRhdGEgdXNlZCB0byBxdWVyeSB0aGUgQ1JNIEFQSS4gKi9cbmNsYXNzIE1ldGFkYXRhIHtcbiAgICBwdWJsaWMgZW50aXR5SWQ6IHN0cmluZztcbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xuICAgICAgICB0aGlzLmVudGl0eUlkID0gZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcbiAgICAgICAgdGhpcy5lbnRpdHlOYW1lID0gZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0RW50aXR5TmFtZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByZXZlbnRzIGZvcm0gYXR0cmlidXRlcyBmcm9tIGJlaW5nIHN1Ym1pdHRlZCB3aGVuIHRoZSByZWNvcmQgaXMgc2F2ZWQuXG4gICAgICovXG4gICAgcHVibGljIHByZXZlbnRTYXZlKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRTdWJtaXRNb2RlKFwibmV2ZXJcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWV0YWRhdGE7XG4iLCJpbXBvcnQgRGF0YSBmcm9tIFwiLi9kYXRhXCI7XG5pbXBvcnQgTWV0YWRhdGEgZnJvbSBcIi4vbWV0YWRhdGFcIjtcblxuLyoqIEEgZm9ybSBpbiBEeW5hbWljcyAzNjUgQ0UuICovXG5jbGFzcyBGb3JtIHtcbiAgICBwdWJsaWMgZGF0YTogRGF0YTtcbiAgICBwdWJsaWMgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcbiAgICBwdWJsaWMgbWV0YWRhdGE6IE1ldGFkYXRhO1xuXG4gICAgY29uc3RydWN0b3IoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0KSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBleGVjdXRpb25Db250ZXh0LmdldEZvcm1Db250ZXh0KCk7XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICB0aGlzLm1ldGFkYXRhID0gbmV3IE1ldGFkYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFzeW5jcm9ub3VzbHkgaW5pdGlhbGlzZXMgZm9ybSBkYXRhLlxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgICAgICB0aGlzLmRhdGEuaW5pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbG9hZHMgdGhlIGZvcm0uXG4gICAgICovXG4gICAgcHVibGljIHJlbG9hZCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZW50aXR5SWQgPSB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCk7XG4gICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcblxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuRm9ybSh7IGVudGl0eUlkLCBlbnRpdHlOYW1lIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZm9ybSB0eXBlIGlzIG5vdCBjcmVhdGUgb3IgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBmb3JtVHlwZTogWHJtRW51bS5Gb3JtVHlwZSA9IHRoaXMuZm9ybUNvbnRleHQudWkuZ2V0Rm9ybVR5cGUoKTtcblxuICAgICAgICByZXR1cm4gZm9ybVR5cGUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgZm9ybVR5cGUgIT09IDAgJiZcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAxO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybTtcbiIsImltcG9ydCBDb25maWcgZnJvbSBcIi4vY29uZmlnL2NvbmZpZ1wiO1xuaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuL2NvbmZpZy9tZXNzYWdlc1wiO1xuaW1wb3J0IFBvbGwgZnJvbSBcIi4vZGF0YS9wb2xsXCI7XG5pbXBvcnQgRm9ybSBmcm9tIFwiLi9mb3JtL2Zvcm1cIjtcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4vdHlwZXMvZ2V0LWFsb25nLWNvbmZpZ1wiO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gXCIuL3R5cGVzL3VzZXItbm90aWZpY2F0aW9uXCI7XG5cbi8qKlxuICogTm90aWZpZXMgdXNlcnMgd2hlbiBhIHJlY29yZCB0aGV5J3JlIHZpZXdpbmcgaXMgbW9kaWZpZWQgZWxzZXdoZXJlLlxuICovXG5jbGFzcyBHZXRBbG9uZyB7XG4gICAgLyoqIENoZWNrcyBmb3IgY29uZmxpY3RzIGFuZCBub3RpZmllcyB0aGUgdXNlciBpZiBhbnkgYXJlIGZvdW5kLiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgY2hlY2tGb3JDb25mbGljdHMoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCBjb25maWc6IElHZXRBbG9uZ0NvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc2Z1bEluaXQ6IGJvb2xlYW4gPSBhd2FpdCBHZXRBbG9uZy5pbml0KGV4ZWN1dGlvbkNvbnRleHQsIGNvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghc3VjY2Vzc2Z1bEluaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEdldEFsb25nLmZvcm0uZGF0YS5jaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbi5vcGVuLmJpbmQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbikpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGAke01FU1NBR0VTLmdlbmVyaWN9ICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBvbGxzIGZvciBjb25mbGljdHMgYW5kIG5vdGlmaWVzIHRoZSB1c2VyIGlmIGFueSBhcmUgZm91bmQuXG4gICAgICogQHBhcmFtIGV4ZWN1dGlvbkNvbnRleHQgcGFzc2VkIGJ5IGRlZmF1bHQgZnJvbSBEeW5hbWljcyBDUk0gZm9ybS5cbiAgICAgKiBAcGFyYW0gdGltZW91dCBkdXJhdGlvbiBpbiBzZWNvbmRzIHRvIHRpbWVvdXQgYmV0d2VlbiBwb2xsIG9wZXJhdGlvbnMuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsRm9yQ29uZmxpY3RzKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NmdWxJbml0OiBib29sZWFuID0gYXdhaXQgR2V0QWxvbmcuaW5pdChleGVjdXRpb25Db250ZXh0LCBjb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIXN1Y2Nlc3NmdWxJbml0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBQb2xsLnBvbGwoKCkgPT4gdGhpcy5mb3JtLmRhdGEuY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24ub3Blbi5iaW5kKEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24pKSwgMTgwMCAvIGNvbmZpZy50aW1lb3V0LCBjb25maWcudGltZW91dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uZmlnOiBDb25maWc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZm9ybTogRm9ybTtcbiAgICBwcml2YXRlIHN0YXRpYyB1c2VyTm90aWZpY2F0aW9uOiBJVXNlck5vdGlmaWNhdGlvbjtcblxuICAgIC8qKiBJbml0aWFsaXNlcyBHZXQgQWxvbmcuIFJldHVybnMgdHJ1ZSBpZiBzdWNjZXNzZnVsLCBvdGhlcndpc2UgZmFsc2UuICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgaW5pdChleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQsIGNvbmZpZzogSUdldEFsb25nQ29uZmlnKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIEdldEFsb25nLmZvcm0gPSBHZXRBbG9uZy5mb3JtIHx8IG5ldyBGb3JtKGV4ZWN1dGlvbkNvbnRleHQpO1xuICAgICAgICBhd2FpdCBHZXRBbG9uZy5mb3JtLmluaXQoKTtcblxuICAgICAgICBpZiAoIUdldEFsb25nLmZvcm0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNRVNTQUdFUy5mb3JtSXNJbnZhbGlkKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgR2V0QWxvbmcuY29uZmlnID0gR2V0QWxvbmcuY29uZmlnIHx8IG5ldyBDb25maWcoY29uZmlnLCBHZXRBbG9uZy5mb3JtKTtcblxuICAgICAgICBpZiAoIUdldEFsb25nLmNvbmZpZy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1FU1NBR0VTLmNvbmZpZ0lzSW52YWxpZCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24gPSBHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uIHx8IEdldEFsb25nLmNvbmZpZy5nZXRVc2VyTm90aWZpY2F0aW9uKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2V0QWxvbmc7XG4iXSwibmFtZXMiOltd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
