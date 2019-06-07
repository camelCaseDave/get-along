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
                    Xrm.Navigation.openForm({ entityId: _this.metadata.entityId, entityName: _this.metadata.entityName });
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
        function Notification(text, formContext) {
            this.isOpen = false;
            this.formContext = formContext;
            this.text = text;
        }
        /** Opens the notification, notifying user of a conflict. */
        Notification.prototype.open = function () {
            if (!this.isOpen) {
                this.isOpen = true;
                this.formContext.ui.setFormNotification(this.text, "INFO", "GetAlongNotification");
            }
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
            this.config = config;
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
            var notificationText = "This form has been modified by " + this.form.data.latestModifiedBy + " at " + this.form.data.latestModifiedOn + ". Refresh the form to see latest changes.";
            return new Notification(notificationText, this.form.formContext);
        };
        Config.prototype.getDialog = function () {
            return new Dialog(this.config.confirmStrings, this.form.formContext, this.form.metadata);
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
                            this.cacheApiResponse(apiResponse);
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

    /** Notifies users when a record they're viewing is modified elsewhere. */
    var GetAlong = /** @class */ (function () {
        function GetAlong() {
        }
        /**
         * Polls for conflicts and notifies the user if any are found.
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
                            this.init(executionContext, config);
                            return [4 /*yield*/, this.form.data.getModifiedOn()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Poll.poll(function () { return _this.form.data.checkIfModifiedOnHasChanged(_this.userNotification.open.bind(_this.userNotification)); }, 1800 / config.timeout, config.timeout)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error(MESSAGES.generic + " " + e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /** Checks for conflicts and notifies the user if any are found. */
        GetAlong.checkForConflicts = function (executionContext, config) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    try {
                        this.init(executionContext, config);
                        this.form.data.checkIfModifiedOnHasChanged(this.userNotification.open.bind(this.userNotification));
                    }
                    catch (e) {
                        console.error(MESSAGES.generic + " " + e);
                    }
                    return [2 /*return*/];
                });
            });
        };
        /** Initialises Get Along */
        GetAlong.init = function (executionContext, config) {
            this.form = this.form || new Form(executionContext);
            this.config = this.config || new Config(config, this.form);
            if (!this.form.isValid()) {
                console.log(MESSAGES.formIsInvalid);
                return;
            }
            if (!this.config.isValid()) {
                console.log(MESSAGES.configIsInvalid);
                return;
            }
            this.userNotification = this.userNotification || this.config.getUserNotification();
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9ub3RpZmljYXRpb24vRGlhbG9nVWkudHMiLCIuLi9zcmMvbm90aWZpY2F0aW9uL0RpYWxvZy50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vTm90aWZpY2F0aW9uLnRzIiwiLi4vc3JjL2NvbmZpZy9NZXNzYWdlcy50cyIsIi4uL3NyYy9jb25maWcvQ29uZmlnVmFsaWRhdG9yLnRzIiwiLi4vc3JjL2NvbmZpZy9Db25maWcudHMiLCIuLi9zcmMvZGF0YS9Qb2xsLnRzIiwiLi4vc3JjL2RhdGEvUHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RhdGEvUXVlcnkudHMiLCIuLi9zcmMvZm9ybS9EYXRhLnRzIiwiLi4vc3JjL2Zvcm0vTWV0YWRhdGEudHMiLCIuLi9zcmMvZm9ybS9Gb3JtLnRzIiwiLi4vc3JjL0dldEFsb25nLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5cclxuLyoqIFVpIG9mIHRoZSBmb3JtIGRpYWxvZy4gKi9cclxuY2xhc3MgRGlhbG9nVWkge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRIZWlnaHQ6IG51bWJlciA9IDIwMDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0V2lkdGg6IG51bWJlciA9IDQ1MDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29uZmlybUJ1dHRvbkxhYmVsOiBzdHJpbmcgPSBcIlJlZnJlc2hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q2FuY2VsQnV0dG9uTGFiZWw6IHN0cmluZyA9IFwiQ2xvc2VcIjtcclxuXHJcbiAgICBwcml2YXRlIGNvbmZpcm1TdHJpbmdzOiBJQ29uZmlybVN0cmluZ3M7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncykge1xyXG4gICAgICAgIHRoaXMuY29uZmlybVN0cmluZ3MgPSBjb25maXJtU3RyaW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHMoKTogWHJtLk5hdmlnYXRpb24uQ29uZmlybVN0cmluZ3Mge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzOiBYcm0uTmF2aWdhdGlvbi5Db25maXJtU3RyaW5ncyA9IHtcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENvbmZpcm1CdXR0b25MYWJlbCxcclxuICAgICAgICAgICAgc3VidGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3Muc3VidGl0bGUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlybVN0cmluZ3MudGV4dCxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3MudGl0bGUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dVaTtcclxuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuLi9mb3JtL01ldGFkYXRhXCI7XHJcbmltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBEaWFsb2dVaSBmcm9tIFwiLi9EaWFsb2dVaVwiO1xyXG5cclxuLyoqIENvbmZpcm0gZGlhbG9nIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cclxuY2xhc3MgRGlhbG9nIGltcGxlbWVudHMgSVVzZXJOb3RpZmljYXRpb24ge1xyXG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuICAgIHByaXZhdGUgbWV0YWRhdGE6IE1ldGFkYXRhO1xyXG4gICAgcHJpdmF0ZSB1aTogRGlhbG9nVWk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncywgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCwgbWV0YWRhdGE6IE1ldGFkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm1Db250ZXh0O1xyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICB0aGlzLnVpID0gbmV3IERpYWxvZ1VpKGNvbmZpcm1TdHJpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogT3BlbnMgdGhlIGRpYWxvZywgbm90aWZ5aW5nIHVzZXIgb2YgYSBjb25mbGljdC4gKi9cclxuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcGVuQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgICAgIFhybS5OYXZpZ2F0aW9uLm9wZW5Gb3JtKHsgZW50aXR5SWQ6IHRoaXMubWV0YWRhdGEuZW50aXR5SWQsIGVudGl0eU5hbWU6IHRoaXMubWV0YWRhdGEuZW50aXR5TmFtZSB9KTtcclxuICAgICAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb3BlbkNhbGxiYWNrKGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCwgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb25maXJtT3B0aW9ucyA9IHsgaGVpZ2h0OiB0aGlzLnVpLmRlZmF1bHRIZWlnaHQsIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzID0gdGhpcy51aS5nZXRDb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cygpO1xyXG5cclxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuQ29uZmlybURpYWxvZyhjb25maXJtU3RyaW5ncywgY29uZmlybU9wdGlvbnMpLnRoZW4oKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MuY29uZmlybWVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maXJtQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nO1xyXG4iLCJpbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcblxyXG4vKiogRm9ybSBub3RpZmljYXRpb24gYmFubmVyIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cclxuY2xhc3MgTm90aWZpY2F0aW9uIGltcGxlbWVudHMgSVVzZXJOb3RpZmljYXRpb24ge1xyXG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBPcGVucyB0aGUgbm90aWZpY2F0aW9uLCBub3RpZnlpbmcgdXNlciBvZiBhIGNvbmZsaWN0LiAqL1xyXG4gICAgcHVibGljIG9wZW4oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xyXG4gICAgICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuc2V0Rm9ybU5vdGlmaWNhdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCxcclxuICAgICAgICAgICAgICAgIFwiSU5GT1wiLFxyXG4gICAgICAgICAgICAgICAgXCJHZXRBbG9uZ05vdGlmaWNhdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5vdGlmaWNhdGlvbjtcclxuIiwiY29uc3QgcHJvamVjdE5hbWUgPSBcImdldGFsb25nLmpzXCI7XHJcbmNvbnN0IGNvbmZpZ0lzSW52YWxpZCA9IGAke3Byb2plY3ROYW1lfSBjb25maWcgaXMgaW52YWxpZC5gO1xyXG5cclxuY29uc3QgTUVTU0FHRVMgPSB7XHJcbiAgICBjb25maWdJc0ludmFsaWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gYW5kIHRoZXJlZm9yZSB3b24ndCBsb2FkYCxcclxuICAgIGNvbmZpZ05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyBjb25maWcgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXHJcbiAgICBjb25maXJtU3RyaW5nc05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBVc2UgZGlhbG9nIGhhcyBiZWVuIHNlbGVjdGVkIGJ1dCBubyBjb25maXJtIHN0cmluZ3MgaGF2ZSBiZWVuIHBhc3NlZC5gLFxyXG4gICAgZm9ybUlzSW52YWxpZDogYCR7cHJvamVjdE5hbWV9IHRoaW5rcyB0aGUgZm9ybSBpcyBpbnZhbGlkIGFuZCB0aGVyZWZvcmUgd29uJ3QgbG9hZGAsXHJcbiAgICBnZW5lcmljOiBgJHtwcm9qZWN0TmFtZX0gaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLmAsXHJcbiAgICBwb2xsaW5nVGltZW91dDogYCR7cHJvamVjdE5hbWV9IGhhcyBiZWVuIHBvbGxpbmcgZm9yIDMwIG1pbnV0ZXMgYW5kIHdpbGwgc3RvcCBub3cuYCxcclxuICAgIHRpbWVvdXROb3RTcGVjaWZpZWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gTm8gdGltZW91dCBoYXMgYmVlbiBzcGVjaWZpZWQuYCxcclxuICAgIHRpbWVvdXRPdXRzaWRlVmFsaWRSYW5nZTogYCR7Y29uZmlnSXNJbnZhbGlkfSBUaW1lb3V0IGlzIG91dHNpZGUgb2YgdmFsaWQgcmFuZ2UuYCxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1FU1NBR0VTO1xyXG4iLCJpbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gXCIuLi90eXBlcy9JR2V0QWxvbmdDb25maWdcIjtcclxuaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuL01lc3NhZ2VzXCI7XHJcblxyXG4vKiogVmFsaWRhdGVzIHRoZSBjb25maWcgcGFzc2VkIGJ5IENSTSBmb3JtIHByb3BlcnRpZXMuICovXHJcbmNsYXNzIENvbmZpZ1ZhbGlkYXRvciB7XHJcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSB2YWxpZGF0aW9uUnVsZXM6IEFycmF5PCgpID0+IGJvb2xlYW4+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uUnVsZXMgPSBbXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnSXNEZWZpbmVkLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nU2V0dGluZ3NBcmVWYWxpZC5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJc0RlZmluZWQuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SXNWYWxpZC5iaW5kKHRoaXMpLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY29uZmlnIGlzIHZhbGlkLCBvdGhlcndpc2UgZmFsc2UuICovXHJcbiAgICBwdWJsaWMgaXNWYWxpZCgpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0aW9uUnVsZXMuZXZlcnkoKGZuOiAoKSA9PiBib29sZWFuKSA9PiBmbigpID09PSB0cnVlKTtcclxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbmZpZ0lzRGVmaW5lZCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKE1FU1NBR0VTLmNvbmZpZ05vdFNwZWNpZmllZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkaWFsb2dTZXR0aW5nc0FyZVZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5jb25maXJtRGlhbG9nID09PSB0cnVlICYmIHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy5jb25maXJtU3RyaW5nc05vdFNwZWNpZmllZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lb3V0SXNEZWZpbmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0Tm90U3BlY2lmaWVkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRpbWVvdXRJc1ZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0IDwgMSB8fCB0aGlzLmNvbmZpZy50aW1lb3V0ID49IDE4MDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0T3V0c2lkZVZhbGlkUmFuZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb25maWdWYWxpZGF0b3I7XHJcbiIsImltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL0Zvcm1cIjtcclxuaW1wb3J0IERpYWxvZyBmcm9tIFwiLi4vbm90aWZpY2F0aW9uL0RpYWxvZ1wiO1xyXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gXCIuLi9ub3RpZmljYXRpb24vTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4uL3R5cGVzL0lHZXRBbG9uZ0NvbmZpZ1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBDb25maWdWYWxpZGF0b3IgZnJvbSBcIi4vQ29uZmlnVmFsaWRhdG9yXCI7XHJcblxyXG5jbGFzcyBDb25maWcge1xyXG4gICAgcHJpdmF0ZSBjb25maWc6IElHZXRBbG9uZ0NvbmZpZztcclxuICAgIHByaXZhdGUgZm9ybTogRm9ybTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IElHZXRBbG9uZ0NvbmZpZywgZm9ybTogRm9ybSkge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIERlcml2ZXMgdGhlIHVzZXIgbm90aWZpY2F0aW9uLCBlaXRoZXIgYSBmb3JtIG5vdGlmaWNhdGlvbiBvciBhIGRpYWxvZywgZnJvbSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMuICovXHJcbiAgICBwdWJsaWMgZ2V0VXNlck5vdGlmaWNhdGlvbigpOiBJVXNlck5vdGlmaWNhdGlvbiB7XHJcbiAgICAgICAgY29uc3QgaXNVc2VEaWFsb2dTZWxlY3RlZCA9IHRoaXMuY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiYgdGhpcy5jb25maWcuY29uZmlybVN0cmluZ3MgIT09IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCB1c2VyTm90aWZpY2F0aW9uID0gaXNVc2VEaWFsb2dTZWxlY3RlZCA/IHRoaXMuZ2V0RGlhbG9nKCkgOiB0aGlzLmdldE5vdGlmaWNhdGlvbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdXNlck5vdGlmaWNhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMgaXMgdmFsaWQgZm9yIHVzZSwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xyXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gbmV3IENvbmZpZ1ZhbGlkYXRvcih0aGlzLmNvbmZpZyk7XHJcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRvci5pc1ZhbGlkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Tm90aWZpY2F0aW9uKCk6IE5vdGlmaWNhdGlvbiB7XHJcbiAgICAgICAgY29uc3Qgbm90aWZpY2F0aW9uVGV4dCA9IGBUaGlzIGZvcm0gaGFzIGJlZW4gbW9kaWZpZWQgYnkgJHt0aGlzLmZvcm0uZGF0YS5sYXRlc3RNb2RpZmllZEJ5fSBhdCAke3RoaXMuZm9ybS5kYXRhLmxhdGVzdE1vZGlmaWVkT259LiBSZWZyZXNoIHRoZSBmb3JtIHRvIHNlZSBsYXRlc3QgY2hhbmdlcy5gO1xyXG4gICAgICAgIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvblRleHQsIHRoaXMuZm9ybS5mb3JtQ29udGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXREaWFsb2coKTogRGlhbG9nIHtcclxuICAgICAgICByZXR1cm4gbmV3IERpYWxvZyh0aGlzLmNvbmZpZy5jb25maXJtU3RyaW5ncyEsIHRoaXMuZm9ybS5mb3JtQ29udGV4dCwgdGhpcy5mb3JtLm1ldGFkYXRhKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29uZmlnO1xyXG4iLCJpbXBvcnQgTUVTU0FHRVMgZnJvbSBcIi4uL2NvbmZpZy9NZXNzYWdlc1wiO1xyXG5cclxuLyoqIEhhbmRsZXMgZnVuY3Rpb24gY2FsbHMgYXQgYSBzZXQgdGltZSBpbnRlcnZhbC4gKi9cclxuY2xhc3MgUG9sbCB7XHJcbiAgICAvKipcclxuICAgICAqIFBvbGxzIGEgZnVuY3Rpb24gZXZlcnkgc3BlY2lmaWVkIG51bWJlciBvZiBzZWNvbmRzIHVudGlsIGl0IHJldHVybnMgdHJ1ZSBvciB0aW1lb3V0IGlzIHJlYWNoZWQuXHJcbiAgICAgKiBAcGFyYW0gZm4gY2FsbGJhY2sgUHJvbWlzZSB0byBwb2xsLlxyXG4gICAgICogQHBhcmFtIHRpbWVvdXQgc2Vjb25kcyB0byBjb250aW51ZSBwb2xsaW5nIGZvci5cclxuICAgICAqIEBwYXJhbSBpbnRlcnZhbCBzZWNvbmRzIGJldHdlZW4gcG9sbGluZyBjYWxscy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsKGZuOiBhbnksIHRpbWVvdXQ6IG51bWJlciwgaW50ZXJ2YWw6IG51bWJlcik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IE51bWJlcihuZXcgRGF0ZSgpKSArICh0aW1lb3V0ICogMTAwMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNoZWNrQ29uZGl0aW9uID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGZuKCk7XHJcblxyXG4gICAgICAgICAgICBjYWxsYmFjay50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKE51bWJlcihuZXcgRGF0ZSgpKSA8IGVuZFRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNoZWNrQ29uZGl0aW9uLmJpbmQodGhpcyksIGludGVydmFsICogMTAwMCwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGNvbnNvbGUubG9nKE1FU1NBR0VTLnBvbGxpbmdUaW1lb3V0KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShjaGVja0NvbmRpdGlvbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvbGw7XHJcbiIsIi8qKiBDb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB1c2VkIGZvciBtYWtpbmcgZGF0YSBodW1hbi1yZWFkYWJsZS4gKi9cclxuY2xhc3MgUHJvY2Vzc29yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWRvbiBkYXRlIGFzIGEgcmVhZGFibGUsIHVzZXIgbG9jYWxlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgXCJtb2RpZmllZG9uXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkRhdGUgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRvbilcclxuICAgICAgICAgICAgPyBgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0RhdGVTdHJpbmcoKX0sYCArXHJcbiAgICAgICAgICAgIGAgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1gXHJcbiAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRPblRpbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uRGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWQgYnkgdXNlcidzIGZ1bGwgbmFtZS5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgZXhwYW5kZWQgXCJtb2RpZmllZGJ5LmZ1bGxuYW1lXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRCeVVzZXIgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZGJ5LmZ1bGxuYW1lKVxyXG4gICAgICAgICAgICA/IGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcclxuICAgICAgICAgICAgOiB0aGlzLmRlZmF1bHRNb2RpZmllZEJ5VXNlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkQnlVc2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRNb2RpZmllZEJ5VXNlciA9IFwiYW5vdGhlciB1c2VyXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRPblRpbWUgPSBcInRoZSBzYW1lIHRpbWVcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvY2Vzc29yO1xyXG4iLCIvKiogSW50ZXJhY3RzIGRpcmVjdGx5IHdpdGggdGhlIFhybSBXZWIgQVBJLiAqL1xyXG5jbGFzcyBRdWVyeSB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGxzIENSTSBBUEkgYW5kIHJldHVybnMgdGhlIGdpdmVuIGVudGl0eSdzIG1vZGlmaWVkIG9uIGRhdGUuXHJcbiAgICAgKiBAcGFyYW0gZW50aXR5TmFtZSBzY2hlbWEgbmFtZSBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxyXG4gICAgICogQHBhcmFtIGVudGl0eUlkIGlkIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0TGF0ZXN0TW9kaWZpZWRPbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBlbnRpdHlOYW1lPzogc3RyaW5nLCBlbnRpdHlJZD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSB0aGlzLmVudGl0eU5hbWUgfHwgZW50aXR5TmFtZSB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKHRoaXMuZW50aXR5TmFtZSwgdGhpcy5lbnRpdHlJZCxcclxuICAgICAgICAgICAgXCI/JHNlbGVjdD1tb2RpZmllZG9uJiRleHBhbmQ9bW9kaWZpZWRieSgkc2VsZWN0PWZ1bGxuYW1lKVwiKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5TmFtZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBRdWVyeTtcclxuIiwiaW1wb3J0IFByb2Nlc3NvciBmcm9tIFwiLi4vZGF0YS9Qcm9jZXNzb3JcIjtcclxuaW1wb3J0IFF1ZXJ5IGZyb20gXCIuLi9kYXRhL1F1ZXJ5XCI7XHJcblxyXG4vKiogRGF0YSBvZiB0aGUgcmVjb3JkIGluIENSTS4gKi9cclxuY2xhc3MgRGF0YSB7XHJcbiAgICBwdWJsaWMgaW5pdGlhbE1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRPbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGxhdGVzdE1vZGlmaWVkQnk6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcclxuICAgICAgICB0aGlzLmFkZFJlc2V0T25TYXZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBmb3JtIG1vZGlmaWVkIG9uIGRhdGUuIENhbGxzIENSTSBBUEkgaWYgbW9kaWZpZWQgb24gYXR0cmlidXRlIGlzIG5vdCBvbiB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGdldE1vZGlmaWVkT24oKTogUHJvbWlzZTxEYXRlIHwgdW5kZWZpbmVkPiB7XHJcbiAgICAgICAgbGV0IG1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkF0dHJpYnV0ZTogWHJtLkF0dHJpYnV0ZXMuRGF0ZUF0dHJpYnV0ZSA9IHRoaXMuZm9ybUNvbnRleHQuZ2V0QXR0cmlidXRlKFwibW9kaWZpZWRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25BdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgbW9kaWZpZWRPbiA9IG1vZGlmaWVkT25BdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcGlSZXNwb25zZSA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24odGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICAgICAgICAgIG1vZGlmaWVkT24gPSBhcGlSZXNwb25zZS5tb2RpZmllZG9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IG1vZGlmaWVkT247XHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIG1vZGlmaWVkIG9uIGZyb20gQ1JNIHNlcnZlci4gUmV0dXJucyB0cnVlIGlmIGl0IGhhcyBjaGFuZ2VkLCBhbmQgbm90aWZpZXMgdGhlIHVzZXIuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQobm90aWZpY2F0aW9uQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdGhpcy5pbml0aWFsTW9kaWZpZWRPbiB8fCBhd2FpdCB0aGlzLmdldE1vZGlmaWVkT24oKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuY2FjaGVBcGlSZXNwb25zZShhcGlSZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25IYXNDaGFuZ2VkID0gYXBpUmVzcG9uc2UubW9kaWZpZWRvbiAmJlxyXG4gICAgICAgICAgICAobmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikgPiBuZXcgRGF0ZSh0aGlzLmluaXRpYWxNb2RpZmllZE9uISkpXHJcbiAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAobW9kaWZpZWRPbkhhc0NoYW5nZWQgJiYgbm90aWZpY2F0aW9uQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uSGFzQ2hhbmdlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0cyBtb2RpZmllZCBvbiBjYWNoZSB3aGVuIGZvcm0gaXMgc2F2ZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkUmVzZXRPblNhdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hZGRPblNhdmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FjaGVBcGlSZXNwb25zZShhcGlSZXNwb25zZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZEJ5ID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk7XHJcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZE9uID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGE7XHJcbiIsIi8qKiBSZWNvcmQgbWV0YWRhdGEgdXNlZCB0byBxdWVyeSB0aGUgQ1JNIEFQSS4gKi9cclxuY2xhc3MgTWV0YWRhdGEge1xyXG4gICAgcHVibGljIGVudGl0eUlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmVudGl0eUlkID0gZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcmV2ZW50cyBmb3JtIGF0dHJpYnV0ZXMgZnJvbSBiZWluZyBzdWJtaXR0ZWQgd2hlbiB0aGUgcmVjb3JkIGlzIHNhdmVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJldmVudFNhdmUoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRTdWJtaXRNb2RlKFwibmV2ZXJcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1ldGFkYXRhO1xyXG4iLCJpbXBvcnQgRGF0YSBmcm9tIFwiLi9EYXRhXCI7XHJcbmltcG9ydCBNZXRhZGF0YSBmcm9tIFwiLi9NZXRhZGF0YVwiO1xyXG5cclxuLyoqIEEgZm9ybSBpbiBEeW5hbWljcyAzNjUgQ0UuICovXHJcbmNsYXNzIEZvcm0ge1xyXG4gICAgcHVibGljIGRhdGE6IERhdGE7XHJcbiAgICBwdWJsaWMgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuICAgIHB1YmxpYyBtZXRhZGF0YTogTWV0YWRhdGE7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGV4ZWN1dGlvbkNvbnRleHQuZ2V0Rm9ybUNvbnRleHQoKTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICB0aGlzLm1ldGFkYXRhID0gbmV3IE1ldGFkYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVsb2FkcyB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBlbnRpdHlJZCA9IHRoaXMuZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIFhybS5OYXZpZ2F0aW9uLm9wZW5Gb3JtKHsgZW50aXR5SWQsIGVudGl0eU5hbWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZvcm0gdHlwZSBpcyBub3QgY3JlYXRlIG9yIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgZm9ybVR5cGU6IFhybUVudW0uRm9ybVR5cGUgPSB0aGlzLmZvcm1Db250ZXh0LnVpLmdldEZvcm1UeXBlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmb3JtVHlwZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAwICYmXHJcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGb3JtO1xyXG4iLCJpbXBvcnQgQ29uZmlnIGZyb20gXCIuL2NvbmZpZy9Db25maWdcIjtcclxuaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuL2NvbmZpZy9NZXNzYWdlc1wiO1xyXG5pbXBvcnQgUG9sbCBmcm9tIFwiLi9kYXRhL1BvbGxcIjtcclxuaW1wb3J0IEZvcm0gZnJvbSBcIi4vZm9ybS9Gb3JtXCI7XHJcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4vdHlwZXMvSUdldEFsb25nQ29uZmlnXCI7XHJcbmltcG9ydCBJVXNlck5vdGlmaWNhdGlvbiBmcm9tIFwiLi90eXBlcy9JVXNlck5vdGlmaWNhdGlvblwiO1xyXG5cclxuLyoqIE5vdGlmaWVzIHVzZXJzIHdoZW4gYSByZWNvcmQgdGhleSdyZSB2aWV3aW5nIGlzIG1vZGlmaWVkIGVsc2V3aGVyZS4gKi9cclxuY2xhc3MgR2V0QWxvbmcge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQb2xscyBmb3IgY29uZmxpY3RzIGFuZCBub3RpZmllcyB0aGUgdXNlciBpZiBhbnkgYXJlIGZvdW5kLlxyXG4gICAgICogQHBhcmFtIGV4ZWN1dGlvbkNvbnRleHQgcGFzc2VkIGJ5IGRlZmF1bHQgZnJvbSBEeW5hbWljcyBDUk0gZm9ybS5cclxuICAgICAqIEBwYXJhbSB0aW1lb3V0IGR1cmF0aW9uIGluIHNlY29uZHMgdG8gdGltZW91dCBiZXR3ZWVuIHBvbGwgb3BlcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsRm9yQ29uZmxpY3RzKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXQoZXhlY3V0aW9uQ29udGV4dCwgY29uZmlnKTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZm9ybS5kYXRhLmdldE1vZGlmaWVkT24oKTtcclxuICAgICAgICAgICAgYXdhaXQgUG9sbC5wb2xsKCgpID0+IHRoaXMuZm9ybS5kYXRhLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZCh0aGlzLnVzZXJOb3RpZmljYXRpb24ub3Blbi5iaW5kKHRoaXMudXNlck5vdGlmaWNhdGlvbikpLCAxODAwIC8gY29uZmlnLnRpbWVvdXQsIGNvbmZpZy50aW1lb3V0KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQ2hlY2tzIGZvciBjb25mbGljdHMgYW5kIG5vdGlmaWVzIHRoZSB1c2VyIGlmIGFueSBhcmUgZm91bmQuICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGNoZWNrRm9yQ29uZmxpY3RzKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXQoZXhlY3V0aW9uQ29udGV4dCwgY29uZmlnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZm9ybS5kYXRhLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZCh0aGlzLnVzZXJOb3RpZmljYXRpb24ub3Blbi5iaW5kKHRoaXMudXNlck5vdGlmaWNhdGlvbikpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHtNRVNTQUdFUy5nZW5lcmljfSAke2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbmZpZzogQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZm9ybTogRm9ybTtcclxuICAgIHByaXZhdGUgc3RhdGljIHVzZXJOb3RpZmljYXRpb246IElVc2VyTm90aWZpY2F0aW9uO1xyXG5cclxuICAgIC8qKiBJbml0aWFsaXNlcyBHZXQgQWxvbmcgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGluaXQoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCBjb25maWc6IElHZXRBbG9uZ0NvbmZpZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZm9ybSB8fCBuZXcgRm9ybShleGVjdXRpb25Db250ZXh0KTtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IHRoaXMuY29uZmlnIHx8IG5ldyBDb25maWcoY29uZmlnLCB0aGlzLmZvcm0pO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZm9ybS5pc1ZhbGlkKCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coTUVTU0FHRVMuZm9ybUlzSW52YWxpZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jb25maWcuaXNWYWxpZCgpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1FU1NBR0VTLmNvbmZpZ0lzSW52YWxpZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXNlck5vdGlmaWNhdGlvbiA9IHRoaXMudXNlck5vdGlmaWNhdGlvbiB8fCB0aGlzLmNvbmZpZy5nZXRVc2VyTm90aWZpY2F0aW9uKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdldEFsb25nO1xyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVBO0lBQ0E7UUFRSSxrQkFBWSxjQUErQjtZQVAzQixrQkFBYSxHQUFXLEdBQUcsQ0FBQztZQUM1QixpQkFBWSxHQUFXLEdBQUcsQ0FBQztZQUMzQiw4QkFBeUIsR0FBVyxTQUFTLENBQUM7WUFDOUMsNkJBQXdCLEdBQVcsT0FBTyxDQUFDO1lBS3ZELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1NBQ3hDO1FBRU0sZ0RBQTZCLEdBQXBDO1lBQ0ksSUFBTSwwQkFBMEIsR0FBa0M7Z0JBQzlELGlCQUFpQixFQUFFLElBQUksQ0FBQyx3QkFBd0I7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
