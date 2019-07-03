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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9ub3RpZmljYXRpb24vZGlhbG9nVWkudHMiLCIuLi9zcmMvbm90aWZpY2F0aW9uL2RpYWxvZy50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLnRzIiwiLi4vc3JjL2NvbmZpZy9tZXNzYWdlcy50cyIsIi4uL3NyYy9jb25maWcvY29uZmlnVmFsaWRhdG9yLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWcudHMiLCIuLi9zcmMvZGF0YS9wb2xsLnRzIiwiLi4vc3JjL2RhdGEvcHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RhdGEvcXVlcnkudHMiLCIuLi9zcmMvZm9ybS9kYXRhLnRzIiwiLi4vc3JjL2Zvcm0vbWV0YWRhdGEudHMiLCIuLi9zcmMvZm9ybS9mb3JtLnRzIiwiLi4vc3JjL2dldEFsb25nLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5cclxuLyoqIFVpIG9mIHRoZSBmb3JtIGRpYWxvZy4gKi9cclxuY2xhc3MgRGlhbG9nVWkge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRIZWlnaHQ6IG51bWJlciA9IDIwMDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0V2lkdGg6IG51bWJlciA9IDQ1MDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29uZmlybUJ1dHRvbkxhYmVsOiBzdHJpbmcgPSBcIlJlZnJlc2hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q2FuY2VsQnV0dG9uTGFiZWw6IHN0cmluZyA9IFwiQ2xvc2VcIjtcclxuXHJcbiAgICBwcml2YXRlIGNvbmZpcm1TdHJpbmdzOiBJQ29uZmlybVN0cmluZ3M7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncykge1xyXG4gICAgICAgIHRoaXMuY29uZmlybVN0cmluZ3MgPSBjb25maXJtU3RyaW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHMoKTogWHJtLk5hdmlnYXRpb24uQ29uZmlybVN0cmluZ3Mge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzOiBYcm0uTmF2aWdhdGlvbi5Db25maXJtU3RyaW5ncyA9IHtcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENvbmZpcm1CdXR0b25MYWJlbCxcclxuICAgICAgICAgICAgc3VidGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3Muc3VidGl0bGUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlybVN0cmluZ3MudGV4dCxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3MudGl0bGUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dVaTtcclxuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuLi9mb3JtL21ldGFkYXRhXCI7XHJcbmltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBEaWFsb2dVaSBmcm9tIFwiLi9kaWFsb2dVaVwiO1xyXG5cclxuLyoqIENvbmZpcm0gZGlhbG9nIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cclxuY2xhc3MgRGlhbG9nIGltcGxlbWVudHMgSVVzZXJOb3RpZmljYXRpb24ge1xyXG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuICAgIHByaXZhdGUgbWV0YWRhdGE6IE1ldGFkYXRhO1xyXG4gICAgcHJpdmF0ZSB1aTogRGlhbG9nVWk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncywgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCwgbWV0YWRhdGE6IE1ldGFkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm1Db250ZXh0O1xyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICB0aGlzLnVpID0gbmV3IERpYWxvZ1VpKGNvbmZpcm1TdHJpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogT3BlbnMgdGhlIGRpYWxvZywgbm90aWZ5aW5nIHVzZXIgb2YgYSBjb25mbGljdC4gKi9cclxuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcGVuQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5wYXJlbnQubG9jYXRpb24ucmVsb2FkKGZhbHNlKTtcclxuICAgICAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb3BlbkNhbGxiYWNrKGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCwgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb25maXJtT3B0aW9ucyA9IHsgaGVpZ2h0OiB0aGlzLnVpLmRlZmF1bHRIZWlnaHQsIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzID0gdGhpcy51aS5nZXRDb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cygpO1xyXG5cclxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuQ29uZmlybURpYWxvZyhjb25maXJtU3RyaW5ncywgY29uZmlybU9wdGlvbnMpLnRoZW4oKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MuY29uZmlybWVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maXJtQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nO1xyXG4iLCJpbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL2Zvcm1cIjtcclxuaW1wb3J0IERhdGEgZnJvbSBcIi4uL2Zvcm0vZGF0YVwiO1xyXG5cclxuLyoqIEZvcm0gbm90aWZpY2F0aW9uIGJhbm5lciBub3RpZnlpbmcgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QuICovXHJcbmNsYXNzIE5vdGlmaWNhdGlvbiBpbXBsZW1lbnRzIElVc2VyTm90aWZpY2F0aW9uIHtcclxuICAgIHB1YmxpYyBpc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIGRhdGE6IERhdGE7XHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybTogRm9ybSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGZvcm0uZGF0YTtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybS5mb3JtQ29udGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogT3BlbnMgdGhlIG5vdGlmaWNhdGlvbiwgbm90aWZ5aW5nIHVzZXIgb2YgYSBjb25mbGljdC4gKi9cclxuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldE5vdGlmaWNhdGlvblRleHQoKSxcclxuICAgICAgICAgICAgICAgIFwiSU5GT1wiLFxyXG4gICAgICAgICAgICAgICAgXCJHZXRBbG9uZ05vdGlmaWNhdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXROb3RpZmljYXRpb25UZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGBUaGlzIGZvcm0gaGFzIGJlZW4gbW9kaWZpZWQgYnkgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRCeX0gYXQgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRPbn0uIFJlZnJlc2ggdGhlIGZvcm0gdG8gc2VlIGxhdGVzdCBjaGFuZ2VzLmA7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5vdGlmaWNhdGlvbjtcclxuIiwiY29uc3QgcHJvamVjdE5hbWUgPSBcImdldGFsb25nLmpzXCI7XHJcbmNvbnN0IGNvbmZpZ0lzSW52YWxpZCA9IGAke3Byb2plY3ROYW1lfSBjb25maWcgaXMgaW52YWxpZC5gO1xyXG5cclxuY29uc3QgTUVTU0FHRVMgPSB7XHJcbiAgICBjb25maWdJc0ludmFsaWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gYW5kIHRoZXJlZm9yZSB3b24ndCBsb2FkYCxcclxuICAgIGNvbmZpZ05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyBjb25maWcgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXHJcbiAgICBjb25maXJtU3RyaW5nc05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBVc2UgZGlhbG9nIGhhcyBiZWVuIHNlbGVjdGVkIGJ1dCBubyBjb25maXJtIHN0cmluZ3MgaGF2ZSBiZWVuIHBhc3NlZC5gLFxyXG4gICAgZm9ybUlzSW52YWxpZDogYCR7cHJvamVjdE5hbWV9IHRoaW5rcyB0aGUgZm9ybSBpcyBpbnZhbGlkIGFuZCB0aGVyZWZvcmUgd29uJ3QgbG9hZGAsXHJcbiAgICBnZW5lcmljOiBgJHtwcm9qZWN0TmFtZX0gaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLmAsXHJcbiAgICBwb2xsaW5nVGltZW91dDogYCR7cHJvamVjdE5hbWV9IGhhcyBiZWVuIHBvbGxpbmcgZm9yIDMwIG1pbnV0ZXMgYW5kIHdpbGwgc3RvcCBub3cuYCxcclxuICAgIHRpbWVvdXROb3RTcGVjaWZpZWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gTm8gdGltZW91dCBoYXMgYmVlbiBzcGVjaWZpZWQuYCxcclxuICAgIHRpbWVvdXRPdXRzaWRlVmFsaWRSYW5nZTogYCR7Y29uZmlnSXNJbnZhbGlkfSBUaW1lb3V0IGlzIG91dHNpZGUgb2YgdmFsaWQgcmFuZ2UuYCxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1FU1NBR0VTO1xyXG4iLCJpbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gXCIuLi90eXBlcy9JR2V0QWxvbmdDb25maWdcIjtcclxuaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuL21lc3NhZ2VzXCI7XHJcblxyXG4vKiogVmFsaWRhdGVzIHRoZSBjb25maWcgcGFzc2VkIGJ5IENSTSBmb3JtIHByb3BlcnRpZXMuICovXHJcbmNsYXNzIENvbmZpZ1ZhbGlkYXRvciB7XHJcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSB2YWxpZGF0aW9uUnVsZXM6IEFycmF5PCgpID0+IGJvb2xlYW4+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uUnVsZXMgPSBbXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnSXNEZWZpbmVkLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nU2V0dGluZ3NBcmVWYWxpZC5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJc0RlZmluZWQuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SXNWYWxpZC5iaW5kKHRoaXMpLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY29uZmlnIGlzIHZhbGlkLCBvdGhlcndpc2UgZmFsc2UuICovXHJcbiAgICBwdWJsaWMgaXNWYWxpZCgpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0aW9uUnVsZXMuZXZlcnkoKGZuOiAoKSA9PiBib29sZWFuKSA9PiBmbigpID09PSB0cnVlKTtcclxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbmZpZ0lzRGVmaW5lZCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKE1FU1NBR0VTLmNvbmZpZ05vdFNwZWNpZmllZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkaWFsb2dTZXR0aW5nc0FyZVZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5jb25maXJtRGlhbG9nID09PSB0cnVlICYmIHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy5jb25maXJtU3RyaW5nc05vdFNwZWNpZmllZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lb3V0SXNEZWZpbmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0Tm90U3BlY2lmaWVkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRpbWVvdXRJc1ZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0IDwgMSB8fCB0aGlzLmNvbmZpZy50aW1lb3V0ID49IDE4MDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0T3V0c2lkZVZhbGlkUmFuZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb25maWdWYWxpZGF0b3I7XHJcbiIsImltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL2Zvcm1cIjtcclxuaW1wb3J0IERpYWxvZyBmcm9tIFwiLi4vbm90aWZpY2F0aW9uL2RpYWxvZ1wiO1xyXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gXCIuLi9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4uL3R5cGVzL0lHZXRBbG9uZ0NvbmZpZ1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBDb25maWdWYWxpZGF0b3IgZnJvbSBcIi4vY29uZmlnVmFsaWRhdG9yXCI7XHJcblxyXG5jbGFzcyBDb25maWcge1xyXG4gICAgcHJpdmF0ZSBjb25maWc6IElHZXRBbG9uZ0NvbmZpZztcclxuICAgIHByaXZhdGUgZm9ybTogRm9ybTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IElHZXRBbG9uZ0NvbmZpZywgZm9ybTogRm9ybSkge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5wYXJzZUNvbmZpZyhjb25maWcpO1xyXG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIERlcml2ZXMgdGhlIHVzZXIgbm90aWZpY2F0aW9uLCBlaXRoZXIgYSBmb3JtIG5vdGlmaWNhdGlvbiBvciBhIGRpYWxvZywgZnJvbSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMuICovXHJcbiAgICBwdWJsaWMgZ2V0VXNlck5vdGlmaWNhdGlvbigpOiBJVXNlck5vdGlmaWNhdGlvbiB7XHJcbiAgICAgICAgY29uc3QgaXNVc2VEaWFsb2dTZWxlY3RlZCA9IHRoaXMuY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiYgdGhpcy5jb25maWcuY29uZmlybVN0cmluZ3MgIT09IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCB1c2VyTm90aWZpY2F0aW9uID0gaXNVc2VEaWFsb2dTZWxlY3RlZCA/IHRoaXMuZ2V0RGlhbG9nKCkgOiB0aGlzLmdldE5vdGlmaWNhdGlvbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdXNlck5vdGlmaWNhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMgaXMgdmFsaWQgZm9yIHVzZSwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xyXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gbmV3IENvbmZpZ1ZhbGlkYXRvcih0aGlzLmNvbmZpZyk7XHJcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRvci5pc1ZhbGlkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Tm90aWZpY2F0aW9uKCk6IE5vdGlmaWNhdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcy5mb3JtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldERpYWxvZygpOiBEaWFsb2cge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGlhbG9nKHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzISwgdGhpcy5mb3JtLmZvcm1Db250ZXh0LCB0aGlzLmZvcm0ubWV0YWRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDb25maWcoY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBJR2V0QWxvbmdDb25maWcge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiBjb25maWcsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbmZpZztcclxuIiwiaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuLi9jb25maWcvbWVzc2FnZXNcIjtcclxuXHJcbi8qKiBIYW5kbGVzIGZ1bmN0aW9uIGNhbGxzIGF0IGEgc2V0IHRpbWUgaW50ZXJ2YWwuICovXHJcbmNsYXNzIFBvbGwge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQb2xscyBhIGZ1bmN0aW9uIGV2ZXJ5IHNwZWNpZmllZCBudW1iZXIgb2Ygc2Vjb25kcyB1bnRpbCBpdCByZXR1cm5zIHRydWUgb3IgdGltZW91dCBpcyByZWFjaGVkLlxyXG4gICAgICogQHBhcmFtIGZuIGNhbGxiYWNrIFByb21pc2UgdG8gcG9sbC5cclxuICAgICAqIEBwYXJhbSB0aW1lb3V0IHNlY29uZHMgdG8gY29udGludWUgcG9sbGluZyBmb3IuXHJcbiAgICAgKiBAcGFyYW0gaW50ZXJ2YWwgc2Vjb25kcyBiZXR3ZWVuIHBvbGxpbmcgY2FsbHMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcG9sbChmbjogYW55LCB0aW1lb3V0OiBudW1iZXIsIGludGVydmFsOiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSBOdW1iZXIobmV3IERhdGUoKSkgKyAodGltZW91dCAqIDEwMDApO1xyXG5cclxuICAgICAgICBjb25zdCBjaGVja0NvbmRpdGlvbiA9IChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBmbigpO1xyXG5cclxuICAgICAgICAgICAgY2FsbGJhY2sudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChOdW1iZXIobmV3IERhdGUoKSkgPCBlbmRUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjaGVja0NvbmRpdGlvbi5iaW5kKHRoaXMpLCBpbnRlcnZhbCAqIDEwMDAsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChjb25zb2xlLmxvZyhNRVNTQUdFUy5wb2xsaW5nVGltZW91dCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoY2hlY2tDb25kaXRpb24pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2xsO1xyXG4iLCIvKiogQ29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdXNlZCBmb3IgbWFraW5nIGRhdGEgaHVtYW4tcmVhZGFibGUuICovXHJcbmNsYXNzIFByb2Nlc3NvciB7XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWRvbiBkYXRlIGFzIGEgcmVhZGFibGUsIHVzZXIgbG9jYWxlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgXCJtb2RpZmllZG9uXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkRhdGUgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRvbilcclxuICAgICAgICAgICAgPyBgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0RhdGVTdHJpbmcoKX0sYCArXHJcbiAgICAgICAgICAgIGAgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1gXHJcbiAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRPblRpbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uRGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWQgYnkgdXNlcidzIGZ1bGwgbmFtZS5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgZXhwYW5kZWQgXCJtb2RpZmllZGJ5LmZ1bGxuYW1lXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRCeVVzZXIgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZGJ5LmZ1bGxuYW1lKVxyXG4gICAgICAgICAgICA/IGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcclxuICAgICAgICAgICAgOiB0aGlzLmRlZmF1bHRNb2RpZmllZEJ5VXNlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkQnlVc2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRNb2RpZmllZEJ5VXNlciA9IFwiYW5vdGhlciB1c2VyXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRPblRpbWUgPSBcInRoZSBzYW1lIHRpbWVcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvY2Vzc29yO1xyXG4iLCIvKiogSW50ZXJhY3RzIGRpcmVjdGx5IHdpdGggdGhlIFhybSBXZWIgQVBJLiAqL1xyXG5jbGFzcyBRdWVyeSB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGxzIENSTSBBUEkgYW5kIHJldHVybnMgdGhlIGdpdmVuIGVudGl0eSdzIG1vZGlmaWVkIG9uIGRhdGUuXHJcbiAgICAgKiBAcGFyYW0gZW50aXR5TmFtZSBzY2hlbWEgbmFtZSBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxyXG4gICAgICogQHBhcmFtIGVudGl0eUlkIGlkIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0TGF0ZXN0TW9kaWZpZWRPbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBlbnRpdHlOYW1lPzogc3RyaW5nLCBlbnRpdHlJZD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSB0aGlzLmVudGl0eU5hbWUgfHwgZW50aXR5TmFtZSB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKHRoaXMuZW50aXR5TmFtZSwgdGhpcy5lbnRpdHlJZCxcclxuICAgICAgICAgICAgXCI/JHNlbGVjdD1tb2RpZmllZG9uJiRleHBhbmQ9bW9kaWZpZWRieSgkc2VsZWN0PWZ1bGxuYW1lKVwiKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5TmFtZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBRdWVyeTtcclxuIiwiaW1wb3J0IFByb2Nlc3NvciBmcm9tIFwiLi4vZGF0YS9wcm9jZXNzb3JcIjtcclxuaW1wb3J0IFF1ZXJ5IGZyb20gXCIuLi9kYXRhL3F1ZXJ5XCI7XHJcblxyXG4vKiogRGF0YSBvZiB0aGUgcmVjb3JkIGluIENSTS4gKi9cclxuY2xhc3MgRGF0YSB7XHJcbiAgICBwdWJsaWMgaW5pdGlhbE1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRPbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGxhdGVzdE1vZGlmaWVkQnk6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcclxuICAgICAgICB0aGlzLmFkZFJlc2V0T25TYXZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBc3luY2hyb25vdXNseSBpbml0aWFsaXNlcyBkYXRhLCBjYWNoaW5nIGluaXRpYWwgbW9kaWZpZWQgb24uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBpbml0KCkge1xyXG4gICAgICAgIGNvbnN0IGFwaVJlc3BvbnNlID0gYXdhaXQgUXVlcnkuZ2V0TGF0ZXN0TW9kaWZpZWRPbih0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICB0aGlzLmNhY2hlQXBpUmVzcG9uc2UoYXBpUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gYXBpUmVzcG9uc2UubW9kaWZpZWRvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgbW9kaWZpZWQgb24gZnJvbSBDUk0gc2VydmVyLiBSZXR1cm5zIHRydWUgaWYgaXQgaGFzIGNoYW5nZWQsIGFuZCBub3RpZmllcyB0aGUgdXNlci5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZChub3RpZmljYXRpb25DYWxsYmFjazogKCkgPT4gdm9pZCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pbml0aWFsTW9kaWZpZWRPbikge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xyXG5cclxuICAgICAgICBjb25zdCBtb2RpZmllZE9uSGFzQ2hhbmdlZCA9IGFwaVJlc3BvbnNlLm1vZGlmaWVkb24gJiZcclxuICAgICAgICAgICAgKG5ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pID4gbmV3IERhdGUodGhpcy5pbml0aWFsTW9kaWZpZWRPbiEpKVxyXG4gICAgICAgICAgICA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25IYXNDaGFuZ2VkICYmIG5vdGlmaWNhdGlvbkNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbkNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkhhc0NoYW5nZWQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzZXRzIG1vZGlmaWVkIG9uIGNhY2hlIHdoZW4gZm9ybSBpcyBzYXZlZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRSZXNldE9uU2F2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmFkZE9uU2F2ZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWNoZUFwaVJlc3BvbnNlKGFwaVJlc3BvbnNlOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxhdGVzdE1vZGlmaWVkQnkgPSBQcm9jZXNzb3IucHJvY2Vzc01vZGlmaWVkQnlVc2VyKGFwaVJlc3BvbnNlKTtcclxuICAgICAgICB0aGlzLmxhdGVzdE1vZGlmaWVkT24gPSBQcm9jZXNzb3IucHJvY2Vzc01vZGlmaWVkT25EYXRlKGFwaVJlc3BvbnNlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0YTtcclxuIiwiLyoqIFJlY29yZCBtZXRhZGF0YSB1c2VkIHRvIHF1ZXJ5IHRoZSBDUk0gQVBJLiAqL1xyXG5jbGFzcyBNZXRhZGF0YSB7XHJcbiAgICBwdWJsaWMgZW50aXR5SWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXR5TmFtZSA9IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByZXZlbnRzIGZvcm0gYXR0cmlidXRlcyBmcm9tIGJlaW5nIHN1Ym1pdHRlZCB3aGVuIHRoZSByZWNvcmQgaXMgc2F2ZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcmV2ZW50U2F2ZShmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgYXR0cmlidXRlLnNldFN1Ym1pdE1vZGUoXCJuZXZlclwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWV0YWRhdGE7XHJcbiIsImltcG9ydCBEYXRhIGZyb20gXCIuL2RhdGFcIjtcclxuaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuL21ldGFkYXRhXCI7XHJcblxyXG4vKiogQSBmb3JtIGluIER5bmFtaWNzIDM2NSBDRS4gKi9cclxuY2xhc3MgRm9ybSB7XHJcbiAgICBwdWJsaWMgZGF0YTogRGF0YTtcclxuICAgIHB1YmxpYyBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xyXG4gICAgcHVibGljIG1ldGFkYXRhOiBNZXRhZGF0YTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZXhlY3V0aW9uQ29udGV4dC5nZXRGb3JtQ29udGV4dCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBuZXcgTWV0YWRhdGEodGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBc3luY3Jvbm91c2x5IGluaXRpYWxpc2VzIGZvcm0gZGF0YS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbG9hZHMgdGhlIGZvcm0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWxvYWQoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5SWQgPSB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCk7XHJcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IHRoaXMuZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0RW50aXR5TmFtZSgpO1xyXG5cclxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuRm9ybSh7IGVudGl0eUlkLCBlbnRpdHlOYW1lIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBmb3JtIHR5cGUgaXMgbm90IGNyZWF0ZSBvciB1bmRlZmluZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGZvcm1UeXBlOiBYcm1FbnVtLkZvcm1UeXBlID0gdGhpcy5mb3JtQ29udGV4dC51aS5nZXRGb3JtVHlwZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9ybVR5cGUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRm9ybTtcclxuIiwiaW1wb3J0IENvbmZpZyBmcm9tIFwiLi9jb25maWcvY29uZmlnXCI7XHJcbmltcG9ydCBNRVNTQUdFUyBmcm9tIFwiLi9jb25maWcvbWVzc2FnZXNcIjtcclxuaW1wb3J0IFBvbGwgZnJvbSBcIi4vZGF0YS9wb2xsXCI7XHJcbmltcG9ydCBGb3JtIGZyb20gXCIuL2Zvcm0vZm9ybVwiO1xyXG5pbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gXCIuL3R5cGVzL0lHZXRBbG9uZ0NvbmZpZ1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4vdHlwZXMvSVVzZXJOb3RpZmljYXRpb25cIjtcclxuXHJcbi8qKlxyXG4gKiBOb3RpZmllcyB1c2VycyB3aGVuIGEgcmVjb3JkIHRoZXkncmUgdmlld2luZyBpcyBtb2RpZmllZCBlbHNld2hlcmUuXHJcbiAqL1xyXG5jbGFzcyBHZXRBbG9uZyB7XHJcbiAgICAvKiogQ2hlY2tzIGZvciBjb25mbGljdHMgYW5kIG5vdGlmaWVzIHRoZSB1c2VyIGlmIGFueSBhcmUgZm91bmQuICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGNoZWNrRm9yQ29uZmxpY3RzKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzZnVsSW5pdDogYm9vbGVhbiA9IGF3YWl0IEdldEFsb25nLmluaXQoZXhlY3V0aW9uQ29udGV4dCwgY29uZmlnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc3VjY2Vzc2Z1bEluaXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgR2V0QWxvbmcuZm9ybS5kYXRhLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZChHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uLm9wZW4uYmluZChHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uKSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGAke01FU1NBR0VTLmdlbmVyaWN9ICR7ZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb2xscyBmb3IgY29uZmxpY3RzIGFuZCBub3RpZmllcyB0aGUgdXNlciBpZiBhbnkgYXJlIGZvdW5kLlxyXG4gICAgICogQHBhcmFtIGV4ZWN1dGlvbkNvbnRleHQgcGFzc2VkIGJ5IGRlZmF1bHQgZnJvbSBEeW5hbWljcyBDUk0gZm9ybS5cclxuICAgICAqIEBwYXJhbSB0aW1lb3V0IGR1cmF0aW9uIGluIHNlY29uZHMgdG8gdGltZW91dCBiZXR3ZWVuIHBvbGwgb3BlcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsRm9yQ29uZmxpY3RzKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzZnVsSW5pdDogYm9vbGVhbiA9IGF3YWl0IEdldEFsb25nLmluaXQoZXhlY3V0aW9uQ29udGV4dCwgY29uZmlnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc3VjY2Vzc2Z1bEluaXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgUG9sbC5wb2xsKCgpID0+IHRoaXMuZm9ybS5kYXRhLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZChHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uLm9wZW4uYmluZChHZXRBbG9uZy51c2VyTm90aWZpY2F0aW9uKSksIDE4MDAgLyBjb25maWcudGltZW91dCwgY29uZmlnLnRpbWVvdXQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHtNRVNTQUdFUy5nZW5lcmljfSAke2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbmZpZzogQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZm9ybTogRm9ybTtcclxuICAgIHByaXZhdGUgc3RhdGljIHVzZXJOb3RpZmljYXRpb246IElVc2VyTm90aWZpY2F0aW9uO1xyXG5cclxuICAgIC8qKiBJbml0aWFsaXNlcyBHZXQgQWxvbmcuIFJldHVybnMgdHJ1ZSBpZiBzdWNjZXNzZnVsLCBvdGhlcndpc2UgZmFsc2UuICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBpbml0KGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBHZXRBbG9uZy5mb3JtID0gR2V0QWxvbmcuZm9ybSB8fCBuZXcgRm9ybShleGVjdXRpb25Db250ZXh0KTtcclxuICAgICAgICBhd2FpdCBHZXRBbG9uZy5mb3JtLmluaXQoKTtcclxuXHJcbiAgICAgICAgaWYgKCFHZXRBbG9uZy5mb3JtLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNRVNTQUdFUy5mb3JtSXNJbnZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEdldEFsb25nLmNvbmZpZyA9IEdldEFsb25nLmNvbmZpZyB8fCBuZXcgQ29uZmlnKGNvbmZpZywgR2V0QWxvbmcuZm9ybSk7XHJcblxyXG4gICAgICAgIGlmICghR2V0QWxvbmcuY29uZmlnLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNRVNTQUdFUy5jb25maWdJc0ludmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbiA9IEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24gfHwgR2V0QWxvbmcuY29uZmlnLmdldFVzZXJOb3RpZmljYXRpb24oKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2V0QWxvbmc7XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUE7SUFDQTtRQVFJLGtCQUFZLGNBQStCO1lBUDNCLGtCQUFhLEdBQVcsR0FBRyxDQUFDO1lBQzVCLGlCQUFZLEdBQVcsR0FBRyxDQUFDO1lBQzNCLDhCQUF5QixHQUFXLFNBQVMsQ0FBQztZQUM5Qyw2QkFBd0IsR0FBVyxPQUFPLENBQUM7WUFLdkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7U0FDeEM7UUFFTSxnREFBNkIsR0FBcEM7WUFDSSxJQUFNLDBCQUEwQixHQUFrQztnQkFDOUQsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QjtnQkFDaEQsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjtnQkFDbEQsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUTtnQkFDdEMsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSTtnQkFDOUIsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSzthQUNuQyxDQUFDO1lBRUYsT0FBTywwQkFBMEIsQ0FBQztTQUNyQztRQUNMLGVBQUM7SUFBRCxDQUFDLElBQUE7O0lDckJEO0lBQ0E7UUFPSSxnQkFBWSxjQUErQixFQUFFLFdBQTRCLEVBQUUsUUFBa0I7WUFOdEYsV0FBTSxHQUFZLEtBQUssQ0FBQztZQU8zQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksUUFBUSxDQUFD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
