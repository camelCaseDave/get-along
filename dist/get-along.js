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
        pollingDisabled: projectName + " has been disabled and will stop now.",
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
                    if (!this.enabled) {
                        console.log(MESSAGES.pollingDisabled);
                        return [2 /*return*/];
                    }
                    endTime = Number(new Date()) + timeout * 1000;
                    checkCondition = function (resolve, reject) {
                        var callback = fn();
                        callback.then(function (response) {
                            if (!_this.enabled) {
                                reject(console.log(MESSAGES.pollingDisabled));
                            }
                            else {
                                if (response === true) {
                                    resolve(response);
                                }
                                else if (Number(new Date()) < endTime) {
                                    setTimeout(checkCondition.bind(_this), interval * 1000, resolve, reject);
                                }
                                else {
                                    reject(console.log(MESSAGES.pollingTimeout));
                                }
                            }
                        });
                    };
                    return [2 /*return*/, new Promise(checkCondition)];
                });
            });
        };
        /*
         * True if poll is active, otherwise false.
         */
        Poll.enabled = true;
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
            return __awaiter(this, void 0, Promise, function () {
                var apiResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Query.getLatestModifiedOn(this.formContext)];
                        case 1:
                            apiResponse = _a.sent();
                            this.cacheApiResponse(apiResponse);
                            this.initialModifiedOn = apiResponse.modifiedon;
                            Poll.enabled = true;
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
                            return [4 /*yield*/, Poll.poll(function () {
                                    return _this.form.data.checkIfModifiedOnHasChanged(GetAlong.userNotification.open.bind(GetAlong.userNotification));
                                }, 1800 / config.timeout, config.timeout)];
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
        /**
         * Disables polling for conflicts, if it is running.
         */
        GetAlong.disablePoll = function () {
            Poll.enabled = false;
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
                            GetAlong.userNotification =
                                GetAlong.userNotification || GetAlong.config.getUserNotification();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWFsb25nLmpzIiwic291cmNlcyI6WyIuLi9zcmMvbm90aWZpY2F0aW9uL2RpYWxvZy11aS50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vZGlhbG9nLnRzIiwiLi4vc3JjL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24udHMiLCIuLi9zcmMvY29uZmlnL21lc3NhZ2VzLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWctdmFsaWRhdG9yLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWcudHMiLCIuLi9zcmMvZGF0YS9wb2xsLnRzIiwiLi4vc3JjL2RhdGEvcHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RhdGEvcXVlcnkudHMiLCIuLi9zcmMvZm9ybS9kYXRhLnRzIiwiLi4vc3JjL2Zvcm0vbWV0YWRhdGEudHMiLCIuLi9zcmMvZm9ybS9mb3JtLnRzIiwiLi4vc3JjL2dldC1hbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUNvbmZpcm1TdHJpbmdzIGZyb20gJy4uL3R5cGVzL2NvbmZpcm0tc3RyaW5ncyc7XG5cbi8qKiBVaSBvZiB0aGUgZm9ybSBkaWFsb2cuICovXG5jbGFzcyBEaWFsb2dVaSB7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRIZWlnaHQ6IG51bWJlciA9IDIwMDtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdFdpZHRoOiBudW1iZXIgPSA0NTA7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRDb25maXJtQnV0dG9uTGFiZWw6IHN0cmluZyA9ICdSZWZyZXNoJztcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsOiBzdHJpbmcgPSAnQ2xvc2UnO1xuXG4gICAgcHJpdmF0ZSBjb25maXJtU3RyaW5nczogSUNvbmZpcm1TdHJpbmdzO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncykge1xuICAgICAgICB0aGlzLmNvbmZpcm1TdHJpbmdzID0gY29uZmlybVN0cmluZ3M7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzKCk6IFhybS5OYXZpZ2F0aW9uLkNvbmZpcm1TdHJpbmdzIHtcbiAgICAgICAgY29uc3QgY29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHM6IFhybS5OYXZpZ2F0aW9uLkNvbmZpcm1TdHJpbmdzID0ge1xuICAgICAgICAgICAgY2FuY2VsQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsLFxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkxhYmVsOiB0aGlzLmRlZmF1bHRDb25maXJtQnV0dG9uTGFiZWwsXG4gICAgICAgICAgICBzdWJ0aXRsZTogdGhpcy5jb25maXJtU3RyaW5ncy5zdWJ0aXRsZSxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlybVN0cmluZ3MudGV4dCxcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmNvbmZpcm1TdHJpbmdzLnRpdGxlLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpYWxvZ1VpO1xuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gJy4uL2Zvcm0vbWV0YWRhdGEnO1xuaW1wb3J0IElDb25maXJtU3RyaW5ncyBmcm9tICcuLi90eXBlcy9jb25maXJtLXN0cmluZ3MnO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gJy4uL3R5cGVzL3VzZXItbm90aWZpY2F0aW9uJztcbmltcG9ydCBEaWFsb2dVaSBmcm9tICcuL2RpYWxvZy11aSc7XG5cbi8qKiBDb25maXJtIGRpYWxvZyBub3RpZnlpbmcgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QuICovXG5jbGFzcyBEaWFsb2cgaW1wbGVtZW50cyBJVXNlck5vdGlmaWNhdGlvbiB7XG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xuICAgIHByaXZhdGUgbWV0YWRhdGE6IE1ldGFkYXRhO1xuICAgIHByaXZhdGUgdWk6IERpYWxvZ1VpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNvbmZpcm1TdHJpbmdzOiBJQ29uZmlybVN0cmluZ3MsXG4gICAgICAgIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQsXG4gICAgICAgIG1ldGFkYXRhOiBNZXRhZGF0YVxuICAgICkge1xuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybUNvbnRleHQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgdGhpcy51aSA9IG5ldyBEaWFsb2dVaShjb25maXJtU3RyaW5ncyk7XG4gICAgfVxuXG4gICAgLyoqIE9wZW5zIHRoZSBkaWFsb2csIG5vdGlmeWluZyB1c2VyIG9mIGEgY29uZmxpY3QuICovXG4gICAgcHVibGljIG9wZW4oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5vcGVuQ2FsbGJhY2soXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFkYXRhLnByZXZlbnRTYXZlKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFyZW50LmxvY2F0aW9uLnJlbG9hZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YWRhdGEucHJldmVudFNhdmUodGhpcy5mb3JtQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBvcGVuQ2FsbGJhY2soXG4gICAgICAgIGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCxcbiAgICAgICAgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWRcbiAgICApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY29uZmlybU9wdGlvbnMgPSB7XG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMudWkuZGVmYXVsdEhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29uZmlybVN0cmluZ3MgPSB0aGlzLnVpLmdldENvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzKCk7XG5cbiAgICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkNvbmZpcm1EaWFsb2coY29uZmlybVN0cmluZ3MsIGNvbmZpcm1PcHRpb25zKS50aGVuKFxuICAgICAgICAgICAgc3VjY2VzcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MuY29uZmlybWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1DYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nO1xuIiwiaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gJy4uL3R5cGVzL3VzZXItbm90aWZpY2F0aW9uJztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vZm9ybSc7XG5pbXBvcnQgRGF0YSBmcm9tICcuLi9mb3JtL2RhdGEnO1xuXG4vKiogRm9ybSBub3RpZmljYXRpb24gYmFubmVyIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cbmNsYXNzIE5vdGlmaWNhdGlvbiBpbXBsZW1lbnRzIElVc2VyTm90aWZpY2F0aW9uIHtcbiAgICBwdWJsaWMgaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGRhdGE6IERhdGE7XG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xuXG4gICAgY29uc3RydWN0b3IoZm9ybTogRm9ybSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBmb3JtLmRhdGE7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtLmZvcm1Db250ZXh0O1xuICAgIH1cblxuICAgIC8qKiBPcGVucyB0aGUgbm90aWZpY2F0aW9uLCBub3RpZnlpbmcgdXNlciBvZiBhIGNvbmZsaWN0LiAqL1xuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5nZXROb3RpZmljYXRpb25UZXh0KCksXG4gICAgICAgICAgICAgICAgJ0lORk8nLFxuICAgICAgICAgICAgICAgICdHZXRBbG9uZ05vdGlmaWNhdGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vdGlmaWNhdGlvblRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGBUaGlzIGZvcm0gaGFzIGJlZW4gbW9kaWZpZWQgYnkgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRCeX0gYXQgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRPbn0uIFJlZnJlc2ggdGhlIGZvcm0gdG8gc2VlIGxhdGVzdCBjaGFuZ2VzLmA7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTm90aWZpY2F0aW9uO1xuIiwiY29uc3QgcHJvamVjdE5hbWUgPSAnZ2V0YWxvbmcuanMnO1xuY29uc3QgY29uZmlnSXNJbnZhbGlkID0gYCR7cHJvamVjdE5hbWV9IGNvbmZpZyBpcyBpbnZhbGlkLmA7XG5cbmNvbnN0IE1FU1NBR0VTID0ge1xuICAgIGNvbmZpZ0lzSW52YWxpZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBhbmQgdGhlcmVmb3JlIHdvbid0IGxvYWRgLFxuICAgIGNvbmZpZ05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyBjb25maWcgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXG4gICAgY29uZmlybVN0cmluZ3NOb3RTcGVjaWZpZWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gVXNlIGRpYWxvZyBoYXMgYmVlbiBzZWxlY3RlZCBidXQgbm8gY29uZmlybSBzdHJpbmdzIGhhdmUgYmVlbiBwYXNzZWQuYCxcbiAgICBmb3JtSXNJbnZhbGlkOiBgJHtwcm9qZWN0TmFtZX0gdGhpbmtzIHRoZSBmb3JtIGlzIGludmFsaWQgYW5kIHRoZXJlZm9yZSB3b24ndCBsb2FkYCxcbiAgICBnZW5lcmljOiBgJHtwcm9qZWN0TmFtZX0gaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLmAsXG4gICAgcG9sbGluZ0Rpc2FibGVkOiBgJHtwcm9qZWN0TmFtZX0gaGFzIGJlZW4gZGlzYWJsZWQgYW5kIHdpbGwgc3RvcCBub3cuYCxcbiAgICBwb2xsaW5nVGltZW91dDogYCR7cHJvamVjdE5hbWV9IGhhcyBiZWVuIHBvbGxpbmcgZm9yIDMwIG1pbnV0ZXMgYW5kIHdpbGwgc3RvcCBub3cuYCxcbiAgICB0aW1lb3V0Tm90U3BlY2lmaWVkOiBgJHtjb25maWdJc0ludmFsaWR9IE5vIHRpbWVvdXQgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXG4gICAgdGltZW91dE91dHNpZGVWYWxpZFJhbmdlOiBgJHtjb25maWdJc0ludmFsaWR9IFRpbWVvdXQgaXMgb3V0c2lkZSBvZiB2YWxpZCByYW5nZS5gLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgTUVTU0FHRVM7XG4iLCJpbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gJy4uL3R5cGVzL2dldC1hbG9uZy1jb25maWcnO1xuaW1wb3J0IE1FU1NBR0VTIGZyb20gJy4vbWVzc2FnZXMnO1xuXG4vKiogVmFsaWRhdGVzIHRoZSBjb25maWcgcGFzc2VkIGJ5IENSTSBmb3JtIHByb3BlcnRpZXMuICovXG5jbGFzcyBDb25maWdWYWxpZGF0b3Ige1xuICAgIHByaXZhdGUgY29uZmlnOiBJR2V0QWxvbmdDb25maWc7XG4gICAgcHJpdmF0ZSB2YWxpZGF0aW9uUnVsZXM6IEFycmF5PCgpID0+IGJvb2xlYW4+O1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBJR2V0QWxvbmdDb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMudmFsaWRhdGlvblJ1bGVzID0gW1xuICAgICAgICAgICAgdGhpcy5jb25maWdJc0RlZmluZWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nU2V0dGluZ3NBcmVWYWxpZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SXNEZWZpbmVkLmJpbmQodGhpcyksXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJc1ZhbGlkLmJpbmQodGhpcyksXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY29uZmlnIGlzIHZhbGlkLCBvdGhlcndpc2UgZmFsc2UuICovXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGlzVmFsaWQgPSB0aGlzLnZhbGlkYXRpb25SdWxlcy5ldmVyeShcbiAgICAgICAgICAgIChmbjogKCkgPT4gYm9vbGVhbikgPT4gZm4oKSA9PT0gdHJ1ZVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0lzRGVmaW5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy5jb25maWdOb3RTcGVjaWZpZWQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaWFsb2dTZXR0aW5nc0FyZVZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jb25maXJtRGlhbG9nID09PSB0cnVlICYmXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jb25maXJtU3RyaW5ncyA9PT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy5jb25maXJtU3RyaW5nc05vdFNwZWNpZmllZCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGltZW91dElzRGVmaW5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKE1FU1NBR0VTLnRpbWVvdXROb3RTcGVjaWZpZWQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aW1lb3V0SXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpbWVvdXQgPCAxIHx8IHRoaXMuY29uZmlnLnRpbWVvdXQgPj0gMTgwMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0T3V0c2lkZVZhbGlkUmFuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZ1ZhbGlkYXRvcjtcbiIsImltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vZm9ybSc7XG5pbXBvcnQgRGlhbG9nIGZyb20gJy4uL25vdGlmaWNhdGlvbi9kaWFsb2cnO1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuLi9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uJztcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSAnLi4vdHlwZXMvZ2V0LWFsb25nLWNvbmZpZyc7XG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSAnLi4vdHlwZXMvdXNlci1ub3RpZmljYXRpb24nO1xuaW1wb3J0IENvbmZpZ1ZhbGlkYXRvciBmcm9tICcuL2NvbmZpZy12YWxpZGF0b3InO1xuXG5jbGFzcyBDb25maWcge1xuICAgIHByaXZhdGUgY29uZmlnOiBJR2V0QWxvbmdDb25maWc7XG4gICAgcHJpdmF0ZSBmb3JtOiBGb3JtO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBJR2V0QWxvbmdDb25maWcsIGZvcm06IEZvcm0pIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSB0aGlzLnBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgfVxuXG4gICAgLyoqIERlcml2ZXMgdGhlIHVzZXIgbm90aWZpY2F0aW9uLCBlaXRoZXIgYSBmb3JtIG5vdGlmaWNhdGlvbiBvciBhIGRpYWxvZywgZnJvbSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMuICovXG4gICAgcHVibGljIGdldFVzZXJOb3RpZmljYXRpb24oKTogSVVzZXJOb3RpZmljYXRpb24ge1xuICAgICAgICBjb25zdCBpc1VzZURpYWxvZ1NlbGVjdGVkID1cbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHVzZXJOb3RpZmljYXRpb24gPSBpc1VzZURpYWxvZ1NlbGVjdGVkXG4gICAgICAgICAgICA/IHRoaXMuZ2V0RGlhbG9nKClcbiAgICAgICAgICAgIDogdGhpcy5nZXROb3RpZmljYXRpb24oKTtcblxuICAgICAgICByZXR1cm4gdXNlck5vdGlmaWNhdGlvbjtcbiAgICB9XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMgaXMgdmFsaWQgZm9yIHVzZSwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3IgPSBuZXcgQ29uZmlnVmFsaWRhdG9yKHRoaXMuY29uZmlnKTtcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRvci5pc1ZhbGlkKCk7XG5cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb3RpZmljYXRpb24oKTogTm90aWZpY2F0aW9uIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcy5mb3JtKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERpYWxvZygpOiBEaWFsb2cge1xuICAgICAgICByZXR1cm4gbmV3IERpYWxvZyhcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzISxcbiAgICAgICAgICAgIHRoaXMuZm9ybS5mb3JtQ29udGV4dCxcbiAgICAgICAgICAgIHRoaXMuZm9ybS5tZXRhZGF0YVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VDb25maWcoY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBJR2V0QWxvbmdDb25maWcge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGltZW91dDogY29uZmlnLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZztcbiIsImltcG9ydCBNRVNTQUdFUyBmcm9tICcuLi9jb25maWcvbWVzc2FnZXMnO1xuXG4vKiogSGFuZGxlcyBmdW5jdGlvbiBjYWxscyBhdCBhIHNldCB0aW1lIGludGVydmFsLiAqL1xuY2xhc3MgUG9sbCB7XG4gICAgLypcbiAgICAgKiBUcnVlIGlmIHBvbGwgaXMgYWN0aXZlLCBvdGhlcndpc2UgZmFsc2UuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBlbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFBvbGxzIGEgZnVuY3Rpb24gZXZlcnkgc3BlY2lmaWVkIG51bWJlciBvZiBzZWNvbmRzIHVudGlsIGl0IHJldHVybnMgdHJ1ZSBvciB0aW1lb3V0IGlzIHJlYWNoZWQuXG4gICAgICogQHBhcmFtIGZuIGNhbGxiYWNrIFByb21pc2UgdG8gcG9sbC5cbiAgICAgKiBAcGFyYW0gdGltZW91dCBzZWNvbmRzIHRvIGNvbnRpbnVlIHBvbGxpbmcgZm9yLlxuICAgICAqIEBwYXJhbSBpbnRlcnZhbCBzZWNvbmRzIGJldHdlZW4gcG9sbGluZyBjYWxscy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGwoXG4gICAgICAgIGZuOiBhbnksXG4gICAgICAgIHRpbWVvdXQ6IG51bWJlcixcbiAgICAgICAgaW50ZXJ2YWw6IG51bWJlclxuICAgICk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNRVNTQUdFUy5wb2xsaW5nRGlzYWJsZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5kVGltZSA9IE51bWJlcihuZXcgRGF0ZSgpKSArIHRpbWVvdXQgKiAxMDAwO1xuXG4gICAgICAgIGNvbnN0IGNoZWNrQ29uZGl0aW9uID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBmbigpO1xuXG4gICAgICAgICAgICBjYWxsYmFjay50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoY29uc29sZS5sb2coTUVTU0FHRVMucG9sbGluZ0Rpc2FibGVkKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChOdW1iZXIobmV3IERhdGUoKSkgPCBlbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrQ29uZGl0aW9uLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgKiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGNvbnNvbGUubG9nKE1FU1NBR0VTLnBvbGxpbmdUaW1lb3V0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoY2hlY2tDb25kaXRpb24pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9sbDtcbiIsIi8qKiBDb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB1c2VkIGZvciBtYWtpbmcgZGF0YSBodW1hbi1yZWFkYWJsZS4gKi9cbmNsYXNzIFByb2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBtb2RpZmllZG9uIGRhdGUgYXMgYSByZWFkYWJsZSwgdXNlciBsb2NhbGUgc3RyaW5nLlxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgXCJtb2RpZmllZG9uXCIgY29sdW1uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc01vZGlmaWVkT25EYXRlKGFwaVJlc3BvbnNlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtb2RpZmllZE9uRGF0ZSA9XG4gICAgICAgICAgICBhcGlSZXNwb25zZSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZG9uXG4gICAgICAgICAgICAgICAgPyBgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0RhdGVTdHJpbmcoKX0sYCArXG4gICAgICAgICAgICAgICAgICBgICR7bmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikudG9Mb2NhbGVUaW1lU3RyaW5nKCl9YFxuICAgICAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRPblRpbWU7XG5cbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT25EYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgbW9kaWZpZWQgYnkgdXNlcidzIGZ1bGwgbmFtZS5cbiAgICAgKiBAcGFyYW0gYXBpUmVzcG9uc2UgQ1JNIEFQSSByZXNwb25zZSB0aGF0IGluY2x1ZGVzIGV4cGFuZGVkIFwibW9kaWZpZWRieS5mdWxsbmFtZVwiIGNvbHVtbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbW9kaWZpZWRCeVVzZXIgPVxuICAgICAgICAgICAgYXBpUmVzcG9uc2UgJiZcbiAgICAgICAgICAgIGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkgJiZcbiAgICAgICAgICAgIGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcbiAgICAgICAgICAgICAgICA/IGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcbiAgICAgICAgICAgICAgICA6IHRoaXMuZGVmYXVsdE1vZGlmaWVkQnlVc2VyO1xuXG4gICAgICAgIHJldHVybiBtb2RpZmllZEJ5VXNlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRCeVVzZXIgPSAnYW5vdGhlciB1c2VyJztcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRPblRpbWUgPSAndGhlIHNhbWUgdGltZSc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2Nlc3NvcjtcbiIsIi8qKiBJbnRlcmFjdHMgZGlyZWN0bHkgd2l0aCB0aGUgWHJtIFdlYiBBUEkuICovXG5jbGFzcyBRdWVyeSB7XG4gICAgLyoqXG4gICAgICogQ2FsbHMgQ1JNIEFQSSBhbmQgcmV0dXJucyB0aGUgZ2l2ZW4gZW50aXR5J3MgbW9kaWZpZWQgb24gZGF0ZS5cbiAgICAgKiBAcGFyYW0gZW50aXR5TmFtZSBzY2hlbWEgbmFtZSBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSBlbnRpdHlJZCBpZCBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0TGF0ZXN0TW9kaWZpZWRPbihcbiAgICAgICAgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCxcbiAgICAgICAgZW50aXR5TmFtZT86IHN0cmluZyxcbiAgICAgICAgZW50aXR5SWQ/OiBzdHJpbmdcbiAgICApOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmVudGl0eUlkID1cbiAgICAgICAgICAgIHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcbiAgICAgICAgdGhpcy5lbnRpdHlOYW1lID1cbiAgICAgICAgICAgIHRoaXMuZW50aXR5TmFtZSB8fFxuICAgICAgICAgICAgZW50aXR5TmFtZSB8fFxuICAgICAgICAgICAgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0RW50aXR5TmFtZSgpO1xuXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKFxuICAgICAgICAgICAgdGhpcy5lbnRpdHlOYW1lLFxuICAgICAgICAgICAgdGhpcy5lbnRpdHlJZCxcbiAgICAgICAgICAgICc/JHNlbGVjdD1tb2RpZmllZG9uJiRleHBhbmQ9bW9kaWZpZWRieSgkc2VsZWN0PWZ1bGxuYW1lKSdcbiAgICAgICAgKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5SWQ6IHN0cmluZztcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXJ5O1xuIiwiaW1wb3J0IFByb2Nlc3NvciBmcm9tICcuLi9kYXRhL3Byb2Nlc3Nvcic7XG5pbXBvcnQgUXVlcnkgZnJvbSAnLi4vZGF0YS9xdWVyeSc7XG5pbXBvcnQgUG9sbCBmcm9tICcuLi9kYXRhL3BvbGwnO1xuXG4vKiogRGF0YSBvZiB0aGUgcmVjb3JkIGluIENSTS4gKi9cbmNsYXNzIERhdGEge1xuICAgIHB1YmxpYyBpbml0aWFsTW9kaWZpZWRPbjogRGF0ZSB8IHVuZGVmaW5lZDtcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRPbjogc3RyaW5nO1xuICAgIHB1YmxpYyBsYXRlc3RNb2RpZmllZEJ5OiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcbiAgICAgICAgdGhpcy5hZGRSZXNldE9uU2F2ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFzeW5jaHJvbm91c2x5IGluaXRpYWxpc2VzIGRhdGEsIGNhY2hpbmcgaW5pdGlhbCBtb2RpZmllZCBvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICB0aGlzLmNhY2hlQXBpUmVzcG9uc2UoYXBpUmVzcG9uc2UpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSBhcGlSZXNwb25zZS5tb2RpZmllZG9uO1xuICAgICAgICBQb2xsLmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgbW9kaWZpZWQgb24gZnJvbSBDUk0gc2VydmVyLiBSZXR1cm5zIHRydWUgaWYgaXQgaGFzIGNoYW5nZWQsIGFuZCBub3RpZmllcyB0aGUgdXNlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKFxuICAgICAgICBub3RpZmljYXRpb25DYWxsYmFjazogKCkgPT4gdm9pZFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbE1vZGlmaWVkT24pIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xuXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25IYXNDaGFuZ2VkID1cbiAgICAgICAgICAgIGFwaVJlc3BvbnNlLm1vZGlmaWVkb24gJiZcbiAgICAgICAgICAgIG5ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pID4gbmV3IERhdGUodGhpcy5pbml0aWFsTW9kaWZpZWRPbiEpXG4gICAgICAgICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgICAgICAgOiBmYWxzZTtcblxuICAgICAgICBpZiAobW9kaWZpZWRPbkhhc0NoYW5nZWQgJiYgbm90aWZpY2F0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbkNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkhhc0NoYW5nZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIG1vZGlmaWVkIG9uIGNhY2hlIHdoZW4gZm9ybSBpcyBzYXZlZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFJlc2V0T25TYXZlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmFkZE9uU2F2ZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhY2hlQXBpUmVzcG9uc2UoYXBpUmVzcG9uc2U6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxhdGVzdE1vZGlmaWVkQnkgPSBQcm9jZXNzb3IucHJvY2Vzc01vZGlmaWVkQnlVc2VyKGFwaVJlc3BvbnNlKTtcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZE9uID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRhO1xuIiwiLyoqIFJlY29yZCBtZXRhZGF0YSB1c2VkIHRvIHF1ZXJ5IHRoZSBDUk0gQVBJLiAqL1xuY2xhc3MgTWV0YWRhdGEge1xuICAgIHB1YmxpYyBlbnRpdHlJZDogc3RyaW5nO1xuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KSB7XG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJldmVudHMgZm9ybSBhdHRyaWJ1dGVzIGZyb20gYmVpbmcgc3VibWl0dGVkIHdoZW4gdGhlIHJlY29yZCBpcyBzYXZlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcHJldmVudFNhdmUoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCk6IHZvaWQge1xuICAgICAgICBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hdHRyaWJ1dGVzLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRTdWJtaXRNb2RlKCduZXZlcicpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1ldGFkYXRhO1xuIiwiaW1wb3J0IERhdGEgZnJvbSAnLi9kYXRhJztcbmltcG9ydCBNZXRhZGF0YSBmcm9tICcuL21ldGFkYXRhJztcblxuLyoqIEEgZm9ybSBpbiBEeW5hbWljcyAzNjUgQ0UuICovXG5jbGFzcyBGb3JtIHtcbiAgICBwdWJsaWMgZGF0YTogRGF0YTtcbiAgICBwdWJsaWMgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcbiAgICBwdWJsaWMgbWV0YWRhdGE6IE1ldGFkYXRhO1xuXG4gICAgY29uc3RydWN0b3IoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0KSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBleGVjdXRpb25Db250ZXh0LmdldEZvcm1Db250ZXh0KCk7XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICB0aGlzLm1ldGFkYXRhID0gbmV3IE1ldGFkYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFzeW5jcm9ub3VzbHkgaW5pdGlhbGlzZXMgZm9ybSBkYXRhLlxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgICAgICB0aGlzLmRhdGEuaW5pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbG9hZHMgdGhlIGZvcm0uXG4gICAgICovXG4gICAgcHVibGljIHJlbG9hZCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZW50aXR5SWQgPSB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCk7XG4gICAgICAgIGNvbnN0IGVudGl0eU5hbWUgPSB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcblxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuRm9ybSh7IGVudGl0eUlkLCBlbnRpdHlOYW1lIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZm9ybSB0eXBlIGlzIG5vdCBjcmVhdGUgb3IgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBmb3JtVHlwZTogWHJtRW51bS5Gb3JtVHlwZSA9IHRoaXMuZm9ybUNvbnRleHQudWkuZ2V0Rm9ybVR5cGUoKTtcblxuICAgICAgICByZXR1cm4gZm9ybVR5cGUgIT09IHVuZGVmaW5lZCAmJiBmb3JtVHlwZSAhPT0gMCAmJiBmb3JtVHlwZSAhPT0gMTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm07XG4iLCJpbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnL2NvbmZpZyc7XG5pbXBvcnQgTUVTU0FHRVMgZnJvbSAnLi9jb25maWcvbWVzc2FnZXMnO1xuaW1wb3J0IFBvbGwgZnJvbSAnLi9kYXRhL3BvbGwnO1xuaW1wb3J0IEZvcm0gZnJvbSAnLi9mb3JtL2Zvcm0nO1xuaW1wb3J0IElHZXRBbG9uZ0NvbmZpZyBmcm9tICcuL3R5cGVzL2dldC1hbG9uZy1jb25maWcnO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gJy4vdHlwZXMvdXNlci1ub3RpZmljYXRpb24nO1xuXG4vKipcbiAqIE5vdGlmaWVzIHVzZXJzIHdoZW4gYSByZWNvcmQgdGhleSdyZSB2aWV3aW5nIGlzIG1vZGlmaWVkIGVsc2V3aGVyZS5cbiAqL1xuY2xhc3MgR2V0QWxvbmcge1xuICAgIC8qKiBDaGVja3MgZm9yIGNvbmZsaWN0cyBhbmQgbm90aWZpZXMgdGhlIHVzZXIgaWYgYW55IGFyZSBmb3VuZC4gKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGNoZWNrRm9yQ29uZmxpY3RzKFxuICAgICAgICBleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQsXG4gICAgICAgIGNvbmZpZzogSUdldEFsb25nQ29uZmlnXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzZnVsSW5pdDogYm9vbGVhbiA9IGF3YWl0IEdldEFsb25nLmluaXQoXG4gICAgICAgICAgICAgICAgZXhlY3V0aW9uQ29udGV4dCxcbiAgICAgICAgICAgICAgICBjb25maWdcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghc3VjY2Vzc2Z1bEluaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEdldEFsb25nLmZvcm0uZGF0YS5jaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoXG4gICAgICAgICAgICAgICAgR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbi5vcGVuLmJpbmQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9sbHMgZm9yIGNvbmZsaWN0cyBhbmQgbm90aWZpZXMgdGhlIHVzZXIgaWYgYW55IGFyZSBmb3VuZC5cbiAgICAgKiBAcGFyYW0gZXhlY3V0aW9uQ29udGV4dCBwYXNzZWQgYnkgZGVmYXVsdCBmcm9tIER5bmFtaWNzIENSTSBmb3JtLlxuICAgICAqIEBwYXJhbSB0aW1lb3V0IGR1cmF0aW9uIGluIHNlY29uZHMgdG8gdGltZW91dCBiZXR3ZWVuIHBvbGwgb3BlcmF0aW9ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGxGb3JDb25mbGljdHMoXG4gICAgICAgIGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCxcbiAgICAgICAgY29uZmlnOiBJR2V0QWxvbmdDb25maWdcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NmdWxJbml0OiBib29sZWFuID0gYXdhaXQgR2V0QWxvbmcuaW5pdChcbiAgICAgICAgICAgICAgICBleGVjdXRpb25Db250ZXh0LFxuICAgICAgICAgICAgICAgIGNvbmZpZ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFzdWNjZXNzZnVsSW5pdCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgUG9sbC5wb2xsKFxuICAgICAgICAgICAgICAgICgpID0+XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5kYXRhLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZChcbiAgICAgICAgICAgICAgICAgICAgICAgIEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24ub3Blbi5iaW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdldEFsb25nLnVzZXJOb3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAxODAwIC8gY29uZmlnLnRpbWVvdXQsXG4gICAgICAgICAgICAgICAgY29uZmlnLnRpbWVvdXRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzYWJsZXMgcG9sbGluZyBmb3IgY29uZmxpY3RzLCBpZiBpdCBpcyBydW5uaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZGlzYWJsZVBvbGwoKTogdm9pZCB7XG4gICAgICAgIFBvbGwuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGNvbmZpZzogQ29uZmlnO1xuICAgIHByaXZhdGUgc3RhdGljIGZvcm06IEZvcm07XG4gICAgcHJpdmF0ZSBzdGF0aWMgdXNlck5vdGlmaWNhdGlvbjogSVVzZXJOb3RpZmljYXRpb247XG5cbiAgICAvKiogSW5pdGlhbGlzZXMgR2V0IEFsb25nLiBSZXR1cm5zIHRydWUgaWYgc3VjY2Vzc2Z1bCwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGluaXQoXG4gICAgICAgIGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCxcbiAgICAgICAgY29uZmlnOiBJR2V0QWxvbmdDb25maWdcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgR2V0QWxvbmcuZm9ybSA9IEdldEFsb25nLmZvcm0gfHwgbmV3IEZvcm0oZXhlY3V0aW9uQ29udGV4dCk7XG4gICAgICAgIGF3YWl0IEdldEFsb25nLmZvcm0uaW5pdCgpO1xuXG4gICAgICAgIGlmICghR2V0QWxvbmcuZm9ybS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1FU1NBR0VTLmZvcm1Jc0ludmFsaWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBHZXRBbG9uZy5jb25maWcgPSBHZXRBbG9uZy5jb25maWcgfHwgbmV3IENvbmZpZyhjb25maWcsIEdldEFsb25nLmZvcm0pO1xuXG4gICAgICAgIGlmICghR2V0QWxvbmcuY29uZmlnLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coTUVTU0FHRVMuY29uZmlnSXNJbnZhbGlkKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbiA9XG4gICAgICAgICAgICBHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uIHx8IEdldEFsb25nLmNvbmZpZy5nZXRVc2VyTm90aWZpY2F0aW9uKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRl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
