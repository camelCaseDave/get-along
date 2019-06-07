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

    /**
     * Notifies users when a record they're viewing is modified elsewhere.
     */
    var GetAlong = /** @class */ (function () {
        function GetAlong() {
        }
        /** Checks for conflicts and notifies the user if any are found. */
        GetAlong.checkForConflicts = function (executionContext, config) {
            return __awaiter(this, void 0, Promise, function () {
                var successfulInit;
                return __generator(this, function (_a) {
                    try {
                        successfulInit = GetAlong.init(executionContext, config);
                        if (!successfulInit) {
                            return [2 /*return*/];
                        }
                        GetAlong.form.data.checkIfModifiedOnHasChanged(GetAlong.userNotification.open.bind(GetAlong.userNotification));
                    }
                    catch (e) {
                        console.error(MESSAGES.generic + " " + e);
                    }
                    return [2 /*return*/];
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
                var successfulInit, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            successfulInit = GetAlong.init(executionContext, config);
                            if (!successfulInit) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.form.data.getModifiedOn()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, Poll.poll(function () { return _this.form.data.checkIfModifiedOnHasChanged(GetAlong.userNotification.open.bind(GetAlong.userNotification)); }, 1800 / config.timeout, config.timeout)];
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
        /** Initialises Get Along. Returns true if successful, otherwise false. */
        GetAlong.init = function (executionContext, config) {
            GetAlong.form = GetAlong.form || new Form(executionContext);
            GetAlong.config = GetAlong.config || new Config(config, GetAlong.form);
            if (!GetAlong.form.isValid()) {
                console.log(MESSAGES.formIsInvalid);
                return false;
            }
            if (!GetAlong.config.isValid()) {
                console.log(MESSAGES.configIsInvalid);
                return false;
            }
            GetAlong.userNotification = GetAlong.userNotification || GetAlong.config.getUserNotification();
            return true;
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9ub3RpZmljYXRpb24vZGlhbG9nVWkudHMiLCIuLi9zcmMvbm90aWZpY2F0aW9uL2RpYWxvZy50cyIsIi4uL3NyYy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLnRzIiwiLi4vc3JjL2NvbmZpZy9tZXNzYWdlcy50cyIsIi4uL3NyYy9jb25maWcvY29uZmlnVmFsaWRhdG9yLnRzIiwiLi4vc3JjL2NvbmZpZy9jb25maWcudHMiLCIuLi9zcmMvZGF0YS9wb2xsLnRzIiwiLi4vc3JjL2RhdGEvcHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RhdGEvcXVlcnkudHMiLCIuLi9zcmMvZm9ybS9kYXRhLnRzIiwiLi4vc3JjL2Zvcm0vbWV0YWRhdGEudHMiLCIuLi9zcmMvZm9ybS9mb3JtLnRzIiwiLi4vc3JjL2dldEFsb25nLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5cclxuLyoqIFVpIG9mIHRoZSBmb3JtIGRpYWxvZy4gKi9cclxuY2xhc3MgRGlhbG9nVWkge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRIZWlnaHQ6IG51bWJlciA9IDIwMDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0V2lkdGg6IG51bWJlciA9IDQ1MDtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29uZmlybUJ1dHRvbkxhYmVsOiBzdHJpbmcgPSBcIlJlZnJlc2hcIjtcclxuICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q2FuY2VsQnV0dG9uTGFiZWw6IHN0cmluZyA9IFwiQ2xvc2VcIjtcclxuXHJcbiAgICBwcml2YXRlIGNvbmZpcm1TdHJpbmdzOiBJQ29uZmlybVN0cmluZ3M7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncykge1xyXG4gICAgICAgIHRoaXMuY29uZmlybVN0cmluZ3MgPSBjb25maXJtU3RyaW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29uZmlybVN0cmluZ3NXaXRoRGVmYXVsdHMoKTogWHJtLk5hdmlnYXRpb24uQ29uZmlybVN0cmluZ3Mge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzOiBYcm0uTmF2aWdhdGlvbi5Db25maXJtU3RyaW5ncyA9IHtcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENhbmNlbEJ1dHRvbkxhYmVsLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uTGFiZWw6IHRoaXMuZGVmYXVsdENvbmZpcm1CdXR0b25MYWJlbCxcclxuICAgICAgICAgICAgc3VidGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3Muc3VidGl0bGUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuY29uZmlybVN0cmluZ3MudGV4dCxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuY29uZmlybVN0cmluZ3MudGl0bGUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpcm1TdHJpbmdzV2l0aERlZmF1bHRzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dVaTtcclxuIiwiaW1wb3J0IE1ldGFkYXRhIGZyb20gXCIuLi9mb3JtL21ldGFkYXRhXCI7XHJcbmltcG9ydCBJQ29uZmlybVN0cmluZ3MgZnJvbSBcIi4uL3R5cGVzL0lDb25maXJtU3RyaW5nc1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBEaWFsb2dVaSBmcm9tIFwiLi9kaWFsb2dVaVwiO1xyXG5cclxuLyoqIENvbmZpcm0gZGlhbG9nIG5vdGlmeWluZyB1c2VyIG9mIGEgZm9ybSBjb25mbGljdC4gKi9cclxuY2xhc3MgRGlhbG9nIGltcGxlbWVudHMgSVVzZXJOb3RpZmljYXRpb24ge1xyXG4gICAgcHVibGljIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuICAgIHByaXZhdGUgbWV0YWRhdGE6IE1ldGFkYXRhO1xyXG4gICAgcHJpdmF0ZSB1aTogRGlhbG9nVWk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlybVN0cmluZ3M6IElDb25maXJtU3RyaW5ncywgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCwgbWV0YWRhdGE6IE1ldGFkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGZvcm1Db250ZXh0O1xyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICB0aGlzLnVpID0gbmV3IERpYWxvZ1VpKGNvbmZpcm1TdHJpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogT3BlbnMgdGhlIGRpYWxvZywgbm90aWZ5aW5nIHVzZXIgb2YgYSBjb25mbGljdC4gKi9cclxuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcGVuQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgICAgIFhybS5OYXZpZ2F0aW9uLm9wZW5Gb3JtKHsgZW50aXR5SWQ6IHRoaXMubWV0YWRhdGEuZW50aXR5SWQsIGVudGl0eU5hbWU6IHRoaXMubWV0YWRhdGEuZW50aXR5TmFtZSB9KTtcclxuICAgICAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhZGF0YS5wcmV2ZW50U2F2ZSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUNvbnRleHQudWkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbnMgYSBjb25maXJtIGRpYWxvZyB0byBub3RpZnkgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QgYW5kIHByZXZlbnQgdGhlbSBmcm9tIG1ha2luZyBmdXJ0aGVyIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb3BlbkNhbGxiYWNrKGNvbmZpcm1DYWxsYmFjazogKCkgPT4gdm9pZCwgY2FuY2VsQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb25maXJtT3B0aW9ucyA9IHsgaGVpZ2h0OiB0aGlzLnVpLmRlZmF1bHRIZWlnaHQsIHdpZHRoOiB0aGlzLnVpLmRlZmF1bHRXaWR0aCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbmZpcm1TdHJpbmdzID0gdGhpcy51aS5nZXRDb25maXJtU3RyaW5nc1dpdGhEZWZhdWx0cygpO1xyXG5cclxuICAgICAgICBYcm0uTmF2aWdhdGlvbi5vcGVuQ29uZmlybURpYWxvZyhjb25maXJtU3RyaW5ncywgY29uZmlybU9wdGlvbnMpLnRoZW4oKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MuY29uZmlybWVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maXJtQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nO1xyXG4iLCJpbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL2Zvcm1cIjtcclxuaW1wb3J0IERhdGEgZnJvbSBcIi4uL2Zvcm0vZGF0YVwiO1xyXG5cclxuLyoqIEZvcm0gbm90aWZpY2F0aW9uIGJhbm5lciBub3RpZnlpbmcgdXNlciBvZiBhIGZvcm0gY29uZmxpY3QuICovXHJcbmNsYXNzIE5vdGlmaWNhdGlvbiBpbXBsZW1lbnRzIElVc2VyTm90aWZpY2F0aW9uIHtcclxuICAgIHB1YmxpYyBpc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIGRhdGE6IERhdGE7XHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybTogRm9ybSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGZvcm0uZGF0YTtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybS5mb3JtQ29udGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogT3BlbnMgdGhlIG5vdGlmaWNhdGlvbiwgbm90aWZ5aW5nIHVzZXIgb2YgYSBjb25mbGljdC4gKi9cclxuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldE5vdGlmaWNhdGlvblRleHQoKSxcclxuICAgICAgICAgICAgICAgIFwiSU5GT1wiLFxyXG4gICAgICAgICAgICAgICAgXCJHZXRBbG9uZ05vdGlmaWNhdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXROb3RpZmljYXRpb25UZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGBUaGlzIGZvcm0gaGFzIGJlZW4gbW9kaWZpZWQgYnkgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRCeX0gYXQgJHt0aGlzLmRhdGEubGF0ZXN0TW9kaWZpZWRPbn0uIFJlZnJlc2ggdGhlIGZvcm0gdG8gc2VlIGxhdGVzdCBjaGFuZ2VzLmA7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5vdGlmaWNhdGlvbjtcclxuIiwiY29uc3QgcHJvamVjdE5hbWUgPSBcImdldGFsb25nLmpzXCI7XHJcbmNvbnN0IGNvbmZpZ0lzSW52YWxpZCA9IGAke3Byb2plY3ROYW1lfSBjb25maWcgaXMgaW52YWxpZC5gO1xyXG5cclxuY29uc3QgTUVTU0FHRVMgPSB7XHJcbiAgICBjb25maWdJc0ludmFsaWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gYW5kIHRoZXJlZm9yZSB3b24ndCBsb2FkYCxcclxuICAgIGNvbmZpZ05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBObyBjb25maWcgaGFzIGJlZW4gc3BlY2lmaWVkLmAsXHJcbiAgICBjb25maXJtU3RyaW5nc05vdFNwZWNpZmllZDogYCR7Y29uZmlnSXNJbnZhbGlkfSBVc2UgZGlhbG9nIGhhcyBiZWVuIHNlbGVjdGVkIGJ1dCBubyBjb25maXJtIHN0cmluZ3MgaGF2ZSBiZWVuIHBhc3NlZC5gLFxyXG4gICAgZm9ybUlzSW52YWxpZDogYCR7cHJvamVjdE5hbWV9IHRoaW5rcyB0aGUgZm9ybSBpcyBpbnZhbGlkIGFuZCB0aGVyZWZvcmUgd29uJ3QgbG9hZGAsXHJcbiAgICBnZW5lcmljOiBgJHtwcm9qZWN0TmFtZX0gaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLmAsXHJcbiAgICBwb2xsaW5nVGltZW91dDogYCR7cHJvamVjdE5hbWV9IGhhcyBiZWVuIHBvbGxpbmcgZm9yIDMwIG1pbnV0ZXMgYW5kIHdpbGwgc3RvcCBub3cuYCxcclxuICAgIHRpbWVvdXROb3RTcGVjaWZpZWQ6IGAke2NvbmZpZ0lzSW52YWxpZH0gTm8gdGltZW91dCBoYXMgYmVlbiBzcGVjaWZpZWQuYCxcclxuICAgIHRpbWVvdXRPdXRzaWRlVmFsaWRSYW5nZTogYCR7Y29uZmlnSXNJbnZhbGlkfSBUaW1lb3V0IGlzIG91dHNpZGUgb2YgdmFsaWQgcmFuZ2UuYCxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1FU1NBR0VTO1xyXG4iLCJpbXBvcnQgSUdldEFsb25nQ29uZmlnIGZyb20gXCIuLi90eXBlcy9JR2V0QWxvbmdDb25maWdcIjtcclxuaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuL21lc3NhZ2VzXCI7XHJcblxyXG4vKiogVmFsaWRhdGVzIHRoZSBjb25maWcgcGFzc2VkIGJ5IENSTSBmb3JtIHByb3BlcnRpZXMuICovXHJcbmNsYXNzIENvbmZpZ1ZhbGlkYXRvciB7XHJcbiAgICBwcml2YXRlIGNvbmZpZzogSUdldEFsb25nQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSB2YWxpZGF0aW9uUnVsZXM6IEFycmF5PCgpID0+IGJvb2xlYW4+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUdldEFsb25nQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uUnVsZXMgPSBbXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnSXNEZWZpbmVkLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nU2V0dGluZ3NBcmVWYWxpZC5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJc0RlZmluZWQuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SXNWYWxpZC5iaW5kKHRoaXMpLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY29uZmlnIGlzIHZhbGlkLCBvdGhlcndpc2UgZmFsc2UuICovXHJcbiAgICBwdWJsaWMgaXNWYWxpZCgpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0aW9uUnVsZXMuZXZlcnkoKGZuOiAoKSA9PiBib29sZWFuKSA9PiBmbigpID09PSB0cnVlKTtcclxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbmZpZ0lzRGVmaW5lZCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKE1FU1NBR0VTLmNvbmZpZ05vdFNwZWNpZmllZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkaWFsb2dTZXR0aW5nc0FyZVZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5jb25maXJtRGlhbG9nID09PSB0cnVlICYmIHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy5jb25maXJtU3RyaW5nc05vdFNwZWNpZmllZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lb3V0SXNEZWZpbmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0Tm90U3BlY2lmaWVkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRpbWVvdXRJc1ZhbGlkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy50aW1lb3V0IDwgMSB8fCB0aGlzLmNvbmZpZy50aW1lb3V0ID49IDE4MDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihNRVNTQUdFUy50aW1lb3V0T3V0c2lkZVZhbGlkUmFuZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb25maWdWYWxpZGF0b3I7XHJcbiIsImltcG9ydCBGb3JtIGZyb20gXCIuLi9mb3JtL2Zvcm1cIjtcclxuaW1wb3J0IERpYWxvZyBmcm9tIFwiLi4vbm90aWZpY2F0aW9uL2RpYWxvZ1wiO1xyXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gXCIuLi9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4uL3R5cGVzL0lHZXRBbG9uZ0NvbmZpZ1wiO1xyXG5pbXBvcnQgSVVzZXJOb3RpZmljYXRpb24gZnJvbSBcIi4uL3R5cGVzL0lVc2VyTm90aWZpY2F0aW9uXCI7XHJcbmltcG9ydCBDb25maWdWYWxpZGF0b3IgZnJvbSBcIi4vY29uZmlnVmFsaWRhdG9yXCI7XHJcblxyXG5jbGFzcyBDb25maWcge1xyXG4gICAgcHJpdmF0ZSBjb25maWc6IElHZXRBbG9uZ0NvbmZpZztcclxuICAgIHByaXZhdGUgZm9ybTogRm9ybTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IElHZXRBbG9uZ0NvbmZpZywgZm9ybTogRm9ybSkge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5wYXJzZUNvbmZpZyhjb25maWcpO1xyXG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIERlcml2ZXMgdGhlIHVzZXIgbm90aWZpY2F0aW9uLCBlaXRoZXIgYSBmb3JtIG5vdGlmaWNhdGlvbiBvciBhIGRpYWxvZywgZnJvbSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMuICovXHJcbiAgICBwdWJsaWMgZ2V0VXNlck5vdGlmaWNhdGlvbigpOiBJVXNlck5vdGlmaWNhdGlvbiB7XHJcbiAgICAgICAgY29uc3QgaXNVc2VEaWFsb2dTZWxlY3RlZCA9IHRoaXMuY29uZmlnLmNvbmZpcm1EaWFsb2cgPT09IHRydWUgJiYgdGhpcy5jb25maWcuY29uZmlybVN0cmluZ3MgIT09IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCB1c2VyTm90aWZpY2F0aW9uID0gaXNVc2VEaWFsb2dTZWxlY3RlZCA/IHRoaXMuZ2V0RGlhbG9nKCkgOiB0aGlzLmdldE5vdGlmaWNhdGlvbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdXNlck5vdGlmaWNhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBjb25maWcgcGFzc2VkIGZyb20gdGhlIENSTSBmb3JtIHByb3BlcnRpZXMgaXMgdmFsaWQgZm9yIHVzZSwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xyXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gbmV3IENvbmZpZ1ZhbGlkYXRvcih0aGlzLmNvbmZpZyk7XHJcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRvci5pc1ZhbGlkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Tm90aWZpY2F0aW9uKCk6IE5vdGlmaWNhdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcy5mb3JtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldERpYWxvZygpOiBEaWFsb2cge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGlhbG9nKHRoaXMuY29uZmlnLmNvbmZpcm1TdHJpbmdzISwgdGhpcy5mb3JtLmZvcm1Db250ZXh0LCB0aGlzLmZvcm0ubWV0YWRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDb25maWcoY29uZmlnOiBJR2V0QWxvbmdDb25maWcpOiBJR2V0QWxvbmdDb25maWcge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiBjb25maWcsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbmZpZztcclxuIiwiaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuLi9jb25maWcvbWVzc2FnZXNcIjtcclxuXHJcbi8qKiBIYW5kbGVzIGZ1bmN0aW9uIGNhbGxzIGF0IGEgc2V0IHRpbWUgaW50ZXJ2YWwuICovXHJcbmNsYXNzIFBvbGwge1xyXG4gICAgLyoqXHJcbiAgICAgKiBQb2xscyBhIGZ1bmN0aW9uIGV2ZXJ5IHNwZWNpZmllZCBudW1iZXIgb2Ygc2Vjb25kcyB1bnRpbCBpdCByZXR1cm5zIHRydWUgb3IgdGltZW91dCBpcyByZWFjaGVkLlxyXG4gICAgICogQHBhcmFtIGZuIGNhbGxiYWNrIFByb21pc2UgdG8gcG9sbC5cclxuICAgICAqIEBwYXJhbSB0aW1lb3V0IHNlY29uZHMgdG8gY29udGludWUgcG9sbGluZyBmb3IuXHJcbiAgICAgKiBAcGFyYW0gaW50ZXJ2YWwgc2Vjb25kcyBiZXR3ZWVuIHBvbGxpbmcgY2FsbHMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcG9sbChmbjogYW55LCB0aW1lb3V0OiBudW1iZXIsIGludGVydmFsOiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSBOdW1iZXIobmV3IERhdGUoKSkgKyAodGltZW91dCAqIDEwMDApO1xyXG5cclxuICAgICAgICBjb25zdCBjaGVja0NvbmRpdGlvbiA9IChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBmbigpO1xyXG5cclxuICAgICAgICAgICAgY2FsbGJhY2sudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChOdW1iZXIobmV3IERhdGUoKSkgPCBlbmRUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjaGVja0NvbmRpdGlvbi5iaW5kKHRoaXMpLCBpbnRlcnZhbCAqIDEwMDAsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChjb25zb2xlLmxvZyhNRVNTQUdFUy5wb2xsaW5nVGltZW91dCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoY2hlY2tDb25kaXRpb24pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2xsO1xyXG4iLCIvKiogQ29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdXNlZCBmb3IgbWFraW5nIGRhdGEgaHVtYW4tcmVhZGFibGUuICovXHJcbmNsYXNzIFByb2Nlc3NvciB7XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWRvbiBkYXRlIGFzIGEgcmVhZGFibGUsIHVzZXIgbG9jYWxlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgXCJtb2RpZmllZG9uXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkRhdGUgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRvbilcclxuICAgICAgICAgICAgPyBgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0RhdGVTdHJpbmcoKX0sYCArXHJcbiAgICAgICAgICAgIGAgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1gXHJcbiAgICAgICAgICAgIDogdGhpcy5kZWZhdWx0TW9kaWZpZWRPblRpbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uRGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWQgYnkgdXNlcidzIGZ1bGwgbmFtZS5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgZXhwYW5kZWQgXCJtb2RpZmllZGJ5LmZ1bGxuYW1lXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRCeVVzZXIgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZGJ5LmZ1bGxuYW1lKVxyXG4gICAgICAgICAgICA/IGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcclxuICAgICAgICAgICAgOiB0aGlzLmRlZmF1bHRNb2RpZmllZEJ5VXNlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkQnlVc2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGRlZmF1bHRNb2RpZmllZEJ5VXNlciA9IFwiYW5vdGhlciB1c2VyXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBkZWZhdWx0TW9kaWZpZWRPblRpbWUgPSBcInRoZSBzYW1lIHRpbWVcIjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvY2Vzc29yO1xyXG4iLCIvKiogSW50ZXJhY3RzIGRpcmVjdGx5IHdpdGggdGhlIFhybSBXZWIgQVBJLiAqL1xyXG5jbGFzcyBRdWVyeSB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGxzIENSTSBBUEkgYW5kIHJldHVybnMgdGhlIGdpdmVuIGVudGl0eSdzIG1vZGlmaWVkIG9uIGRhdGUuXHJcbiAgICAgKiBAcGFyYW0gZW50aXR5TmFtZSBzY2hlbWEgbmFtZSBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxyXG4gICAgICogQHBhcmFtIGVudGl0eUlkIGlkIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0TGF0ZXN0TW9kaWZpZWRPbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBlbnRpdHlOYW1lPzogc3RyaW5nLCBlbnRpdHlJZD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSB0aGlzLmVudGl0eU5hbWUgfHwgZW50aXR5TmFtZSB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKHRoaXMuZW50aXR5TmFtZSwgdGhpcy5lbnRpdHlJZCxcclxuICAgICAgICAgICAgXCI/JHNlbGVjdD1tb2RpZmllZG9uJiRleHBhbmQ9bW9kaWZpZWRieSgkc2VsZWN0PWZ1bGxuYW1lKVwiKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5TmFtZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBRdWVyeTtcclxuIiwiaW1wb3J0IFByb2Nlc3NvciBmcm9tIFwiLi4vZGF0YS9wcm9jZXNzb3JcIjtcclxuaW1wb3J0IFF1ZXJ5IGZyb20gXCIuLi9kYXRhL3F1ZXJ5XCI7XHJcblxyXG4vKiogRGF0YSBvZiB0aGUgcmVjb3JkIGluIENSTS4gKi9cclxuY2xhc3MgRGF0YSB7XHJcbiAgICBwdWJsaWMgaW5pdGlhbE1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRPbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGxhdGVzdE1vZGlmaWVkQnk6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcclxuICAgICAgICB0aGlzLmFkZFJlc2V0T25TYXZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBmb3JtIG1vZGlmaWVkIG9uIGRhdGUuIENhbGxzIENSTSBBUEkgaWYgbW9kaWZpZWQgb24gYXR0cmlidXRlIGlzIG5vdCBvbiB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGdldE1vZGlmaWVkT24oKTogUHJvbWlzZTxEYXRlIHwgdW5kZWZpbmVkPiB7XHJcbiAgICAgICAgbGV0IG1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkF0dHJpYnV0ZTogWHJtLkF0dHJpYnV0ZXMuRGF0ZUF0dHJpYnV0ZSA9IHRoaXMuZm9ybUNvbnRleHQuZ2V0QXR0cmlidXRlKFwibW9kaWZpZWRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25BdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgbW9kaWZpZWRPbiA9IG1vZGlmaWVkT25BdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcGlSZXNwb25zZSA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24odGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICAgICAgICAgIG1vZGlmaWVkT24gPSBhcGlSZXNwb25zZS5tb2RpZmllZG9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IG1vZGlmaWVkT247XHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIG1vZGlmaWVkIG9uIGZyb20gQ1JNIHNlcnZlci4gUmV0dXJucyB0cnVlIGlmIGl0IGhhcyBjaGFuZ2VkLCBhbmQgbm90aWZpZXMgdGhlIHVzZXIuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQobm90aWZpY2F0aW9uQ2FsbGJhY2s6ICgpID0+IHZvaWQpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdGhpcy5pbml0aWFsTW9kaWZpZWRPbiB8fCBhd2FpdCB0aGlzLmdldE1vZGlmaWVkT24oKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuY2FjaGVBcGlSZXNwb25zZShhcGlSZXNwb25zZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25IYXNDaGFuZ2VkID0gYXBpUmVzcG9uc2UubW9kaWZpZWRvbiAmJlxyXG4gICAgICAgICAgICAobmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikgPiBuZXcgRGF0ZSh0aGlzLmluaXRpYWxNb2RpZmllZE9uISkpXHJcbiAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAobW9kaWZpZWRPbkhhc0NoYW5nZWQgJiYgbm90aWZpY2F0aW9uQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uSGFzQ2hhbmdlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0cyBtb2RpZmllZCBvbiBjYWNoZSB3aGVuIGZvcm0gaXMgc2F2ZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkUmVzZXRPblNhdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hZGRPblNhdmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FjaGVBcGlSZXNwb25zZShhcGlSZXNwb25zZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZEJ5ID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk7XHJcbiAgICAgICAgdGhpcy5sYXRlc3RNb2RpZmllZE9uID0gUHJvY2Vzc29yLnByb2Nlc3NNb2RpZmllZE9uRGF0ZShhcGlSZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGE7XHJcbiIsIi8qKiBSZWNvcmQgbWV0YWRhdGEgdXNlZCB0byBxdWVyeSB0aGUgQ1JNIEFQSS4gKi9cclxuY2xhc3MgTWV0YWRhdGEge1xyXG4gICAgcHVibGljIGVudGl0eUlkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgZW50aXR5TmFtZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmVudGl0eUlkID0gZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcmV2ZW50cyBmb3JtIGF0dHJpYnV0ZXMgZnJvbSBiZWluZyBzdWJtaXR0ZWQgd2hlbiB0aGUgcmVjb3JkIGlzIHNhdmVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJldmVudFNhdmUoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRTdWJtaXRNb2RlKFwibmV2ZXJcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1ldGFkYXRhO1xyXG4iLCJpbXBvcnQgRGF0YSBmcm9tIFwiLi9kYXRhXCI7XHJcbmltcG9ydCBNZXRhZGF0YSBmcm9tIFwiLi9tZXRhZGF0YVwiO1xyXG5cclxuLyoqIEEgZm9ybSBpbiBEeW5hbWljcyAzNjUgQ0UuICovXHJcbmNsYXNzIEZvcm0ge1xyXG4gICAgcHVibGljIGRhdGE6IERhdGE7XHJcbiAgICBwdWJsaWMgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuICAgIHB1YmxpYyBtZXRhZGF0YTogTWV0YWRhdGE7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGV4ZWN1dGlvbkNvbnRleHQuZ2V0Rm9ybUNvbnRleHQoKTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YSh0aGlzLmZvcm1Db250ZXh0KTtcclxuICAgICAgICB0aGlzLm1ldGFkYXRhID0gbmV3IE1ldGFkYXRhKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVsb2FkcyB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBlbnRpdHlJZCA9IHRoaXMuZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIFhybS5OYXZpZ2F0aW9uLm9wZW5Gb3JtKHsgZW50aXR5SWQsIGVudGl0eU5hbWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZvcm0gdHlwZSBpcyBub3QgY3JlYXRlIG9yIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgZm9ybVR5cGU6IFhybUVudW0uRm9ybVR5cGUgPSB0aGlzLmZvcm1Db250ZXh0LnVpLmdldEZvcm1UeXBlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmb3JtVHlwZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAwICYmXHJcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGb3JtO1xyXG4iLCJpbXBvcnQgQ29uZmlnIGZyb20gXCIuL2NvbmZpZy9jb25maWdcIjtcclxuaW1wb3J0IE1FU1NBR0VTIGZyb20gXCIuL2NvbmZpZy9tZXNzYWdlc1wiO1xyXG5pbXBvcnQgUG9sbCBmcm9tIFwiLi9kYXRhL3BvbGxcIjtcclxuaW1wb3J0IEZvcm0gZnJvbSBcIi4vZm9ybS9mb3JtXCI7XHJcbmltcG9ydCBJR2V0QWxvbmdDb25maWcgZnJvbSBcIi4vdHlwZXMvSUdldEFsb25nQ29uZmlnXCI7XHJcbmltcG9ydCBJVXNlck5vdGlmaWNhdGlvbiBmcm9tIFwiLi90eXBlcy9JVXNlck5vdGlmaWNhdGlvblwiO1xyXG5cclxuLyoqXHJcbiAqIE5vdGlmaWVzIHVzZXJzIHdoZW4gYSByZWNvcmQgdGhleSdyZSB2aWV3aW5nIGlzIG1vZGlmaWVkIGVsc2V3aGVyZS5cclxuICovXHJcbmNsYXNzIEdldEFsb25nIHtcclxuICAgIC8qKiBDaGVja3MgZm9yIGNvbmZsaWN0cyBhbmQgbm90aWZpZXMgdGhlIHVzZXIgaWYgYW55IGFyZSBmb3VuZC4gKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgY2hlY2tGb3JDb25mbGljdHMoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCBjb25maWc6IElHZXRBbG9uZ0NvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NmdWxJbml0OiBib29sZWFuID0gR2V0QWxvbmcuaW5pdChleGVjdXRpb25Db250ZXh0LCBjb25maWcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzdWNjZXNzZnVsSW5pdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBHZXRBbG9uZy5mb3JtLmRhdGEuY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24ub3Blbi5iaW5kKEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24pKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBvbGxzIGZvciBjb25mbGljdHMgYW5kIG5vdGlmaWVzIHRoZSB1c2VyIGlmIGFueSBhcmUgZm91bmQuXHJcbiAgICAgKiBAcGFyYW0gZXhlY3V0aW9uQ29udGV4dCBwYXNzZWQgYnkgZGVmYXVsdCBmcm9tIER5bmFtaWNzIENSTSBmb3JtLlxyXG4gICAgICogQHBhcmFtIHRpbWVvdXQgZHVyYXRpb24gaW4gc2Vjb25kcyB0byB0aW1lb3V0IGJldHdlZW4gcG9sbCBvcGVyYXRpb25zLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGxGb3JDb25mbGljdHMoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCBjb25maWc6IElHZXRBbG9uZ0NvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NmdWxJbml0OiBib29sZWFuID0gR2V0QWxvbmcuaW5pdChleGVjdXRpb25Db250ZXh0LCBjb25maWcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzdWNjZXNzZnVsSW5pdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZvcm0uZGF0YS5nZXRNb2RpZmllZE9uKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IFBvbGwucG9sbCgoKSA9PiB0aGlzLmZvcm0uZGF0YS5jaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbi5vcGVuLmJpbmQoR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbikpLCAxODAwIC8gY29uZmlnLnRpbWVvdXQsIGNvbmZpZy50aW1lb3V0KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TUVTU0FHRVMuZ2VuZXJpY30gJHtlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb25maWc6IENvbmZpZztcclxuICAgIHByaXZhdGUgc3RhdGljIGZvcm06IEZvcm07XHJcbiAgICBwcml2YXRlIHN0YXRpYyB1c2VyTm90aWZpY2F0aW9uOiBJVXNlck5vdGlmaWNhdGlvbjtcclxuXHJcbiAgICAvKiogSW5pdGlhbGlzZXMgR2V0IEFsb25nLiBSZXR1cm5zIHRydWUgaWYgc3VjY2Vzc2Z1bCwgb3RoZXJ3aXNlIGZhbHNlLiAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdChleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQsIGNvbmZpZzogSUdldEFsb25nQ29uZmlnKTogYm9vbGVhbiB7XHJcbiAgICAgICAgR2V0QWxvbmcuZm9ybSA9IEdldEFsb25nLmZvcm0gfHwgbmV3IEZvcm0oZXhlY3V0aW9uQ29udGV4dCk7XHJcbiAgICAgICAgR2V0QWxvbmcuY29uZmlnID0gR2V0QWxvbmcuY29uZmlnIHx8IG5ldyBDb25maWcoY29uZmlnLCBHZXRBbG9uZy5mb3JtKTtcclxuXHJcbiAgICAgICAgaWYgKCFHZXRBbG9uZy5mb3JtLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNRVNTQUdFUy5mb3JtSXNJbnZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghR2V0QWxvbmcuY29uZmlnLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNRVNTQUdFUy5jb25maWdJc0ludmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgR2V0QWxvbmcudXNlck5vdGlmaWNhdGlvbiA9IEdldEFsb25nLnVzZXJOb3RpZmljYXRpb24gfHwgR2V0QWxvbmcuY29uZmlnLmdldFVzZXJOb3RpZmljYXRpb24oKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2V0QWxvbmc7XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUE7SUFDQTtRQVFJLGtCQUFZLGNBQStCO1lBUDNCLGtCQUFhLEdBQVcsR0FBRyxDQUFDO1lBQzVCLGlCQUFZLEdBQVcsR0FBRyxDQUFDO1lBQzNCLDhCQUF5QixHQUFXLFNBQVMsQ0FBQztZQUM5Qyw2QkFBd0IsR0FBVyxPQUFPLENBQUM7WUFLdkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7U0FDeEM7UUFFTSxnREFBNkIsR0FBcEM7WUFDSSxJQUFNLDBCQUEwQixHQUFrQztnQkFDOUQsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QjtnQkFDaEQsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjtnQkFDbEQsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUTtnQkFDdEMsSUFBSSxFQUFFLElBQUksQ0FBQyxj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
