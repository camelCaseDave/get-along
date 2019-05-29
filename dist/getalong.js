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

    var Notify = /** @class */ (function () {
        function Notify() {
        }
        /**
         * Notifies user of a form change.
         */
        Notify.setFormNotification = function (formContext, modifiedOn, modifiedBy) {
            formContext.ui.setFormNotification("This form has been modified by " + modifiedBy + " at " + modifiedOn + ". Refresh the form to see latest changes.", "INFO", "GetAlongNotification");
        };
        return Notify;
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
                : "the same time";
            return modifiedOnDate;
        };
        /**
         * Returns modified by user's full name.
         * @param apiResponse CRM API response that includes expanded "modifiedby.fullname" column.
         */
        Processor.processModifiedByUser = function (apiResponse) {
            var modifiedByUser = (apiResponse && apiResponse.modifiedby && apiResponse.modifiedby.fullname)
                ? apiResponse.modifiedby.fullname
                : "another user";
            return modifiedByUser;
        };
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

    var Form = /** @class */ (function () {
        function Form(formContext) {
            this.formContext = formContext;
        }
        /**
         * Returns true if the form type is not create or undefined.
         */
        Form.prototype.isValidForm = function () {
            var formType = this.formContext.ui.getFormType();
            return formType !== undefined &&
                formType !== 0 &&
                formType !== 1;
        };
        /**
         * Gets the form modified on date. Calls CRM API if modified on attribute is not on the form.
         */
        Form.prototype.getFormModifiedOn = function () {
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
         * Gets modified on from CRM server and returns true if it has changed.
         */
        Form.prototype.checkIfModifiedOnHasChanged = function () {
            return __awaiter(this, void 0, Promise, function () {
                var _a, _b, apiResponse, modifiedOnHasChanged;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this;
                            _b = this.initialModifiedOn;
                            if (_b) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getFormModifiedOn()];
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
                                Notify.setFormNotification(this.formContext, this.latestModifiedOn, this.latestModifiedBy);
                            }
                            return [2 /*return*/, modifiedOnHasChanged];
                    }
                });
            });
        };
        /**
         * Resets modified on cache when form is saved.
         */
        Form.prototype.addResetOnSave = function () {
            var _this = this;
            this.formContext.data.entity.addOnSave(function () {
                _this.initialModifiedOn = undefined;
            });
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
         * Polls for modifications to the current form.
         * @param executionContext passed by default from Dynamics CRM form.
         * @param timeout duration in seconds to timeout between poll operations.
         */
        GetAlong.pollForModifications = function (executionContext, timeout) {
            return __awaiter(this, void 0, Promise, function () {
                var formContext, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            formContext = executionContext.getFormContext();
                            this.form = new Form(formContext);
                            if (!this.form.isValidForm()) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.form.getFormModifiedOn()];
                        case 1:
                            _a.sent();
                            this.form.addResetOnSave();
                            Poll.poll(function () { return _this.form.checkIfModifiedOnHasChanged(); }, 1800 / timeout, timeout);
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.error("getalong.js has encountered an error. " + e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9Ob3RpZnkudHMiLCIuLi9zcmMvUHJvY2Vzc29yLnRzIiwiLi4vc3JjL1F1ZXJ5LnRzIiwiLi4vc3JjL0Zvcm0udHMiLCIuLi9zcmMvUG9sbC50cyIsIi4uL3NyYy9HZXRBbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RpZnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBOb3RpZmllcyB1c2VyIG9mIGEgZm9ybSBjaGFuZ2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0Rm9ybU5vdGlmaWNhdGlvbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBtb2RpZmllZE9uOiBzdHJpbmcsIG1vZGlmaWVkQnk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oXHJcbiAgICAgICAgICAgIGBUaGlzIGZvcm0gaGFzIGJlZW4gbW9kaWZpZWQgYnkgJHttb2RpZmllZEJ5fSBhdCAke21vZGlmaWVkT259LiBSZWZyZXNoIHRoZSBmb3JtIHRvIHNlZSBsYXRlc3QgY2hhbmdlcy5gLFxyXG4gICAgICAgICAgICBcIklORk9cIixcclxuICAgICAgICAgICAgXCJHZXRBbG9uZ05vdGlmaWNhdGlvblwiKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9jZXNzb3Ige1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIG1vZGlmaWVkb24gZGF0ZSBhcyBhIHJlYWRhYmxlLCB1c2VyIGxvY2FsZSBzdHJpbmcuXHJcbiAgICAgKiBAcGFyYW0gYXBpUmVzcG9uc2UgQ1JNIEFQSSByZXNwb25zZSB0aGF0IGluY2x1ZGVzIFwibW9kaWZpZWRvblwiIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzTW9kaWZpZWRPbkRhdGUoYXBpUmVzcG9uc2UpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25EYXRlID0gKGFwaVJlc3BvbnNlICYmIGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pXHJcbiAgICAgICAgICAgID8gYCR7bmV3IERhdGUoYXBpUmVzcG9uc2UubW9kaWZpZWRvbikudG9EYXRlU3RyaW5nKCl9LGAgK1xyXG4gICAgICAgICAgICAgIGAgJHtuZXcgRGF0ZShhcGlSZXNwb25zZS5tb2RpZmllZG9uKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1gXHJcbiAgICAgICAgICAgIDogXCJ0aGUgc2FtZSB0aW1lXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uRGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbW9kaWZpZWQgYnkgdXNlcidzIGZ1bGwgbmFtZS5cclxuICAgICAqIEBwYXJhbSBhcGlSZXNwb25zZSBDUk0gQVBJIHJlc3BvbnNlIHRoYXQgaW5jbHVkZXMgZXhwYW5kZWQgXCJtb2RpZmllZGJ5LmZ1bGxuYW1lXCIgY29sdW1uLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3NNb2RpZmllZEJ5VXNlcihhcGlSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRCeVVzZXIgPSAoYXBpUmVzcG9uc2UgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZGJ5LmZ1bGxuYW1lKVxyXG4gICAgICAgICAgICA/IGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkuZnVsbG5hbWVcclxuICAgICAgICAgICAgOiBcImFub3RoZXIgdXNlclwiO1xyXG5cclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRCeVVzZXI7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbHMgQ1JNIEFQSSBhbmQgcmV0dXJucyB0aGUgZ2l2ZW4gZW50aXR5J3MgbW9kaWZpZWQgb24gZGF0ZS5cclxuICAgICAqIEBwYXJhbSBlbnRpdHlOYW1lIHNjaGVtYSBuYW1lIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXHJcbiAgICAgKiBAcGFyYW0gZW50aXR5SWQgaWQgb2YgdGhlIGVudGl0eSB0byBxdWVyeS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBnZXRMYXRlc3RNb2RpZmllZE9uKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQsIGVudGl0eU5hbWU/OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5SWQ/OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHRoaXMuZW50aXR5SWQgPSB0aGlzLmVudGl0eUlkIHx8IGVudGl0eUlkIHx8IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldElkKCk7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlOYW1lID0gdGhpcy5lbnRpdHlOYW1lIHx8IGVudGl0eU5hbWUgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0RW50aXR5TmFtZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gWHJtLldlYkFwaS5yZXRyaWV2ZVJlY29yZCh0aGlzLmVudGl0eU5hbWUsIHRoaXMuZW50aXR5SWQsXHJcbiAgICAgICAgICAgIFwiPyRzZWxlY3Q9bW9kaWZpZWRvbiYkZXhwYW5kPW1vZGlmaWVkYnkoJHNlbGVjdD1mdWxsbmFtZSlcIikudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5TmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCBOb3RpZnkgZnJvbSBcIi4vTm90aWZ5XCI7XHJcbmltcG9ydCBQcm9jZXNzb3IgZnJvbSBcIi4vUHJvY2Vzc29yXCI7XHJcbmltcG9ydCBRdWVyeSBmcm9tIFwiLi9RdWVyeVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ybSB7XHJcbiAgICBwdWJsaWMgZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dDtcclxuICAgIHB1YmxpYyBpbml0aWFsTW9kaWZpZWRPbjogRGF0ZSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBsYXRlc3RNb2RpZmllZE9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbGF0ZXN0TW9kaWZpZWRCeTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0ID0gZm9ybUNvbnRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZvcm0gdHlwZSBpcyBub3QgY3JlYXRlIG9yIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzVmFsaWRGb3JtKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGZvcm1UeXBlOiBYcm1FbnVtLkZvcm1UeXBlID0gdGhpcy5mb3JtQ29udGV4dC51aS5nZXRGb3JtVHlwZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9ybVR5cGUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGZvcm0gbW9kaWZpZWQgb24gZGF0ZS4gQ2FsbHMgQ1JNIEFQSSBpZiBtb2RpZmllZCBvbiBhdHRyaWJ1dGUgaXMgbm90IG9uIHRoZSBmb3JtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZ2V0Rm9ybU1vZGlmaWVkT24oKTogUHJvbWlzZTxEYXRlIHwgdW5kZWZpbmVkPiB7XHJcbiAgICAgICAgbGV0IG1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkF0dHJpYnV0ZTogWHJtLkF0dHJpYnV0ZXMuRGF0ZUF0dHJpYnV0ZSA9IHRoaXMuZm9ybUNvbnRleHQuZ2V0QXR0cmlidXRlKFwibW9kaWZpZWRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25BdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgbW9kaWZpZWRPbiA9IG1vZGlmaWVkT25BdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcGlSZXNwb25zZSA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24odGhpcy5mb3JtQ29udGV4dCk7XHJcbiAgICAgICAgICAgIG1vZGlmaWVkT24gPSBhcGlSZXNwb25zZS5tb2RpZmllZG9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IG1vZGlmaWVkT247XHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIG1vZGlmaWVkIG9uIGZyb20gQ1JNIHNlcnZlciBhbmQgcmV0dXJucyB0cnVlIGlmIGl0IGhhcyBjaGFuZ2VkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSB0aGlzLmluaXRpYWxNb2RpZmllZE9uIHx8IGF3YWl0IHRoaXMuZ2V0Rm9ybU1vZGlmaWVkT24oKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRCeSA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpO1xyXG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRPbiA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRPbkRhdGUoYXBpUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBjb25zdCBtb2RpZmllZE9uSGFzQ2hhbmdlZCA9IGFwaVJlc3BvbnNlLm1vZGlmaWVkb24gJiZcclxuICAgICAgICAgICAgKG5ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pID4gbmV3IERhdGUodGhpcy5pbml0aWFsTW9kaWZpZWRPbiEpKVxyXG4gICAgICAgICAgICA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25IYXNDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgIE5vdGlmeS5zZXRGb3JtTm90aWZpY2F0aW9uKHRoaXMuZm9ybUNvbnRleHQsIHRoaXMubGF0ZXN0TW9kaWZpZWRPbiwgdGhpcy5sYXRlc3RNb2RpZmllZEJ5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uSGFzQ2hhbmdlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0cyBtb2RpZmllZCBvbiBjYWNoZSB3aGVuIGZvcm0gaXMgc2F2ZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRSZXNldE9uU2F2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmFkZE9uU2F2ZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9sbCB7XHJcbiAgICAvKipcclxuICAgICAqIFBvbGxzIGEgZnVuY3Rpb24gZXZlcnkgc3BlY2lmaWVkIG51bWJlciBvZiBzZWNvbmRzIHVudGlsIGl0IHJldHVybnMgdHJ1ZSBvciB0aW1lb3V0IGlzIHJlYWNoZWQuXHJcbiAgICAgKiBAcGFyYW0gZm4gY2FsbGJhY2sgUHJvbWlzZSB0byBwb2xsLlxyXG4gICAgICogQHBhcmFtIHRpbWVvdXQgc2Vjb25kcyB0byBjb250aW51ZSBwb2xsaW5nIGZvci5cclxuICAgICAqIEBwYXJhbSBpbnRlcnZhbCBzZWNvbmRzIGJldHdlZW4gcG9sbGluZyBjYWxscy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsKGZuOiBhbnksIHRpbWVvdXQ6IG51bWJlciwgaW50ZXJ2YWw6IG51bWJlcik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IE51bWJlcihuZXcgRGF0ZSgpKSArICh0aW1lb3V0ICogMTAwMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNoZWNrQ29uZGl0aW9uID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGZuKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyKG5ldyBEYXRlKCkpIDwgZW5kVGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2hlY2tDb25kaXRpb24uYmluZCh0aGlzKSwgaW50ZXJ2YWwgKiAxMDAwLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoY29uc29sZS5sb2coXCJHZXRBbG9uZyBoYXMgYmVlbiBwb2xsaW5nIGZvciAzMCBtaW51dGVzIGFuZCB3aWxsIHN0b3Agbm93LlwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShjaGVja0NvbmRpdGlvbik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEZvcm0gZnJvbSBcIi4vRm9ybVwiO1xyXG5pbXBvcnQgUG9sbCBmcm9tIFwiLi9Qb2xsXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZXRBbG9uZyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb2xscyBmb3IgbW9kaWZpY2F0aW9ucyB0byB0aGUgY3VycmVudCBmb3JtLlxyXG4gICAgICogQHBhcmFtIGV4ZWN1dGlvbkNvbnRleHQgcGFzc2VkIGJ5IGRlZmF1bHQgZnJvbSBEeW5hbWljcyBDUk0gZm9ybS5cclxuICAgICAqIEBwYXJhbSB0aW1lb3V0IGR1cmF0aW9uIGluIHNlY29uZHMgdG8gdGltZW91dCBiZXR3ZWVuIHBvbGwgb3BlcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwb2xsRm9yTW9kaWZpY2F0aW9ucyhleGVjdXRpb25Db250ZXh0OiBYcm0uUGFnZS5FdmVudENvbnRleHQsIHRpbWVvdXQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1Db250ZXh0ID0gZXhlY3V0aW9uQ29udGV4dC5nZXRGb3JtQ29udGV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm0gPSBuZXcgRm9ybShmb3JtQ29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZm9ybS5pc1ZhbGlkRm9ybSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZm9ybS5nZXRGb3JtTW9kaWZpZWRPbigpO1xyXG4gICAgICAgICAgICB0aGlzLmZvcm0uYWRkUmVzZXRPblNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIFBvbGwucG9sbCgoKSA9PiB0aGlzLmZvcm0uY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKCksIDE4MDAgLyB0aW1lb3V0LCB0aW1lb3V0KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGdldGFsb25nLmpzIGhhcyBlbmNvdW50ZXJlZCBhbiBlcnJvci4gJHtlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhdGljIGZvcm06IEZvcm07XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTtRQUFBO1NBVUM7Ozs7UUFOaUIsMEJBQW1CLEdBQWpDLFVBQWtDLFdBQTRCLEVBQUUsVUFBa0IsRUFBRSxVQUFrQjtZQUNsRyxXQUFXLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUM5QixvQ0FBa0MsVUFBVSxZQUFPLFVBQVUsOENBQTJDLEVBQ3hHLE1BQU0sRUFDTixzQkFBc0IsQ0FBQyxDQUFDO1NBQy9CO1FBQ0wsYUFBQztJQUFELENBQUMsSUFBQTs7SUNWRDtRQUFBO1NBeUJDOzs7OztRQXBCaUIsK0JBQXFCLEdBQW5DLFVBQW9DLFdBQVc7WUFDM0MsSUFBTSxjQUFjLEdBQUcsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLFVBQVU7a0JBQ3BELElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLEVBQUUsTUFBRztxQkFDckQsTUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsa0JBQWtCLEVBQUksQ0FBQTtrQkFDM0QsZUFBZSxDQUFDO1lBRXRCLE9BQU8sY0FBYyxDQUFDO1NBQ3pCOzs7OztRQU1hLCtCQUFxQixH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
