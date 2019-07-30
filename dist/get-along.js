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
            this.defaultConfirmButtonLabel = 'Refresh';
            this.defaultCancelButtonLabel = 'Close';
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
            var confirmOptions = {
                height: this.ui.defaultHeight,
                width: this.ui.defaultWidth,
            };
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
                this.formContext.ui.setFormNotification(this.getNotificationText(), 'INFO', 'GetAlongNotification');
            }
        };
        Notification.prototype.getNotificationText = function () {
            var text = "This form has been modified by " + this.data.latestModifiedBy + " at " + this.data.latestModifiedOn + ". Refresh the form to see latest changes.";
            return text;
        };
        return Notification;
    }());

    var projectName = 'getalong.js';
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
            if (this.config.confirmDialog === true &&
                this.config.confirmStrings === undefined) {
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
            var isUseDialogSelected = this.config.confirmDialog === true &&
                this.config.confirmStrings !== undefined;
            var userNotification = isUseDialogSelected
                ? this.getDialog()
                : this.getNotification();
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
            if (typeof config === 'number') {
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
                    endTime = Number(new Date()) + timeout * 1000;
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
            var modifiedOnDate = apiResponse && apiResponse.modifiedon
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
            var modifiedByUser = apiResponse &&
                apiResponse.modifiedby &&
                apiResponse.modifiedby.fullname
                ? apiResponse.modifiedby.fullname
                : this.defaultModifiedByUser;
            return modifiedByUser;
        };
        Processor.defaultModifiedByUser = 'another user';
        Processor.defaultModifiedOnTime = 'the same time';
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
                    this.entityId =
                        this.entityId || entityId || formContext.data.entity.getId();
                    this.entityName =
                        this.entityName ||
                            entityName ||
                            formContext.data.entity.getEntityName();
                    return [2 /*return*/, Xrm.WebApi.retrieveRecord(this.entityName, this.entityId, '?$select=modifiedon&$expand=modifiedby($select=fullname)').then(function (response) {
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
                                new Date(apiResponse.modifiedon) > new Date(this.initialModifiedOn)
                                ? true
                                : false;
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
                attribute.setSubmitMode('never');
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
            return formType !== undefined && formType !== 0 && formType !== 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWFsb25nLmpzIiwic291cmNlcyI6WyIuLi9zcmMvbm90aWZpY2F0aW9uL2RpYWxvZy11aS50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vZGlhbG9nLnRzIiwiLi4vc3JjL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24udHMiLCIuLi9zcmMvY29uZmlnL21lc3NhZ2VzLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWctdmFsaWRhdG9yLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWcudHMiLCIuLi9zcmMvZGF0YS9wb2xsLnRzIiwiLi4vc3JjL2RhdGEvcHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RhdGEvcXVlcnkudHMiLCIuLi9zcmMvZm9ybS9kYXRhLnRzIiwiLi4vc3JjL2Zvcm0vbWV0YWRhdGEudHMiLCIuLi9zcmMvZm9ybS9mb3JtLnRzIiwiLi4vc3JjL2dldC1hbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUNvbmZpcm1TdHJpbmdzIGZyb20gJy4uL3R5cGVzL2NvbmZpcm0tc3RyaW5ncyc7XG5cbi8qKiBVaSBvZiB0aGUgZm9ybSBkaWFsb2cuICovXG5jbGFzcyBEaWFsb2dVaSB7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRIZWlnaHQ6IG51bWJlciA9IDIwMDtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdFdpZHRoOiBudW1iZXIgPSA0NTA7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRDb25maXJtQnV0dG9uTGFiZWw6IHN0cmluZyA9ICdSZWZyZXNoJztcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsOiBzdHJpbmcgPSAnQ2xvc2UnO1xuXG4gICAgcHJpdmF0ZSBjb25maXJtU3RyaW5nczogSUNvbmZpcm1TdHJpbmdzO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncykge1xuICAgICAgICB0aGlzLmNvbmZpcm1TdHJpbmdzID0gY29uZmlybVN0cmluZ3M7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzKCk6IFhybS5OYXZpZ2F0aW9uLkNvbmZpcm1TdHJpbmdzIHtcbiAgICAgICAgY29uc3QgY29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHM6IFhybS5OYXZpZ2F0aW9uLkNvbmZpcm1TdHJpbmdzID0ge1xuICAgICAgICAgICAgY2FuY2VsQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsLFxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkxhYmVsOiB0aGlzLmRlZmF1bHRDb25maXJtQnV0dG9uTGFiZWwsXG4gICAgICAgICAgICBzdWJ0aXRsZTogdGhpcy5jb25maXJtU3RyaW5ncy5zdWJ0aXRsZSxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlybVN0cmluZ3MudGV4dCxcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmNvbmZpcm1TdHJpbmdzLnRpdGxlLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpYWxvZ1VpO1xuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gJy4uL2Zvcm0vbWV0YWRhdGEnO1xuaW1wb3J0IElDb25maXJtU3RyaW5ncyBmcm9tICcuLi90eXBlcy9jb25maXJtLXN0cmluZ3MnO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gJy4uL3R5cGVzL3VzZXItbm90aWZpY2F0aW9uJztcbmltcG9ydCBEaWFsb2dVaSBmcm9tICcuL2RpYWxvZy11aSc7XG5cbi8qKiBDb25maXJtIGRpYWxvZyBub3RpZnlpbmcgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QuICovXG5jbGFzcyBEaWFsb2cgaW1wbGVtZW50cyBJVXNlck5vdGlmaWNhdGlvbiB7XG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xuICAgIHByaXZhdGUgbWV0YWRhdGE6IE1ldGFkYXRhO1xuICAgIHByaXZhdGUgdWk6IERpYWxvZ1VpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNvbmZpcm1TdHJpbmdzOiBJQ29uZmlybVN0cmluZ3MsXG4gICAgICAgIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQsXG4gICAgICAgIG1ldGFkYXRhOiBNZXRhZGF0YVxuICAgICkge1xuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybUNvbnRleHQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgdGhpcy51aSA9IG5ldyBEaWFsb2dVaShjb25maXJtU3RyaW5ncyk7XG4gICAgfVxuXG4gICAgLyoqIE9wZW5zIHRoZSBkaWFsb2csIG5vdGlmeWluZyB1c2VyIG9mIGEgY29uZmxpY3QuICovXG4gICAgcHVibGljIG9wZW4oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5vcGVuQ2FsbGJhY2soXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFkYXRhLnByZXZlbnRTYXZlKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFyZW50LmxvY2F0aW9uLnJlbG9hZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YWRhdGEucHJldmVudFNhdmUodGhpcy5mb3JtQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBvcGVuQ2FsbGJhY2soXG4gICAgICAgIGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCxcbiAgICAgICAgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWRcbiAgICApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY29uZmlybU9wdGlvbnMgPSB7XG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMudWkuZGVmYXVsdEhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29uZmlybVN0cmluZ3MgPSB0aGlzLnVpLmdldENvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzKCk7XG5cbiAgICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkNvbmZpcm1EaWFsb2coY29uZmlybVN0cmluZ3MsIGNvbmZpcm1PcHRpb25zKS50aGVuKFxuICAgICAgICAgICAgc3VjY2VzcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MuY29uZmlybWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1DYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nO1xuIiwiaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gJy4uL3R5cGVzL3VzZXItbm90aWZpY2F0aW9uJztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vZm9ybSc7XG5pbXBvcnQgRGF0YSBmcm9tICcuLi9mb3JtL2RhdGEnO1xuXG4vKiogRm9ybSBub3RpZmljYXRpb24gYmFubmVyIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cbmNsYXNzIE5vdGlmaWNhdGlvbiBpbXBsZW1lbnRzIElVc2VyTm90aWZpY2F0aW9uIHtcbiAgICBwdWJsaWMgaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGRhdGE6IERhdGE7XG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xuXG4gICAgY29uc3RydWN0b3IoZm9ybTogRm9ybSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBmb3JtLmRhdGE7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtLmZvcm1Db250ZXh0O1xuICAgIH1cblxuICAgIC8qKiBPcGVucyB0aGUgbm90aWZpY2F0aW9uLCBub3RpZnlpbmcgdXNlciBvZiBhIGNvbmZsaWN0LiAqL1xuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5nZXROb3RpZmljYXRpb25UZXh0KCksXG4gICAgICAgICAgICAgICAgJ0lORk8nLFxuICAgICAgICAgICAgICAgICdHZXRBbG9uZ05vdGlmaWNhdGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vdGlmaWNhdGlvblRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGBUaGlzIGZvcm0gaGFzIGJlZW4gbW9kaWZpZWQgYnkgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRCeX0gYXQgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRPbn0uIFJlZnJlc2ggdGhlIGZvcm0gdG8gc2VlIGxhdGVzdCBjaGFuZ2VzLmA7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTm90aWZpY2F0aW9uO1xuIiwiY29uc3QgcHJvamVjdE5hbWUgPSAnZ2V0YWxvbmcuanMnO1xuY29uc3QgY29uZmlnSXNJbnZhbGlkID0gYCR7cHJvamVjdE5hbWV9IGNvbmZpZyBpcyBpbnZhbGlkLmA7XG5cbmNvbnN0IE1FU1NBR0VTID0ge1xuICAgIGNvbmZpZ0lzSW52YWxpZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBhbmQgdGhlcmVmb3JlIHdvbid0IGxvYWRgLFxuICAgIGNvbmZpZ05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyBjb25maWcgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXG4gICAgY29uZmlybVN0cmluZ3NOb3RTcGVjaWZpZWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gVXNlIGRpYWxvZyBoYXMgYmVlbiBzZWxlY3RlZCBidXQgbm8gY29uZmlybSBzdHJpbmdzIGhhdmUgYmVlbiBwYXNzZWQuYCxcbiAgICBmb3JtSXNJbnZhbGlkOiBgJHtwcm9qZWN0TmFtZX0gdGhpbmtzIHRoZSBmb3JtIGlzIGludmFsaWQgYW5kIHRoZXJlZm9yZSB3b24ndCBsb2FkYCxcbiAgICBnZW5lcmljOiBgJHtwcm9qZWN0TmFtZX0gaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLmAsXG4gICAgcG9sbGluZ1RpbWVvdXQ6IGAke3Byb2plY3ROYW1lfSBoYXMgYmVlbiBwb2xsaW5nIGZvciAzMCBtaW51dGVzIGFuZCB3aWxsIHN0b3Agbm93LmAsXG4gICAgdGltZW91dE5vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyB0aW1lb3V0IGhhcyBiZWVuIHNwZWNpZmllZC5gLFxuICAgIHRpbWVvdXRPdXRzaWRlVmFsaWRSYW5nZTogYCR7Y29uZmlnSXNJbnZhbGlkfSBUaW1lb3V0IGlzIG91dHNpZGUgb2YgdmFsaWQgcmFuZ2UuYCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1FU1NBR0VTO1xuIiwiaW1wb3J0IElHZXRBbG9uZ0NvbmZpZyBmcm9tICcuLi90eXBlcy9nZXQtYWxvbmctY29uZmlnJztcbmltcG9ydCBNRVNTQUdFUyBmcm9tICcuL21lc3NhZ2VzJztcblxuLyoqIFZhbGlkYXRlcyB0aGUgY29uZmlnIHBhc3NlZCBieSBDUk0gZm9ybSBwcm9wZXJ0aWVzLiAqL1xuY2xhc3MgQ29uZmlnVmFsaWRhdG9yIHtcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xuICAgIHByaXZhdGUgdmFsaWRhdGlvblJ1bGVzOiBBcnJheTwoKSA9PiBib29sZWFuPjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLnZhbGlkYXRpb25SdWxlcyA9IFtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnSXNEZWZpbmVkLmJpbmQodGhpcyksXG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1NldHRpbmdzQXJlVmFsaWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHRoaXMudGltZW91dElzRGVmaW5lZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SXNWYWxpZC5iaW5kKHRoaXMpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGNvbmZpZyBpcyB2YWxpZCwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0aW9uUnVsZXMuZXZlcnkoXG4gICAgICAgICAgICAoZm46ICgpID0+IGJvb2xlYW4pID0+IGZuKCkgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdJc0RlZmluZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTUVTU0FHRVMuY29uZmlnTm90U3BlY2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGlhbG9nU2V0dGluZ3NBcmVWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jb25maWcuY29uZmlybURpYWxvZyA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5jb25maWcuY29uZmlybVN0cmluZ3MgPT09IHVuZGVmaW5lZFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTUVTU0FHRVMuY29uZmlybVN0cmluZ3NOb3RTcGVjaWZpZWQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRpbWVvdXRJc0RlZmluZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0Tm90U3BlY2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGltZW91dElzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0IDwgMSB8fCB0aGlzLmNvbmZpZy50aW1lb3V0ID49IDE4MDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTUVTU0FHRVMudGltZW91dE91dHNpZGVWYWxpZFJhbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25maWdWYWxpZGF0b3I7XG4iLCJpbXBvcnQgRm9ybSBmcm9tICcuLi9mb3JtL2Zvcm0nO1xuaW1wb3J0IERpYWxvZyBmcm9tICcuLi9ub3RpZmljYXRpb24vZGlhbG9nJztcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi4vbm90aWZpY2F0aW9uL25vdGlmaWNhdGlvbic7XG5pbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gJy4uL3R5cGVzL2dldC1hbG9uZy1jb25maWcnO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gJy4uL3R5cGVzL3VzZXItbm90aWZpY2F0aW9uJztcbmltcG9ydCBDb25maWdWYWxpZGF0b3IgZnJvbSAnLi9jb25maWctdmFsaWRhdG9yJztcblxuY2xhc3MgQ29uZmlnIHtcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xuICAgIHByaXZhdGUgZm9ybTogRm9ybTtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnLCBmb3JtOiBGb3JtKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5wYXJzZUNvbmZpZyhjb25maWcpO1xuICAgICAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICAgIH1cblxuICAgIC8qKiBEZXJpdmVzIHRoZSB1c2VyIG5vdGlmaWNhdGlvbiwgZWl0aGVyIGEgZm9ybSBub3RpZmljYXRpb24gb3IgYSBkaWFsb2csIGZyb20gY29uZmlnIHBhc3NlZCBmcm9tIHRoZSBDUk0gZm9ybSBwcm9wZXJ0aWVzLiAqL1xuICAgIHB1YmxpYyBnZXRVc2VyTm90aWZpY2F0aW9uKCk6IElVc2VyTm90aWZpY2F0aW9uIHtcbiAgICAgICAgY29uc3QgaXNVc2VEaWFsb2dTZWxlY3RlZCA9XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jb25maXJtRGlhbG9nID09PSB0cnVlICYmXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jb25maXJtU3RyaW5ncyAhPT0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCB1c2VyTm90aWZpY2F0aW9uID0gaXNVc2VEaWFsb2dTZWxlY3RlZFxuICAgICAgICAgICAgPyB0aGlzLmdldERpYWxvZygpXG4gICAgICAgICAgICA6IHRoaXMuZ2V0Tm90aWZpY2F0aW9uKCk7XG5cbiAgICAgICAgcmV0dXJuIHVzZXJOb3RpZmljYXRpb247XG4gICAgfVxuXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY29uZmlnIHBhc3NlZCBmcm9tIHRoZSBDUk0gZm9ybSBwcm9wZXJ0aWVzIGlzIHZhbGlkIGZvciB1c2UsIG90aGVyd2lzZSBmYWxzZS4gKi9cbiAgICBwdWJsaWMgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gbmV3IENvbmZpZ1ZhbGlkYXRvcih0aGlzLmNvbmZpZyk7XG4gICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0b3IuaXNWYWxpZCgpO1xuXG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Tm90aWZpY2F0aW9uKCk6IE5vdGlmaWNhdGlvbiB7XG4gICAgICAgIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKHRoaXMuZm9ybSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREaWFsb2coKTogRGlhbG9nIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEaWFsb2coXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jb25maXJtU3RyaW5ncyEsXG4gICAgICAgICAgICB0aGlzLmZvcm0uZm9ybUNvbnRleHQsXG4gICAgICAgICAgICB0aGlzLmZvcm0ubWV0YWRhdGFcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlQ29uZmlnKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKTogSUdldEFsb25nQ29uZmlnIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IGNvbmZpZyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25maWc7XG4iLCJpbXBvcnQgTUVTU0FHRVMgZnJvbSAnLi4vY29uZmlnL21lc3NhZ2VzJztcblxuLyoqIEhhbmRsZXMgZnVuY3Rpb24gY2FsbHMgYXQgYSBzZXQgdGltZSBpbnRlcnZhbC4gKi9cbmNsYXNzIFBvbGwge1xuICAgIC8qXG4gICAgICogVHJ1ZSBpZiBwb2xsIGlzIGFjdGl2ZSwgb3RoZXJ3aXNlIGZhbHNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFBvbGxzIGEgZnVuY3Rpb24gZXZlcnkgc3BlY2lmaWVkIG51bWJlciBvZiBzZWNvbmRzIHVudGlsIGl0IHJldHVybnMgdHJ1ZSBvciB0aW1lb3V0IGlzIHJlYWNoZWQuXG4gICAgICogQHBhcmFtIGZuIGNhbGxiYWNrIFByb21pc2UgdG8gcG9sbC5cbiAgICAgKiBAcGFyYW0gdGltZW91dCBzZWNvbmRzIHRvIGNvbnRpbnVlIHBvbGxpbmcgZm9yLlxuICAgICAqIEBwYXJhbSBpbnRlcnZhbCBzZWNvbmRzIGJldHdlZW4gcG9sbGluZyBjYWxscy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGwoXG4gICAgICAgIGZuOiBhbnksXG4gICAgICAgIHRpbWVvdXQ6IG51bWJlcixcbiAgICAgICAgaW50ZXJ2YWw6IG51bWJlclxuICAgICk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSBOdW1iZXIobmV3IERhdGUoKSkgKyB0aW1lb3V0ICogMTAwMDtcblxuICAgICAgICBjb25zdCBjaGVja0NvbmRpdGlvbiA9IChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gZm4oKTtcblxuICAgICAgICAgICAgY2FsbGJhY2sudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyKG5ldyBEYXRlKCkpIDwgZW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tDb25kaXRpb24uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVydmFsICogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoY29uc29sZS5sb2coTUVTU0FHRVMucG9sbGluZ1RpbWVvdXQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoY2hlY2tDb25kaXRpb24pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9sbDtcbiIsIi8qKiBDb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB1c2VkIGZvciBtYWtpbmcgZGF0YSBodW1hbi1yZWFkYWJsZS4gKi9cbmNsYXNzIFByb2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBtb2RpZmllZG9uIGRhdGUgYXMgYSByZWFkYWJsZSwgdXNlciBsb2NhbGUgc3RyaW5nLlxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgXCJtb2RpZmllZG9uXCIgY29sdW1uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc01vZGlmaWVkT25EYXRlKGFwaVJlc3BvbnNlKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkRhdGUgPVxuICAgICAgICAgICAgYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRvblxuICAgICAgICAgICAgICAgID8gYCR7bmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikudG9EYXRlU3RyaW5nKCl9LGAgK1xuICAgICAgICAgICAgICAgICAgYCAke25ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pLnRvTG9jYWxlVGltZVN0cmluZygpfWBcbiAgICAgICAgICAgICAgICA6IHRoaXMuZGVmYXVsdE1vZGlmaWVkT25UaW1lO1xuXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uRGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIG1vZGlmaWVkIGJ5IHVzZXIncyBmdWxsIG5hbWUuXG4gICAgICogQHBhcmFtIGFwaVJlc3BvbnNlIENSTSBBUEkgcmVzcG9uc2UgdGhhdCBpbmNsdWRlcyBleHBhbmRlZCBcIm1vZGlmaWVkYnkuZnVsbG5hbWVcIiBjb2x1bW4uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtb2RpZmllZEJ5VXNlciA9XG4gICAgICAgICAgICBhcGlSZXNwb25zZSAmJlxuICAgICAgICAgICAgYXBpUmVzcG9uc2UubW9kaWZpZWRieSAmJlxuICAgICAgICAgICAgYXBpUmVzcG9uc2UubW9kaWZpZWRieS5mdWxsbmFtZVxuICAgICAgICAgICAgICAgID8gYXBpUmVzcG9uc2UubW9kaWZpZWRieS5mdWxsbmFtZVxuICAgICAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRCeVVzZXI7XG5cbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkQnlVc2VyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRNb2RpZmllZEJ5VXNlciA9ICdhbm90aGVyIHVzZXInO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRNb2RpZmllZE9uVGltZSA9ICd0aGUgc2FtZSB0aW1lJztcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvY2Vzc29yO1xuIiwiLyoqIEludGVyYWN0cyBkaXJlY3RseSB3aXRoIHRoZSBYcm0gV2ViIEFQSS4gKi9cbmNsYXNzIFF1ZXJ5IHtcbiAgICAvKipcbiAgICAgKiBDYWxscyBDUk0gQVBJIGFuZCByZXR1cm5zIHRoZSBnaXZlbiBlbnRpdHkncyBtb2RpZmllZCBvbiBkYXRlLlxuICAgICAqIEBwYXJhbSBlbnRpdHlOYW1lIHNjaGVtYSBuYW1lIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXG4gICAgICogQHBhcmFtIGVudGl0eUlkIGlkIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBnZXRMYXRlc3RNb2RpZmllZE9uKFxuICAgICAgICBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LFxuICAgICAgICBlbnRpdHlOYW1lPzogc3RyaW5nLFxuICAgICAgICBlbnRpdHlJZD86IHN0cmluZ1xuICAgICk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHRoaXMuZW50aXR5SWQgPVxuICAgICAgICAgICAgdGhpcy5lbnRpdHlJZCB8fCBlbnRpdHlJZCB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPVxuICAgICAgICAgICAgdGhpcy5lbnRpdHlOYW1lIHx8XG4gICAgICAgICAgICBlbnRpdHlOYW1lIHx8XG4gICAgICAgICAgICBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XG5cbiAgICAgICAgcmV0dXJuIFhybS5XZWJBcGkucmV0cmlldmVSZWNvcmQoXG4gICAgICAgICAgICB0aGlzLmVudGl0eU5hbWUsXG4gICAgICAgICAgICB0aGlzLmVudGl0eUlkLFxuICAgICAgICAgICAgJz8kc2VsZWN0PW1vZGlmaWVkb24mJGV4cGFuZD1tb2RpZmllZGJ5KCRzZWxlY3Q9ZnVsbG5hbWUpJ1xuICAgICAgICApLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgc3RhdGljIGVudGl0eU5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgUXVlcnk7XG4iLCJpbXBvcnQgUHJvY2Vzc29yIGZyb20gJy4uL2RhdGEvcHJvY2Vzc29yJztcbmltcG9ydCBRdWVyeSBmcm9tICcuLi9kYXRhL3F1ZXJ5JztcblxuLyoqIERhdGEgb2YgdGhlIHJlY29yZCBpbiBDUk0uICovXG5jbGFzcyBEYXRhIHtcbiAgICBwdWJsaWMgaW5pdGlhbE1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XG4gICAgcHVibGljIGxhdGVzdE1vZGlmaWVkT246IHN0cmluZztcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRCeTogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xuXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybUNvbnRleHQ7XG4gICAgICAgIHRoaXMuYWRkUmVzZXRPblNhdmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc3luY2hyb25vdXNseSBpbml0aWFsaXNlcyBkYXRhLCBjYWNoaW5nIGluaXRpYWwgbW9kaWZpZWQgb24uXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIGNvbnN0IGFwaVJlc3BvbnNlID0gYXdhaXQgUXVlcnkuZ2V0TGF0ZXN0TW9kaWZpZWRPbih0aGlzLmZvcm1Db250ZXh0KTtcbiAgICAgICAgdGhpcy5jYWNoZUFwaVJlc3BvbnNlKGFwaVJlc3BvbnNlKTtcblxuICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gYXBpUmVzcG9uc2UubW9kaWZpZWRvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIG1vZGlmaWVkIG9uIGZyb20gQ1JNIHNlcnZlci4gUmV0dXJucyB0cnVlIGlmIGl0IGhhcyBjaGFuZ2VkLCBhbmQgbm90aWZpZXMgdGhlIHVzZXIuXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIGNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZChcbiAgICAgICAgbm90aWZpY2F0aW9uQ2FsbGJhY2s6ICgpID0+IHZvaWRcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxNb2RpZmllZE9uKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFwaVJlc3BvbnNlID0gYXdhaXQgUXVlcnkuZ2V0TGF0ZXN0TW9kaWZpZWRPbih0aGlzLmZvcm1Db250ZXh0KTtcblxuICAgICAgICBjb25zdCBtb2RpZmllZE9uSGFzQ2hhbmdlZCA9XG4gICAgICAgICAgICBhcGlSZXNwb25zZS5tb2RpZmllZG9uICYmXG4gICAgICAgICAgICBuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKSA+IG5ldyBEYXRlKHRoaXMuaW5pdGlhbE1vZGlmaWVkT24hKVxuICAgICAgICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgICAgICAgIDogZmFsc2U7XG5cbiAgICAgICAgaWYgKG1vZGlmaWVkT25IYXNDaGFuZ2VkICYmIG5vdGlmaWNhdGlvbkNhbGxiYWNrKSB7XG4gICAgICAgICAgICBub3RpZmljYXRpb25DYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT25IYXNDaGFuZ2VkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBtb2RpZmllZCBvbiBjYWNoZSB3aGVuIGZvcm0gaXMgc2F2ZWQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhZGRSZXNldE9uU2F2ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hZGRPblNhdmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWNoZUFwaVJlc3BvbnNlKGFwaVJlc3BvbnNlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZEJ5ID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk7XG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRPbiA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRPbkRhdGUoYXBpUmVzcG9uc2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YTtcbiIsIi8qKiBSZWNvcmQgbWV0YWRhdGEgdXNlZCB0byBxdWVyeSB0aGUgQ1JNIEFQSS4gKi9cbmNsYXNzIE1ldGFkYXRhIHtcbiAgICBwdWJsaWMgZW50aXR5SWQ6IHN0cmluZztcbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xuICAgICAgICB0aGlzLmVudGl0eUlkID0gZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcbiAgICAgICAgdGhpcy5lbnRpdHlOYW1lID0gZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0RW50aXR5TmFtZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByZXZlbnRzIGZvcm0gYXR0cmlidXRlcyBmcm9tIGJlaW5nIHN1Ym1pdHRlZCB3aGVuIHRoZSByZWNvcmQgaXMgc2F2ZWQuXG4gICAgICovXG4gICAgcHVibGljIHByZXZlbnRTYXZlKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuYXR0cmlidXRlcy5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGUuc2V0U3VibWl0TW9kZSgnbmV2ZXInKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZXRhZGF0YTtcbiIsImltcG9ydCBEYXRhIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgTWV0YWRhdGEgZnJvbSAnLi9tZXRhZGF0YSc7XG5cbi8qKiBBIGZvcm0gaW4gRHluYW1pY3MgMzY1IENFLiAqL1xuY2xhc3MgRm9ybSB7XG4gICAgcHVibGljIGRhdGE6IERhdGE7XG4gICAgcHVibGljIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XG4gICAgcHVibGljIG1ldGFkYXRhOiBNZXRhZGF0YTtcblxuICAgIGNvbnN0cnVjdG9yKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCkge1xuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZXhlY3V0aW9uQ29udGV4dC5nZXRGb3JtQ29udGV4dCgpO1xuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YSh0aGlzLmZvcm1Db250ZXh0KTtcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG5ldyBNZXRhZGF0YSh0aGlzLmZvcm1Db250ZXh0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc3luY3Jvbm91c2x5IGluaXRpYWxpc2VzIGZvcm0gZGF0YS5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmluaXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWxvYWRzIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWxvYWQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGVudGl0eUlkID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XG5cbiAgICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkZvcm0oeyBlbnRpdHlJZCwgZW50aXR5TmFtZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZvcm0gdHlwZSBpcyBub3QgY3JlYXRlIG9yIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZm9ybVR5cGU6IFhybUVudW0uRm9ybVR5cGUgPSB0aGlzLmZvcm1Db250ZXh0LnVpLmdldEZvcm1UeXBlKCk7XG5cbiAgICAgICAgcmV0dXJuIGZvcm1UeXBlICE9PSB1bmRlZmluZWQgJiYgZm9ybVR5cGUgIT09IDAgJiYgZm9ybVR5cGUgIT09IDE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtO1xuIiwiaW1wb3J0IENvbmZpZyBmcm9tIFwiLi9jb25maWcvY29uZmlnXCI7XG5pbXBvcnQgTUVTU0FHRVMgZnJvbSBcIi4vY29uZmlnL21lc3NhZ2VzXCI7XG5pbXBvcnQgUG9sbCBmcm9tIFwiLi9kYXRhL3BvbGxcIjtcbmltcG9ydCBGb3JtIGZyb20gXCIuL2Zvcm0vZm9ybVwiO1xuaW1wb3J0IElHZXRBbG9uZ0NvbmZpZyBmcm9tIFwiLi90eXBlcy9nZXQtYWxvbmctY29uZmlnXCI7XG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4vdHlwZXMvdXNlci1ub3RpZmljYXRpb25cIjtcblxuLyoqXG4gKiBOb3RpZmllcyB1c2VycyB3aGVuIGEgcmVjb3JkIHRoZXkncmUgdmlld2luZyBpcyBtb2RpZmllZCBlbHNld2hlcmUuXG4gKi9cbmNsYXNzIEdldEFsb25nIHtcbiAgICAvKiogQ2hlY2tzIGZvciBjb25mbGljdHMgYW5kIG5vdGlmaWVzIHRoZSB1c2VyIGlmIGFueSBhcmUgZm91bmQuICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBjaGVja0ZvckNvbmZsaWN0cyhleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQsIGNvbmZpZzogSUdldEFsb25nQ29uZmlnKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzZnVsSW5pdDogYm9vbGVhbiA9IGF3YWl0IEdldEFsb25nLmluaXQoZXhlY3V0aW9uQ29udGV4dCwgY29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKCFzdWNjZXNzZnVsSW5pdCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgR2V0QWxvbmcuZm9ybS5kYXRhLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZChHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uLm9wZW4uYmluZChHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9sbHMgZm9yIGNvbmZsaWN0cyBhbmQgbm90aWZpZXMgdGhlIHVzZXIgaWYgYW55IGFyZSBmb3VuZC5cbiAgICAgKiBAcGFyYW0gZXhlY3V0aW9uQ29udGV4dCBwYXNzZWQgYnkgZGVmYXVsdCBmcm9tIER5bmFtaWNzIENSTSBmb3JtLlxuICAgICAqIEBwYXJhbSB0aW1lb3V0IGR1cmF0aW9uIGluIHNlY29uZHMgdG8gdGltZW91dCBiZXR3ZWVuIHBvbGwgb3BlcmF0aW9ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGxGb3JDb25mbGljdHMoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCBjb25maWc6IElHZXRBbG9uZ0NvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc2Z1bEluaXQ6IGJvb2xlYW4gPSBhd2FpdCBHZXRBbG9uZy5pbml0KGV4ZWN1dGlvbkNvbnRleHQsIGNvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghc3VjY2Vzc2Z1bEluaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IFBvbGwucG9sbCgoKSA9PiB0aGlzLmZvcm0uZGF0YS5jaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbi5vcGVuLmJpbmQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbikpLCAxODAwIC8gY29uZmlnLnRpbWVvdXQsIGNvbmZpZy50aW1lb3V0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHtNRVNTQUdFUy5nZW5lcmljfSAke2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjb25maWc6IENvbmZpZztcbiAgICBwcml2YXRlIHN0YXRpYyBmb3JtOiBGb3JtO1xuICAgIHByaXZhdGUgc3RhdGljIHVzZXJOb3RpZmljYXRpb246IElVc2VyTm90aWZpY2F0aW9uO1xuXG4gICAgLyoqIEluaXRpYWxpc2VzIEdldCBBbG9uZy4gUmV0dXJucyB0cnVlIGlmIHN1Y2Nlc3NmdWwsIG90aGVyd2lzZSBmYWxzZS4gKi9cbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBpbml0KGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgR2V0QWxvbmcuZm9ybSA9IEdldEFsb25nLmZvcm0gfHwgbmV3IEZvcm0oZXhlY3V0aW9uQ29udGV4dCk7XG4gICAgICAgIGF3YWl0IEdldEFsb25nLmZvcm0uaW5pdCgpO1xuXG4gICAgICAgIGlmICghR2V0QWxvbmcuZm9ybS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1FU1NBR0VTLmZvcm1Jc0ludmFsaWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBHZXRBbG9uZy5jb25maWcgPSBHZXRBbG9uZy5jb25maWcgfHwgbmV3IENvbmZpZyhjb25maWcsIEdldEFsb25nLmZvcm0pO1xuXG4gICAgICAgIGlmICghR2V0QWxvbmcuY29uZmlnLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coTUVTU0FHRVMuY29uZmlnSXNJbnZhbGlkKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbiA9IEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24gfHwgR2V0QWxvbmcuY29uZmlnLmdldFVzZXJOb3RpZmljYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZXRBbG9uZztcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUE7SUFDQTtRQVFJLGtCQUFZLGNBQStCO1lBUDNCLGtCQUFhLEdBQVcsR0FBRyxDQUFDO1lBQzVCLGlCQUFZLEdBQVcsR0FBRyxDQUFDO1lBQzNCLDhCQUF5QixHQUFXLFNBQVMsQ0FBQztZQUM5Qyw2QkFBd0IsR0FBVyxPQUFPLENBQUM7WUFLdkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7U0FDeEM7UUFFTSxnREFBNkIsR0FBcEM7WUFDSSxJQUFNLDBCQUEwQixHQUFrQztnQkFDOUQsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QjtnQkFDaEQsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjtnQkFDbEQsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUTtnQkFDdEMsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSTtnQkFDOUIsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSzthQUNuQyxDQUFDO1lBRUYsT0FBTywwQkFBMEIsQ0FBQztTQUNyQztRQUNMLGVBQUM7SUFBRCxDQUFDLElBQUE7O0lDckJEO0lBQ0E7UUFPSSxnQkFDSSxjQUErQixFQUMvQixXQUE0QixFQUM1QixRQUFrQjtZQVRmLFdBQU0sR0FBWSxLQUFLLENBQUM7WUFXM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUMxQzs7UUFHTSxxQkFBSSxHQUFYO1lBQUEsaUJBZUM7WUFkRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFFbkIsSUFBSSxDQUFDLFlBQVksQ0FDYjtvQkFDSSxLQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDeEMsRUFDRDtvQkFDSSxLQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzVDLEtBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUMvQixDQUNKLENBQUM7YUFDTDtTQUNKOzs7O1FBS08sNkJBQVksR0FBcEIsVUFDSSxlQUEyQixFQUMzQixjQUEwQjtZQUUxQixJQUFNLGNBQWMsR0FBRztnQkFDbkIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYTtnQkFDN0IsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWTthQUM5QixDQUFDO1lBQ0YsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO1lBRS9ELEdBQUcsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FDakUsVUFBQSxPQUFPO2dCQUNILElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtvQkFDbkIsZUFBZSxFQUFFLENBQUM7aUJBQ3JCO3FCQUFNO29CQUNILGNBQWMsRUFBRSxDQUFDO2lCQUNwQjthQUNKLENBQ0osQ0FBQztTQUNMO1FBQ0wsYUFBQztJQUFELENBQUMsSUFBQTs7SUM1REQ7SUFDQTtRQU1JLHNCQUFZLElBQVU7WUFMZixXQUFNLEdBQVksS0FBSyxDQUFDO1lBTTNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDdkM7O1FBR00sMkJBQUksR0FBWDtZQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FDbkMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQzFCLE1BQU0sRUFDTixzQkFBc0IsQ0FDekIsQ0FBQzthQUNMO1NBQ0o7UUFFTywwQ0FBbUIsR0FBM0I7WUFDSSxJQUFNLElBQUksR0FBRyxvQ0FBa0MsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsWUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQiw4Q0FBMkMsQ0FBQztZQUN0SixPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0wsbUJBQUM7SUFBRCxDQUFDLElBQUE7O0lDaENELElBQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQztJQUNsQyxJQUFNLGVBQWUsR0FBTSxXQUFXLHdCQUFxQixDQUFDO0lBRTVELElBQU0sUUFBUSxHQUFHO1FBQ2IsZUFBZSxFQUFLLGVBQWUsOEJBQTJCO1FBQzlELGtCQUFrQixFQUFLLGVBQWUsbUNBQWdDO1FBQ3RFLDBCQUEwQixFQUFLLGVBQWUsMkVBQXdFO1FBQ3RILGFBQWEsRUFBSyxXQUFXLHlEQUFzRDtRQUNuRixPQUFPLEVBQUssV0FBVywrQkFBNEI7UUFDbkQsY0FBYyxFQUFLLFdBQVcsd0RBQXFEO1FBQ25GLG1CQUFtQixFQUFLLGVBQWUsb0NBQWlDO1FBQ3hFLHdCQUF3QixFQUFLLGVBQWUsd0NBQXFDO0tBQ3BGLENBQUM7O0lDVEY7SUFDQTtRQUlJLHlCQUFZLE1BQXVCO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxlQUFlLEdBQUc7Z0JBQ25CLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDakMsQ0FBQztTQUNMOztRQUdNLGlDQUFPLEdBQWQ7WUFDSSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FDdEMsVUFBQyxFQUFpQixJQUFLLE9BQUEsRUFBRSxFQUFFLEtBQUssSUFBSSxHQUFBLENBQ3ZDLENBQUM7WUFDRixPQUFPLE9BQU8sQ0FBQztTQUNsQjtRQUVPLHlDQUFlLEdBQXZCO1lBQ0ksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUM7YUFDZjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKO1FBRU8sZ0RBQXNCLEdBQTlCO1lBQ0ksSUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsS0FBSyxJQUFJO2dCQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQzFDO2dCQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBQ25ELE9BQU8sS0FBSyxDQUFDO2FBQ2hCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUVPLDBDQUFnQixHQUF4QjtZQUNJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUNuQyxPQUFPLElBQUksQ0FBQzthQUNmO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQzVDLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFFTyx3Q0FBYyxHQUF0QjtZQUNJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtnQkFDeEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDakQsT0FBTyxLQUFLLENBQUM7YUFDaEI7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKO1FBQ0wsc0JBQUM7SUFBRCxDQUFDLElBQUE7O0lDekREO1FBSUksZ0JBQVksTUFBdUIsRUFBRSxJQUFVO1lBQzNDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNwQjs7UUFHTSxvQ0FBbUIsR0FBMUI7WUFDSSxJQUFNLG1CQUFtQixHQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsS0FBSyxJQUFJO2dCQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxTQUFTLENBQUM7WUFDN0MsSUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUI7a0JBQ3RDLElBQUksQ0FBQyxTQUFTLEVBQUU7a0JBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUU3QixPQUFPLGdCQUFnQixDQUFDO1NBQzNCOztRQUdNLHdCQUFPLEdBQWQ7WUFDSSxJQUFNLFNBQVMsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXBDLE9BQU8sT0FBTyxDQUFDO1NBQ2xCO1FBRU8sZ0NBQWUsR0FBdkI7WUFDSSxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QztRQUVPLDBCQUFTLEdBQWpCO1lBQ0ksT0FBTyxJQUFJLE1BQU0sQ0FDYixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWUsRUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUNyQixDQUFDO1NBQ0w7UUFFTyw0QkFBVyxHQUFuQixVQUFvQixNQUF1QjtZQUN2QyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtnQkFDNUIsT0FBTztvQkFDSCxPQUFPLEVBQUUsTUFBTTtpQkFDbEIsQ0FBQzthQUNMO2lCQUFNO2dCQUNILE9BQU8sTUFBTSxDQUFDO2FBQ2pCO1NBQ0o7UUFDTCxhQUFDO0lBQUQsQ0FBQyxJQUFBOztJQ3ZERDtJQUNBO1FBQUE7U0F1Q0M7Ozs7Ozs7UUE1QnVCLFNBQUksR0FBeEIsVUFDSSxFQUFPLEVBQ1AsT0FBZSxFQUNmLFFBQWdCOzJDQUNqQixPQUFPOzs7O29CQUNBLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBRTlDLGNBQWMsR0FBRyxVQUFDLE9BQU8sRUFBRSxNQUFNO3dCQUNuQyxJQUFNLFFBQVEsR0FBRyxFQUFFLEVBQUUsQ0FBQzt3QkFFdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7NEJBQ2xCLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQ0FDbkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzZCQUNyQjtpQ0FBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFO2dDQUNyQyxVQUFVLENBQ04sY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsRUFDekIsUUFBUSxHQUFHLElBQUksRUFDZixPQUFPLEVBQ1AsTUFBTSxDQUNULENBQUM7NkJBQ0w7aUNBQU07Z0NBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7NkJBQ2hEO3lCQUNKLENBQUMsQ0FBQztxQkFDTixDQUFDO29CQUVGLHNCQUFPLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFDOzs7U0FDdEM7UUFDTCxXQUFDO0lBQUQsQ0FBQyxJQUFBOztJQzFDRDtJQUNBO1FBQUE7U0FnQ0M7Ozs7O1FBM0JpQiwrQkFBcUIsR0FBbkMsVUFBb0MsV0FBVztZQUMzQyxJQUFNLGNBQWMsR0FDaEIsV0FBVyxJQUFJLFdBQVcsQ0FBQyxVQUFVO2tCQUM1QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWSxFQUFFLE1BQUc7cUJBQ3JELE1BQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGtCQUFrQixFQUFJLENBQUE7a0JBQzNELElBQUksQ0FBQyxxQkFBcUIsQ0FBQztZQUVyQyxPQUFPLGNBQWMsQ0FBQztTQUN6Qjs7Ozs7UUFNYSwrQkFBcUIsR0FBbkMsVUFBb0MsV0FBVztZQUMzQyxJQUFNLGNBQWMsR0FDaEIsV0FBVztnQkFDWCxXQUFXLENBQUMsVUFBVTtnQkFDdEIsV0FBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRO2tCQUN6QixXQUFXLENBQUMsVUFBVSxDQUFDLFFBQVE7a0JBQy9CLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztZQUVyQyxPQUFPLGNBQWMsQ0FBQztTQUN6QjtRQUV1QiwrQkFBcUIsR0FBRyxjQUFjLENBQUM7UUFDdkMsK0JBQXFCLEdBQUcsZUFBZSxDQUFDO1FBQ3BFLGdCQUFDO0tBaENELElBZ0NDOztJQ2pDRDtJQUNBO1FBQUE7U0E2QkM7Ozs7OztRQXZCdUIseUJBQW1CLEdBQXZDLFVBQ0ksV0FBNEIsRUFDNUIsVUFBbUIsRUFDbkIsUUFBaUI7MkNBQ2xCLE9BQU87O29CQUNOLElBQUksQ0FBQyxRQUFRO3dCQUNULElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNqRSxJQUFJLENBQUMsVUFBVTt3QkFDWCxJQUFJLENBQUMsVUFBVTs0QkFDZixVQUFVOzRCQUNWLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUU1QyxzQkFBTyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FDNUIsSUFBSSxDQUFDLFVBQVUsRUFDZixJQUFJLENBQUMsUUFBUSxFQUNiLDBEQUEwRCxDQUM3RCxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7NEJBQ1gsT0FBTyxRQUFRLENBQUM7eUJBQ25CLENBQUMsRUFBQzs7O1NBQ047UUFJTCxZQUFDO0lBQUQsQ0FBQyxJQUFBOztJQzNCRDtJQUNBO1FBT0ksY0FBWSxXQUE0QjtZQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDekI7Ozs7UUFLWSxtQkFBSSxHQUFqQjs7Ozs7Z0NBQ3dCLHFCQUFNLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUE7OzRCQUEvRCxXQUFXLEdBQUcsU0FBaUQ7NEJBQ3JFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFFbkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7Ozs7O1NBQ25EOzs7O1FBS1ksMENBQTJCLEdBQXhDLFVBQ0ksb0JBQWdDOzJDQUNqQyxPQUFPOzs7OztpQ0FDRixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBdkIsd0JBQXVCOzRCQUN2QixxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7OzRCQUFqQixTQUFpQixDQUFDOzRCQUNsQixzQkFBTyxLQUFLLEVBQUM7Z0NBR0cscUJBQU0sS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQTs7NEJBQS9ELFdBQVcsR0FBRyxTQUFpRDs0QkFFL0Qsb0JBQW9CLEdBQ3RCLFdBQVcsQ0FBQyxVQUFVO2dDQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFrQixDQUFDO2tDQUM5RCxJQUFJO2tDQUNKLEtBQUssQ0FBQzs0QkFFaEIsSUFBSSxvQkFBb0IsSUFBSSxvQkFBb0IsRUFBRTtnQ0FDOUMsb0JBQW9CLEVBQUUsQ0FBQzs2QkFDMUI7NEJBRUQsc0JBQU8sb0JBQW9CLEVBQUM7Ozs7U0FDL0I7Ozs7UUFLTyw2QkFBYyxHQUF0QjtZQUFBLGlCQUlDO1lBSEcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztnQkFDbkMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQzthQUN0QyxDQUFDLENBQUM7U0FDTjtRQUVPLCtCQUFnQixHQUF4QixVQUF5QixXQUFnQjtZQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDeEU7UUFDTCxXQUFDO0lBQUQsQ0FBQyxJQUFBOztJQ2pFRDtJQUNBO1FBSUksa0JBQVksV0FBNEI7WUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoRCxJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQzdEOzs7O1FBS00sOEJBQVcsR0FBbEIsVUFBbUIsV0FBNEI7WUFDM0MsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7Z0JBQ2hELFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDcEMsQ0FBQyxDQUFDO1NBQ047UUFDTCxlQUFDO0lBQUQsQ0FBQyxJQUFBOztJQ2ZEO0lBQ0E7UUFLSSxjQUFZLGdCQUF1QztZQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3JELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2xEOzs7O1FBS1ksbUJBQUksR0FBakI7OztvQkFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOzs7O1NBQ3BCOzs7O1FBS00scUJBQU0sR0FBYjtZQUNJLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN0RCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFaEUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLFVBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxDQUFDLENBQUM7U0FDckQ7Ozs7UUFLTSxzQkFBTyxHQUFkO1lBQ0ksSUFBTSxRQUFRLEdBQXFCLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRXJFLE9BQU8sUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUM7U0FDckU7UUFDTCxXQUFDO0lBQUQsQ0FBQyxJQUFBOztJQ2pDRDs7O0lBR0E7UUFBQTtTQTZEQzs7UUEzRHVCLDBCQUFpQixHQUFyQyxVQUFzQyxnQkFBdUMsRUFBRSxNQUF1QjsyQ0FBRyxPQUFPOzs7Ozs7NEJBRXhFLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLEVBQUE7OzRCQUF2RSxjQUFjLEdBQVksU0FBNkM7NEJBRTdFLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0NBQ2pCLHNCQUFPOzZCQUNWOzRCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Ozs7NEJBRS9HLE9BQU8sQ0FBQyxLQUFLLENBQUksUUFBUSxDQUFDLE9BQU8sU0FBSSxHQUFHLENBQUMsQ0FBQzs7Ozs7O1NBRWpEOzs7Ozs7UUFPbUIseUJBQWdCLEdBQXBDLFVBQXFDLGdCQUF1QyxFQUFFLE1BQXVCOzJDQUFHLE9BQU87Ozs7Ozs7NEJBRXZFLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLEVBQUE7OzRCQUF2RSxjQUFjLEdBQVksU0FBNkM7NEJBRTdFLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0NBQ2pCLHNCQUFPOzZCQUNWOzRCQUVELHFCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUEsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUE7OzRCQUF4SyxTQUF3SyxDQUFDOzs7OzRCQUV6SyxPQUFPLENBQUMsS0FBSyxDQUFJLFFBQVEsQ0FBQyxPQUFPLFNBQUksR0FBRyxDQUFDLENBQUM7Ozs7OztTQUVqRDs7UUFPb0IsYUFBSSxHQUF6QixVQUEwQixnQkFBdUMsRUFBRSxNQUF1QjsyQ0FBRyxPQUFPOzs7OzRCQUNoRyxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs0QkFDNUQscUJBQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBQTs7NEJBQTFCLFNBQTBCLENBQUM7NEJBRTNCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO2dDQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQ0FFcEMsc0JBQU8sS0FBSyxFQUFDOzZCQUNoQjs0QkFFRCxRQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFFdkUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0NBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dDQUV0QyxzQkFBTyxLQUFLLEVBQUM7NkJBQ2hCOzRCQUVELFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOzRCQUMvRixzQkFBTyxJQUFJLEVBQUM7Ozs7U0FDZjtRQUNMLGVBQUM7SUFBRCxDQUFDLElBQUE7Ozs7Ozs7OyJ9
