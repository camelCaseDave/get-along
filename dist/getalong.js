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
                            if (response == true) {
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
                ? new Date(apiResponse.modifiedon).toLocaleString()
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
                            modifiedOnHasChanged = apiResponse.modifiedon && (apiResponse.modifiedon > this.initialModifiedOn) ? true : false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qb2xsLnRzIiwiLi4vc3JjL1F1ZXJ5LnRzIiwiLi4vc3JjL05vdGlmeS50cyIsIi4uL3NyYy9Qcm9jZXNzb3IudHMiLCIuLi9zcmMvRm9ybS50cyIsIi4uL3NyYy9HZXRBbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBQb2xsIHtcclxuICAgIC8qKlxyXG4gICAgICogUG9sbHMgYSBmdW5jdGlvbiBldmVyeSBzcGVjaWZpZWQgbnVtYmVyIG9mIHNlY29uZHMgdW50aWwgaXQgcmV0dXJucyB0cnVlIG9yIHRpbWVvdXQgaXMgcmVhY2hlZC5cclxuICAgICAqIEBwYXJhbSBmbiBjYWxsYmFjayBQcm9taXNlIHRvIHBvbGwuXHJcbiAgICAgKiBAcGFyYW0gdGltZW91dCBzZWNvbmRzIHRvIGNvbnRpbnVlIHBvbGxpbmcgZm9yLlxyXG4gICAgICogQHBhcmFtIGludGVydmFsIHNlY29uZHMgYmV0d2VlbiBwb2xsaW5nIGNhbGxzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGwoZm46IGFueSwgdGltZW91dDogbnVtYmVyLCBpbnRlcnZhbDogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBjb25zdCBlbmRUaW1lID0gTnVtYmVyKG5ldyBEYXRlKCkpICsgKHRpbWVvdXQgKiAxMDAwKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2hlY2tDb25kaXRpb24gPSAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gZm4oKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoTnVtYmVyKG5ldyBEYXRlKCkpIDwgZW5kVGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2hlY2tDb25kaXRpb24uYmluZCh0aGlzKSwgaW50ZXJ2YWwgKiAxMDAwLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGNvbnNvbGUubG9nKFwiR2V0QWxvbmcgaGFzIGJlZW4gcG9sbGluZyBmb3IgMzAgbWludXRlcyBhbmQgd2lsbCBzdG9wIG5vdy5cIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoY2hlY2tDb25kaXRpb24pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnkge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW50aXR5SWQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3RhdGljIGVudGl0eU5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGxzIENSTSBBUEkgYW5kIHJldHVybnMgdGhlIGdpdmVuIGVudGl0eSdzIG1vZGlmaWVkIG9uIGRhdGUuXHJcbiAgICAgKiBAcGFyYW0gZW50aXR5TmFtZSBzY2hlbWEgbmFtZSBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxyXG4gICAgICogQHBhcmFtIGVudGl0eUlkIGlkIG9mIHRoZSBlbnRpdHkgdG8gcXVlcnkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0TGF0ZXN0TW9kaWZpZWRPbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBlbnRpdHlOYW1lPzogc3RyaW5nLCBlbnRpdHlJZD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSB0aGlzLmVudGl0eU5hbWUgfHwgZW50aXR5TmFtZSB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKHRoaXMuZW50aXR5TmFtZSwgdGhpcy5lbnRpdHlJZCwgXCI/JHNlbGVjdD1tb2RpZmllZG9uJiRleHBhbmQ9bW9kaWZpZWRieSgkc2VsZWN0PWZ1bGxuYW1lKVwiKS50aGVuKHJlc3BvbnNlID0+IHsgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RpZnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBOb3RpZmllcyB1c2VyIG9mIGEgZm9ybSBjaGFuZ2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0Rm9ybU5vdGlmaWNhdGlvbihmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0LCBtb2RpZmllZE9uOiBzdHJpbmcsIG1vZGlmaWVkQnk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oYFRoaXMgZm9ybSBoYXMgYmVlbiBtb2RpZmllZCBieSAke21vZGlmaWVkQnl9IGF0ICR7bW9kaWZpZWRPbn0uIFJlZnJlc2ggdGhlIGZvcm0gdG8gc2VlIGxhdGVzdCBjaGFuZ2VzLmAsIFwiSU5GT1wiLCBcIkdldEFsb25nTm90aWZpY2F0aW9uXCIpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvY2Vzc29yIHtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBtb2RpZmllZG9uIGRhdGUgYXMgYSByZWFkYWJsZSwgdXNlciBsb2NhbGUgc3RyaW5nLlxyXG4gICAgICogQHBhcmFtIGFwaVJlc3BvbnNlIENSTSBBUEkgcmVzcG9uc2UgdGhhdCBpbmNsdWRlcyBcIm1vZGlmaWVkb25cIiBjb2x1bW4uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc01vZGlmaWVkT25EYXRlKGFwaVJlc3BvbnNlKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBtb2RpZmllZE9uRGF0ZSA9IChhcGlSZXNwb25zZSAmJiBhcGlSZXNwb25zZS5tb2RpZmllZG9uKVxyXG4gICAgICAgICAgICA/IG5ldyBEYXRlKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24pLnRvTG9jYWxlU3RyaW5nKClcclxuICAgICAgICAgICAgOiBcInRoZSBzYW1lIHRpbWVcIjtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIG1vZGlmaWVkIGJ5IHVzZXIncyBmdWxsIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gYXBpUmVzcG9uc2UgQ1JNIEFQSSByZXNwb25zZSB0aGF0IGluY2x1ZGVzIGV4cGFuZGVkIFwibW9kaWZpZWRieS5mdWxsbmFtZVwiIGNvbHVtbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkQnlVc2VyID0gKGFwaVJlc3BvbnNlICYmIGFwaVJlc3BvbnNlLm1vZGlmaWVkYnkgJiYgYXBpUmVzcG9uc2UubW9kaWZpZWRieS5mdWxsbmFtZSlcclxuICAgICAgICAgICAgPyBhcGlSZXNwb25zZS5tb2RpZmllZGJ5LmZ1bGxuYW1lXHJcbiAgICAgICAgICAgIDogXCJhbm90aGVyIHVzZXJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkQnlVc2VyO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFF1ZXJ5IGZyb20gXCIuL1F1ZXJ5XCI7XHJcbmltcG9ydCBOb3RpZnkgZnJvbSBcIi4vTm90aWZ5XCI7XHJcbmltcG9ydCBQcm9jZXNzb3IgZnJvbSBcIi4vUHJvY2Vzc29yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtIHtcclxuICAgIHB1YmxpYyBmb3JtQ29udGV4dDogWHJtLkZvcm1Db250ZXh0O1xyXG4gICAgcHVibGljIGluaXRpYWxNb2RpZmllZE9uOiBEYXRlIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGxhdGVzdE1vZGlmaWVkT246IHN0cmluZztcclxuICAgIHB1YmxpYyBsYXRlc3RNb2RpZmllZEJ5OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZm9ybUNvbnRleHQgPSBmb3JtQ29udGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZvcm0gdHlwZSBpcyBub3QgY3JlYXRlIG9yIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzVmFsaWRGb3JtKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGZvcm1UeXBlOiBYcm1FbnVtLkZvcm1UeXBlID0gdGhpcy5mb3JtQ29udGV4dC51aS5nZXRGb3JtVHlwZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9ybVR5cGUgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMCAmJlxyXG4gICAgICAgICAgICBmb3JtVHlwZSAhPT0gMTtcclxuICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBmb3JtIG1vZGlmaWVkIG9uIGRhdGUuIENhbGxzIENSTSBBUEkgaWYgbW9kaWZpZWQgb24gYXR0cmlidXRlIGlzIG5vdCBvbiB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGdldEZvcm1Nb2RpZmllZE9uKCk6IFByb21pc2U8RGF0ZSB8IHVuZGVmaW5lZD4ge1xyXG4gICAgICAgIGxldCBtb2RpZmllZE9uOiBEYXRlIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25BdHRyaWJ1dGU6IFhybS5BdHRyaWJ1dGVzLkRhdGVBdHRyaWJ1dGUgPSB0aGlzLmZvcm1Db250ZXh0LmdldEF0dHJpYnV0ZShcIm1vZGlmaWVkb25cIik7XHJcblxyXG4gICAgICAgIGlmIChtb2RpZmllZE9uQXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgIG1vZGlmaWVkT24gPSBtb2RpZmllZE9uQXR0cmlidXRlLmdldFZhbHVlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgICAgICBtb2RpZmllZE9uID0gYXBpUmVzcG9uc2UubW9kaWZpZWRvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSBtb2RpZmllZE9uO1xyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIG1vZGlmaWVkIG9uIGZyb20gQ1JNIHNlcnZlciBhbmQgcmV0dXJucyB0cnVlIGlmIGl0IGhhcyBjaGFuZ2VkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSB0aGlzLmluaXRpYWxNb2RpZmllZE9uIHx8IGF3YWl0IHRoaXMuZ2V0Rm9ybU1vZGlmaWVkT24oKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBpUmVzcG9uc2UgPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKHRoaXMuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRCeSA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRCeVVzZXIoYXBpUmVzcG9uc2UpO1xyXG4gICAgICAgIHRoaXMubGF0ZXN0TW9kaWZpZWRPbiA9IFByb2Nlc3Nvci5wcm9jZXNzTW9kaWZpZWRPbkRhdGUoYXBpUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICBjb25zdCBtb2RpZmllZE9uSGFzQ2hhbmdlZCA9IGFwaVJlc3BvbnNlLm1vZGlmaWVkb24gJiYgKGFwaVJlc3BvbnNlLm1vZGlmaWVkb24gPiB0aGlzLmluaXRpYWxNb2RpZmllZE9uISkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChtb2RpZmllZE9uSGFzQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICBOb3RpZnkuc2V0Rm9ybU5vdGlmaWNhdGlvbih0aGlzLmZvcm1Db250ZXh0LCB0aGlzLmxhdGVzdE1vZGlmaWVkT24sIHRoaXMubGF0ZXN0TW9kaWZpZWRCeSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkhhc0NoYW5nZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldHMgbW9kaWZpZWQgb24gY2FjaGUgd2hlbiBmb3JtIGlzIHNhdmVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkUmVzZXRPblNhdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dC5kYXRhLmVudGl0eS5hZGRPblNhdmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxNb2RpZmllZE9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBvbGwgZnJvbSBcIi4vUG9sbFwiO1xyXG5pbXBvcnQgRm9ybSBmcm9tIFwiLi9Gb3JtXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZXRBbG9uZyB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBmb3JtOiBGb3JtO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUG9sbHMgZm9yIG1vZGlmaWNhdGlvbnMgdG8gdGhlIGN1cnJlbnQgZm9ybS5cclxuICAgICAqIEBwYXJhbSBleGVjdXRpb25Db250ZXh0IHBhc3NlZCBieSBkZWZhdWx0IGZyb20gRHluYW1pY3MgQ1JNIGZvcm0uXHJcbiAgICAgKiBAcGFyYW0gdGltZW91dCBkdXJhdGlvbiBpbiBzZWNvbmRzIHRvIHRpbWVvdXQgYmV0d2VlbiBwb2xsIG9wZXJhdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcG9sbEZvck1vZGlmaWNhdGlvbnMoZXhlY3V0aW9uQ29udGV4dDogWHJtLlBhZ2UuRXZlbnRDb250ZXh0LCB0aW1lb3V0OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBmb3JtQ29udGV4dCA9IGV4ZWN1dGlvbkNvbnRleHQuZ2V0Rm9ybUNvbnRleHQoKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtID0gbmV3IEZvcm0oZm9ybUNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZvcm0uaXNWYWxpZEZvcm0oKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZvcm0uZ2V0Rm9ybU1vZGlmaWVkT24oKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtLmFkZFJlc2V0T25TYXZlKCk7XHJcblxyXG4gICAgICAgICAgICBQb2xsLnBvbGwoKCkgPT4gdGhpcy5mb3JtLmNoZWNrSWZNb2RpZmllZE9uSGFzQ2hhbmdlZCgpLCAxODAwIC8gdGltZW91dCwgdGltZW91dCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBnZXRhbG9uZy5qcyBoYXMgZW5jb3VudGVyZWQgYW4gZXJyb3IuICR7ZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBO1FBQUE7U0EyQkM7Ozs7Ozs7UUFwQnVCLFNBQUksR0FBeEIsVUFBeUIsRUFBTyxFQUFFLE9BQWUsRUFBRSxRQUFnQjsyQ0FBRyxPQUFPOzs7O29CQUNuRSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBRWhELGNBQWMsR0FBRyxVQUFDLE9BQU8sRUFBRSxNQUFNO3dCQUNuQyxJQUFNLFFBQVEsR0FBRyxFQUFFLEVBQUUsQ0FBQzt3QkFDdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7NEJBQ2xCLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtnQ0FDbEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzZCQUNyQjtpQ0FDSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFO2dDQUNuQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsRUFBRSxRQUFRLEdBQUcsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzs2QkFDM0U7aUNBQ0k7Z0NBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkRBQTZELENBQUMsQ0FBQyxDQUFDOzZCQUN0Rjt5QkFDSixDQUFDLENBQUM7cUJBQ04sQ0FBQztvQkFFRixzQkFBTyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBQzs7O1NBQ3RDO1FBQ0wsV0FBQztJQUFELENBQUMsSUFBQTs7SUMzQkQ7UUFBQTtTQWlCQzs7Ozs7O1FBUnVCLHlC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
