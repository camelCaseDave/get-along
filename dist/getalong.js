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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9ub3RpZmljYXRpb24vZGlhbG9nVWkudHMiLCIuLi9zcmMvbm90aWZpY2F0aW9uL2RpYWxvZy50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLnRzIiwiLi4vc3JjL2NvbmZpZy9tZXNzYWdlcy50cyIsIi4uL3NyYy9jb25maWcvY29uZmlnVmFsaWRhdG9yLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWcudHMiLCIuLi9zcmMvZGF0YS9wb2xsLnRzIiwiLi4vc3JjL2RhdGEvcHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RhdGEvcXVlcnkudHMiLCIuLi9zcmMvZm9ybS9kYXRhLnRzIiwiLi4vc3JjL2Zvcm0vbWV0YWRhdGEudHMiLCIuLi9zcmMvZm9ybS9mb3JtLnRzIiwiLi4vc3JjL2dldEFsb25nLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xuXG4vKiogVWkgb2YgdGhlIGZvcm0gZGlhbG9nLiAqL1xuY2xhc3MgRGlhbG9nVWkge1xuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0SGVpZ2h0OiBudW1iZXIgPSAyMDA7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRXaWR0aDogbnVtYmVyID0gNDUwO1xuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29uZmlybUJ1dHRvbkxhYmVsOiBzdHJpbmcgPSBcIlJlZnJlc2hcIjtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsOiBzdHJpbmcgPSBcIkNsb3NlXCI7XG5cbiAgICBwcml2YXRlIGNvbmZpcm1TdHJpbmdzOiBJQ29uZmlybVN0cmluZ3M7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maXJtU3RyaW5nczogSUNvbmZpcm1TdHJpbmdzKSB7XG4gICAgICAgIHRoaXMuY29uZmlybVN0cmluZ3MgPSBjb25maXJtU3RyaW5ncztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHMoKTogWHJtLk5hdmlnYXRpb24uQ29uZmlybVN0cmluZ3Mge1xuICAgICAgICBjb25zdCBjb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0czogWHJtLk5hdmlnYXRpb24uQ29uZmlybVN0cmluZ3MgPSB7XG4gICAgICAgICAgICBjYW5jZWxCdXR0b25MYWJlbDogdGhpcy5kZWZhdWx0Q2FuY2VsQnV0dG9uTGFiZWwsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENvbmZpcm1CdXR0b25MYWJlbCxcbiAgICAgICAgICAgIHN1YnRpdGxlOiB0aGlzLmNvbmZpcm1TdHJpbmdzLnN1YnRpdGxlLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5jb25maXJtU3RyaW5ncy50ZXh0LFxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3MudGl0bGUsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nVWk7XG4iLCJpbXBvcnQgTWV0YWRhdGEgZnJvbSBcIi4uL2Zvcm0vbWV0YWRhdGFcIjtcbmltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gXCIuLi90eXBlcy9JVXNlck5vdGlmaWNhdGlvblwiO1xuaW1wb3J0IERpYWxvZ1VpIGZyb20gXCIuL2RpYWxvZ1VpXCI7XG5cbi8qKiBDb25maXJtIGRpYWxvZyBub3RpZnlpbmcgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QuICovXG5jbGFzcyBEaWFsb2cgaW1wbGVtZW50cyBJVXNlck5vdGlmaWNhdGlvbiB7XG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xuICAgIHByaXZhdGUgbWV0YWRhdGE6IE1ldGFkYXRhO1xuICAgIHByaXZhdGUgdWk6IERpYWxvZ1VpO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncywgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCwgbWV0YWRhdGE6IE1ldGFkYXRhKSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICB0aGlzLnVpID0gbmV3IERpYWxvZ1VpKGNvbmZpcm1TdHJpbmdzKTtcbiAgICB9XG5cbiAgICAvKiogT3BlbnMgdGhlIGRpYWxvZywgbm90aWZ5aW5nIHVzZXIgb2YgYSBjb25mbGljdC4gKi9cbiAgICBwdWJsaWMgb3BlbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLm9wZW5DYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcbiAgICAgICAgICAgICAgICB3aW5kb3cucGFyZW50LmxvY2F0aW9uLnJlbG9hZChmYWxzZSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Db250ZXh0LnVpLmNsb3NlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9wZW5zIGEgY29uZmlybSBkaWFsb2cgdG8gbm90aWZ5IHVzZXIgb2YgYSBmb3JtIGNvbmZsaWN0IGFuZCBwcmV2ZW50IHRoZW0gZnJvbSBtYWtpbmcgZnVydGhlciBjaGFuZ2VzLlxuICAgICAqL1xuICAgIHByaXZhdGUgb3BlbkNhbGxiYWNrKGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCwgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY29uZmlybU9wdGlvbnMgPSB7IGhlaWdodDogdGhpcy51aS5kZWZhdWx0SGVpZ2h0LCB3aWR0aDogdGhpcy51aS5kZWZhdWx0V2lkdGggfTtcbiAgICAgICAgY29uc3QgY29uZmlybVN0cmluZ3MgPSB0aGlzLnVpLmdldENvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzKCk7XG5cbiAgICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkNvbmZpcm1EaWFsb2coY29uZmlybVN0cmluZ3MsIGNvbmZpcm1PcHRpb25zKS50aGVuKChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICBpZiAoc3VjY2Vzcy5jb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICBjb25maXJtQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FuY2VsQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEaWFsb2c7XG4iLCJpbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XG5pbXBvcnQgRm9ybSBmcm9tIFwiLi4vZm9ybS9mb3JtXCI7XG5pbXBvcnQgRGF0YSBmcm9tIFwiLi4vZm9ybS9kYXRhXCI7XG5cbi8qKiBGb3JtIG5vdGlmaWNhdGlvbiBiYW5uZXIgbm90aWZ5aW5nIHVzZXIgb2YgYSBmb3JtIGNvbmZsaWN0LiAqL1xuY2xhc3MgTm90aWZpY2F0aW9uIGltcGxlbWVudHMgSVVzZXJOb3RpZmljYXRpb24ge1xuICAgIHB1YmxpYyBpc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgZGF0YTogRGF0YTtcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihmb3JtOiBGb3JtKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGZvcm0uZGF0YTtcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm0uZm9ybUNvbnRleHQ7XG4gICAgfVxuXG4gICAgLyoqIE9wZW5zIHRoZSBub3RpZmljYXRpb24sIG5vdGlmeWluZyB1c2VyIG9mIGEgY29uZmxpY3QuICovXG4gICAgcHVibGljIG9wZW4oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuc2V0Rm9ybU5vdGlmaWNhdGlvbihcbiAgICAgICAgICAgICAgICB0aGlzLmdldE5vdGlmaWNhdGlvblRleHQoKSxcbiAgICAgICAgICAgICAgICBcIklORk9cIixcbiAgICAgICAgICAgICAgICBcIkdldEFsb25nTm90aWZpY2F0aW9uXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb3RpZmljYXRpb25UZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBgVGhpcyBmb3JtIGhhcyBiZWVuIG1vZGlmaWVkIGJ5ICR7dGhpcy5kYXRhLmxhdGVzdE1vZGlmaWVkQnl9IGF0ICR7dGhpcy5kYXRhLmxhdGVzdE1vZGlmaWVkT259LiBSZWZyZXNoIHRoZSBmb3JtIHRvIHNlZSBsYXRlc3QgY2hhbmdlcy5gO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vdGlmaWNhdGlvbjtcbiIsImNvbnN0IHByb2plY3ROYW1lID0gXCJnZXRhbG9uZy5qc1wiO1xuY29uc3QgY29uZmlnSXNJbnZhbGlkID0gYCR7cHJvamVjdE5hbWV9IGNvbmZpZyBpcyBpbnZhbGlkLmA7XG5cbmNvbnN0IE1FU1NBR0VTID0ge1xuICAgIGNvbmZpZ0lzSW52YWxpZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBhbmQgdGhlcmVmb3JlIHdvbid0IGxvYWRgLFxuICAgIGNvbmZpZ05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyBjb25maWcgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXG4gICAgY29uZmlybVN0cmluZ3NOb3RTcGVjaWZpZWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gVXNlIGRpYWxvZyBoYXMgYmVlbiBzZWxlY3RlZCBidXQgbm8gY29uZmlybSBzdHJpbmdzIGhhdmUgYmVlbiBwYXNzZWQuYCxcbiAgICBmb3JtSXNJbnZhbGlkOiBgJHtwcm9qZWN0TmFtZX0gdGhpbmtzIHRoZSBmb3JtIGlzIGludmFsaWQgYW5kIHRoZXJlZm9yZSB3b24ndCBsb2FkYCxcbiAgICBnZW5lcmljOiBgJHtwcm9qZWN0TmFtZX0gaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLmAsXG4gICAgcG9sbGluZ1RpbWVvdXQ6IGAke3Byb2plY3ROYW1lfSBoYXMgYmVlbiBwb2xsaW5nIGZvciAzMCBtaW51dGVzIGFuZCB3aWxsIHN0b3Agbm93LmAsXG4gICAgdGltZW91dE5vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyB0aW1lb3V0IGhhcyBiZWVuIHNwZWNpZmllZC5gLFxuICAgIHRpbWVvdXRPdXRzaWRlVmFsaWRSYW5nZTogYCR7Y29uZmlnSXNJbnZhbGlkfSBUaW1lb3V0IGlzIG91dHNpZGUgb2YgdmFsaWQgcmFuZ2UuYCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1FU1NBR0VTO1xuIiwiaW1wb3J0IElHZXRBbG9uZ0NvbmZpZyBmcm9tIFwiLi4vdHlwZXMvSUdldEFsb25nQ29uZmlnXCI7XG5pbXBvcnQgTUVTU0FHRVMgZnJvbSBcIi4vbWVzc2FnZXNcIjtcblxuLyoqIFZhbGlkYXRlcyB0aGUgY29uZmlnIHBhc3NlZCBieSBDUk0gZm9ybSBwcm9wZXJ0aWVzLiAqL1xuY2xhc3MgQ29uZmlnVmFsaWRhdG9yIHtcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xuICAgIHByaXZhdGUgdmFsaWRhdGlvblJ1bGVzOiBBcnJheTwoKSA9PiBib29sZWFuPjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLnZhbGlkYXRpb25SdWxlcyA9IFtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnSXNEZWZpbmVkLmJpbmQodGhpcyksXG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1NldHRpbmdzQXJlVmFsaWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHRoaXMudGltZW91dElzRGVmaW5lZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SXNWYWxpZC5iaW5kKHRoaXMpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGNvbmZpZyBpcyB2YWxpZCwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0aW9uUnVsZXMuZXZlcnkoKGZuOiAoKSA9PiBib29sZWFuKSA9PiBmbigpID09PSB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdJc0RlZmluZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTUVTU0FHRVMuY29uZmlnTm90U3BlY2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGlhbG9nU2V0dGluZ3NBcmVWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiYgdGhpcy5jb25maWcuY29uZmlybVN0cmluZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy5jb25maXJtU3RyaW5nc05vdFNwZWNpZmllZCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGltZW91dElzRGVmaW5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKE1FU1NBR0VTLnRpbWVvdXROb3RTcGVjaWZpZWQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aW1lb3V0SXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRpbWVvdXQgPCAxIHx8IHRoaXMuY29uZmlnLnRpbWVvdXQgPj0gMTgwMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0T3V0c2lkZVZhbGlkUmFuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZ1ZhbGlkYXRvcjtcbiIsImltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL2Zvcm1cIjtcbmltcG9ydCBEaWFsb2cgZnJvbSBcIi4uL25vdGlmaWNhdGlvbi9kaWFsb2dcIjtcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb25cIjtcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4uL3R5cGVzL0lHZXRBbG9uZ0NvbmZpZ1wiO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gXCIuLi90eXBlcy9JVXNlck5vdGlmaWNhdGlvblwiO1xuaW1wb3J0IENvbmZpZ1ZhbGlkYXRvciBmcm9tIFwiLi9jb25maWdWYWxpZGF0b3JcIjtcblxuY2xhc3MgQ29uZmlnIHtcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xuICAgIHByaXZhdGUgZm9ybTogRm9ybTtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnLCBmb3JtOiBGb3JtKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5wYXJzZUNvbmZpZyhjb25maWcpO1xuICAgICAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICAgIH1cblxuICAgIC8qKiBEZXJpdmVzIHRoZSB1c2VyIG5vdGlmaWNhdGlvbiwgZWl0aGVyIGEgZm9ybSBub3RpZmljYXRpb24gb3IgYSBkaWFsb2csIGZyb20gY29uZmlnIHBhc3NlZCBmcm9tIHRoZSBDUk0gZm9ybSBwcm9wZXJ0aWVzLiAqL1xuICAgIHB1YmxpYyBnZXRVc2VyTm90aWZpY2F0aW9uKCk6IElVc2VyTm90aWZpY2F0aW9uIHtcbiAgICAgICAgY29uc3QgaXNVc2VEaWFsb2dTZWxlY3RlZCA9IHRoaXMuY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiYgdGhpcy5jb25maWcuY29uZmlybVN0cmluZ3MgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgdXNlck5vdGlmaWNhdGlvbiA9IGlzVXNlRGlhbG9nU2VsZWN0ZWQgPyB0aGlzLmdldERpYWxvZygpIDogdGhpcy5nZXROb3RpZmljYXRpb24oKTtcblxuICAgICAgICByZXR1cm4gdXNlck5vdGlmaWNhdGlvbjtcbiAgICB9XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMgaXMgdmFsaWQgZm9yIHVzZSwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3IgPSBuZXcgQ29uZmlnVmFsaWRhdG9yKHRoaXMuY29uZmlnKTtcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRvci5pc1ZhbGlkKCk7XG5cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb3RpZmljYXRpb24oKTogTm90aWZpY2F0aW9uIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcy5mb3JtKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERpYWxvZygpOiBEaWFsb2cge1xuICAgICAgICByZXR1cm4gbmV3IERpYWxvZyh0aGlzLmNvbmZpZy5jb25maXJtU3RyaW5ncyEsIHRoaXMuZm9ybS5mb3JtQ29udGV4dCwgdGhpcy5mb3JtLm1ldGFkYXRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlQ29uZmlnKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKTogSUdldEFsb25nQ29uZmlnIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGltZW91dDogY29uZmlnLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZztcbiIsImltcG9ydCBNRVNTQUdFUyBmcm9tIFwiLi4vY29uZmlnL21lc3NhZ2VzXCI7XG5cbi8qKiBIYW5kbGVzIGZ1bmN0aW9uIGNhbGxzIGF0IGEgc2V0IHRpbWUgaW50ZXJ2YWwuICovXG5jbGFzcyBQb2xsIHtcbiAgICAvKipcbiAgICAgKiBQb2xscyBhIGZ1bmN0aW9uIGV2ZXJ5IHNwZWNpZmllZCBudW1iZXIgb2Ygc2Vjb25kcyB1bnRpbCBpdCByZXR1cm5zIHRydWUgb3IgdGltZW91dCBpcyByZWFjaGVkLlxuICAgICAqIEBwYXJhbSBmbiBjYWxsYmFjayBQcm9taXNlIHRvIHBvbGwuXG4gICAgICogQHBhcmFtIHRpbWVvdXQgc2Vjb25kcyB0byBjb250aW51ZSBwb2xsaW5nIGZvci5cbiAgICAgKiBAcGFyYW0gaW50ZXJ2YWwgc2Vjb25kcyBiZXR3ZWVuIHBvbGxpbmcgY2FsbHMuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsKGZuOiBhbnksIHRpbWVvdXQ6IG51bWJlciwgaW50ZXJ2YWw6IG51bWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSBOdW1iZXIobmV3IERhdGUoKSkgKyAodGltZW91dCAqIDEwMDApO1xuXG4gICAgICAgIGNvbnN0IGNoZWNrQ29uZGl0aW9uID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBmbigpO1xuXG4gICAgICAgICAgICBjYWxsYmFjay50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKE51bWJlcihuZXcgRGF0ZSgpKSA8IGVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjaGVja0NvbmRpdGlvbi5iaW5kKHRoaXMpLCBpbnRlcnZhbCAqIDEwMDAsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGNvbnNvbGUubG9nKE1FU1NBR0VTLnBvbGxpbmdUaW1lb3V0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGNoZWNrQ29uZGl0aW9uKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvbGw7XG4iLCIvKiogQ29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdXNlZCBmb3IgbWFraW5nIGRhdGEgaHVtYW4tcmVhZGFibGUuICovXG5jbGFzcyBQcm9jZXNzb3Ige1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgbW9kaWZpZWRvbiBkYXRlIGFzIGEgcmVhZGFibGUsIHVzZXIgbG9jYWxlIHN0cmluZy5cbiAgICAgKiBAcGFyYW0gYXBpUmVzcG9uc2UgQ1JNIEFQSSByZXNwb25zZSB0aGF0IGluY2x1ZGVzIFwibW9kaWZpZWRvblwiIGNvbHVtbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25EYXRlID0gKGFwaVJlc3BvbnNlICYmIGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pXG4gICAgICAgICAgICA/IGAke25ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pLnRvRGF0ZVN0cmluZygpfSxgICtcbiAgICAgICAgICAgIGAgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1gXG4gICAgICAgICAgICA6IHRoaXMuZGVmYXVsdE1vZGlmaWVkT25UaW1lO1xuXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uRGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIG1vZGlmaWVkIGJ5IHVzZXIncyBmdWxsIG5hbWUuXG4gICAgICogQHBhcmFtIGFwaVJlc3BvbnNlIENSTSBBUEkgcmVzcG9uc2UgdGhhdCBpbmNsdWRlcyBleHBhbmRlZCBcIm1vZGlmaWVkYnkuZnVsbG5hbWVcIiBjb2x1bW4uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtb2RpZmllZEJ5VXNlciA9IChhcGlSZXNwb25zZSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZGJ5ICYmIGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWUpXG4gICAgICAgICAgICA/IGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcbiAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRCeVVzZXI7XG5cbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkQnlVc2VyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRNb2RpZmllZEJ5VXNlciA9IFwiYW5vdGhlciB1c2VyXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZGVmYXVsdE1vZGlmaWVkT25UaW1lID0gXCJ0aGUgc2FtZSB0aW1lXCI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2Nlc3NvcjtcbiIsIi8qKiBJbnRlcmFjdHMgZGlyZWN0bHkgd2l0aCB0aGUgWHJtIFdlYiBBUEkuICovXG5jbGFzcyBRdWVyeSB7XG4gICAgLyoqXG4gICAgICogQ2FsbHMgQ1JNIEFQSSBhbmQgcmV0dXJucyB0aGUgZ2l2ZW4gZW50aXR5J3MgbW9kaWZpZWQgb24gZGF0ZS5cbiAgICAgKiBAcGFyYW0gZW50aXR5TmFtZSBzY2hlbWEgbmFtZSBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSBlbnRpdHlJZCBpZCBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0TGF0ZXN0TW9kaWZpZWRPbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBlbnRpdHlOYW1lPzogc3RyaW5nLCBlbnRpdHlJZD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSB0aGlzLmVudGl0eUlkIHx8IGVudGl0eUlkIHx8IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCk7XG4gICAgICAgIHRoaXMuZW50aXR5TmFtZSA9IHRoaXMuZW50aXR5TmFtZSB8fCBlbnRpdHlOYW1lIHx8IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcblxuICAgICAgICByZXR1cm4gWHJtLldlYkFwaS5yZXRyaWV2ZVJlY29yZCh0aGlzLmVudGl0eU5hbWUsIHRoaXMuZW50aXR5SWQsXG4gICAgICAgICAgICBcIj8kc2VsZWN0PW1vZGlmaWVkb24mJGV4cGFuZD1tb2RpZmllZGJ5KCRzZWxlY3Q9ZnVsbG5hbWUpXCIpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5SWQ6IHN0cmluZztcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXJ5O1xuIiwiaW1wb3J0IFByb2Nlc3NvciBmcm9tIFwiLi4vZGF0YS9wcm9jZXNzb3JcIjtcbmltcG9ydCBRdWVyeSBmcm9tIFwiLi4vZGF0YS9xdWVyeVwiO1xuXG4vKiogRGF0YSBvZiB0aGUgcmVjb3JkIGluIENSTS4gKi9cbmNsYXNzIERhdGEge1xuICAgIHB1YmxpYyBpbml0aWFsTW9kaWZpZWRPbjogRGF0ZSB8IHVuZGVmaW5lZDtcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRPbjogc3RyaW5nO1xuICAgIHB1YmxpYyBsYXRlc3RNb2RpZmllZEJ5OiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KSB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcbiAgICAgICAgdGhpcy5hZGRSZXNldE9uU2F2ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFzeW5jaHJvbm91c2x5IGluaXRpYWxpc2VzIGRhdGEsIGNhY2hpbmcgaW5pdGlhbCBtb2RpZmllZCBvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xuICAgICAgICB0aGlzLmNhY2hlQXBpUmVzcG9uc2UoYXBpUmVzcG9uc2UpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSBhcGlSZXNwb25zZS5tb2RpZmllZG9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgbW9kaWZpZWQgb24gZnJvbSBDUk0gc2VydmVyLiBSZXR1cm5zIHRydWUgaWYgaXQgaGFzIGNoYW5nZWQsIGFuZCBub3RpZmllcyB0aGUgdXNlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKG5vdGlmaWNhdGlvbkNhbGxiYWNrOiAoKSA9PiB2b2lkKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGlmICghdGhpcy5pbml0aWFsTW9kaWZpZWRPbikge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcGlSZXNwb25zZSA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24odGhpcy5mb3JtQ29udGV4dCk7XG5cbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkhhc0NoYW5nZWQgPSBhcGlSZXNwb25zZS5tb2RpZmllZG9uICYmXG4gICAgICAgICAgICAobmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikgPiBuZXcgRGF0ZSh0aGlzLmluaXRpYWxNb2RpZmllZE9uISkpXG4gICAgICAgICAgICA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICBpZiAobW9kaWZpZWRPbkhhc0NoYW5nZWQgJiYgbm90aWZpY2F0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbkNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkhhc0NoYW5nZWQ7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgbW9kaWZpZWQgb24gY2FjaGUgd2hlbiBmb3JtIGlzIHNhdmVkLlxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkUmVzZXRPblNhdmUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuYWRkT25TYXZlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FjaGVBcGlSZXNwb25zZShhcGlSZXNwb25zZTogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRCeSA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpO1xuICAgICAgICB0aGlzLmxhdGVzdE1vZGlmaWVkT24gPSBQcm9jZXNzb3IucHJvY2Vzc01vZGlmaWVkT25EYXRlKGFwaVJlc3BvbnNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGE7XG4iLCIvKiogUmVjb3JkIG1ldGFkYXRhIHVzZWQgdG8gcXVlcnkgdGhlIENSTSBBUEkuICovXG5jbGFzcyBNZXRhZGF0YSB7XG4gICAgcHVibGljIGVudGl0eUlkOiBzdHJpbmc7XG4gICAgcHVibGljIGVudGl0eU5hbWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCk7XG4gICAgICAgIHRoaXMuZW50aXR5TmFtZSA9IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmV2ZW50cyBmb3JtIGF0dHJpYnV0ZXMgZnJvbSBiZWluZyBzdWJtaXR0ZWQgd2hlbiB0aGUgcmVjb3JkIGlzIHNhdmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBwcmV2ZW50U2F2ZShmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KTogdm9pZCB7XG4gICAgICAgIGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGUuc2V0U3VibWl0TW9kZShcIm5ldmVyXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1ldGFkYXRhO1xuIiwiaW1wb3J0IERhdGEgZnJvbSBcIi4vZGF0YVwiO1xuaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuL21ldGFkYXRhXCI7XG5cbi8qKiBBIGZvcm0gaW4gRHluYW1pY3MgMzY1IENFLiAqL1xuY2xhc3MgRm9ybSB7XG4gICAgcHVibGljIGRhdGE6IERhdGE7XG4gICAgcHVibGljIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XG4gICAgcHVibGljIG1ldGFkYXRhOiBNZXRhZGF0YTtcblxuICAgIGNvbnN0cnVjdG9yKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCkge1xuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZXhlY3V0aW9uQ29udGV4dC5nZXRGb3JtQ29udGV4dCgpO1xuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YSh0aGlzLmZvcm1Db250ZXh0KTtcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG5ldyBNZXRhZGF0YSh0aGlzLmZvcm1Db250ZXh0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc3luY3Jvbm91c2x5IGluaXRpYWxpc2VzIGZvcm0gZGF0YS5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmluaXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWxvYWRzIHRoZSBmb3JtLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWxvYWQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGVudGl0eUlkID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XG5cbiAgICAgICAgWHJtLk5hdmlnYXRpb24ub3BlbkZvcm0oeyBlbnRpdHlJZCwgZW50aXR5TmFtZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZvcm0gdHlwZSBpcyBub3QgY3JlYXRlIG9yIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZm9ybVR5cGU6IFhybUVudW0uRm9ybVR5cGUgPSB0aGlzLmZvcm1Db250ZXh0LnVpLmdldEZvcm1UeXBlKCk7XG5cbiAgICAgICAgcmV0dXJuIGZvcm1UeXBlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAwICYmXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm07XG4iLCJpbXBvcnQgQ29uZmlnIGZyb20gXCIuL2NvbmZpZy9jb25maWdcIjtcbmltcG9ydCBNRVNTQUdFUyBmcm9tIFwiLi9jb25maWcvbWVzc2FnZXNcIjtcbmltcG9ydCBQb2xsIGZyb20gXCIuL2RhdGEvcG9sbFwiO1xuaW1wb3J0IEZvcm0gZnJvbSBcIi4vZm9ybS9mb3JtXCI7XG5pbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gXCIuL3R5cGVzL0lHZXRBbG9uZ0NvbmZpZ1wiO1xuaW1wb3J0IElVc2VyTm90aWZpY2F0aW9uIGZyb20gXCIuL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XG5cbi8qKlxuICogTm90aWZpZXMgdXNlcnMgd2hlbiBhIHJlY29yZCB0aGV5J3JlIHZpZXdpbmcgaXMgbW9kaWZpZWQgZWxzZXdoZXJlLlxuICovXG5jbGFzcyBHZXRBbG9uZyB7XG4gICAgLyoqIENoZWNrcyBmb3IgY29uZmxpY3RzIGFuZCBub3RpZmllcyB0aGUgdXNlciBpZiBhbnkgYXJlIGZvdW5kLiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgY2hlY2tGb3JDb25mbGljdHMoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCBjb25maWc6IElHZXRBbG9uZ0NvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc2Z1bEluaXQ6IGJvb2xlYW4gPSBhd2FpdCBHZXRBbG9uZy5pbml0KGV4ZWN1dGlvbkNvbnRleHQsIGNvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghc3VjY2Vzc2Z1bEluaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEdldEFsb25nLmZvcm0uZGF0YS5jaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbi5vcGVuLmJpbmQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbikpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGAke01FU1NBR0VTLmdlbmVyaWN9ICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBvbGxzIGZvciBjb25mbGljdHMgYW5kIG5vdGlmaWVzIHRoZSB1c2VyIGlmIGFueSBhcmUgZm91bmQuXG4gICAgICogQHBhcmFtIGV4ZWN1dGlvbkNvbnRleHQgcGFzc2VkIGJ5IGRlZmF1bHQgZnJvbSBEeW5hbWljcyBDUk0gZm9ybS5cbiAgICAgKiBAcGFyYW0gdGltZW91dCBkdXJhdGlvbiBpbiBzZWNvbmRzIHRvIHRpbWVvdXQgYmV0d2VlbiBwb2xsIG9wZXJhdGlvbnMuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsRm9yQ29uZmxpY3RzKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NmdWxJbml0OiBib29sZWFuID0gYXdhaXQgR2V0QWxvbmcuaW5pdChleGVjdXRpb25Db250ZXh0LCBjb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIXN1Y2Nlc3NmdWxJbml0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBQb2xsLnBvbGwoKCkgPT4gdGhpcy5mb3JtLmRhdGEuY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24ub3Blbi5iaW5kKEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24pKSwgMTgwMCAvIGNvbmZpZy50aW1lb3V0LCBjb25maWcudGltZW91dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uZmlnOiBDb25maWc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZm9ybTogRm9ybTtcbiAgICBwcml2YXRlIHN0YXRpYyB1c2VyTm90aWZpY2F0aW9uOiBJVXNlck5vdGlmaWNhdGlvbjtcblxuICAgIC8qKiBJbml0aWFsaXNlcyBHZXQgQWxvbmcuIFJldHVybnMgdHJ1ZSBpZiBzdWNjZXNzZnVsLCBvdGhlcndpc2UgZmFsc2UuICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgaW5pdChleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQsIGNvbmZpZzogSUdldEFsb25nQ29uZmlnKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIEdldEFsb25nLmZvcm0gPSBHZXRBbG9uZy5mb3JtIHx8IG5ldyBGb3JtKGV4ZWN1dGlvbkNvbnRleHQpO1xuICAgICAgICBhd2FpdCBHZXRBbG9uZy5mb3JtLmluaXQoKTtcblxuICAgICAgICBpZiAoIUdldEFsb25nLmZvcm0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNRVNTQUdFUy5mb3JtSXNJbnZhbGlkKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgR2V0QWxvbmcuY29uZmlnID0gR2V0QWxvbmcuY29uZmlnIHx8IG5ldyBDb25maWcoY29uZmlnLCBHZXRBbG9uZy5mb3JtKTtcblxuICAgICAgICBpZiAoIUdldEFsb25nLmNvbmZpZy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1FU1NBR0VTLmNvbmZpZ0lzSW52YWxpZCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24gPSBHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uIHx8IEdldEFsb25nLmNvbmZpZy5nZXRVc2VyTm90aWZpY2F0aW9uKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2V0QWxvbmc7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5n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
