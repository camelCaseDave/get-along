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
            return __awaiter(this, void 0, void 0, function () {
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
                    return [2 /*return*/, Xrm.WebApi.retrieveRecord(this.entityName, this.entityId, "?$select=modifiedon").then(function (response) {
                            return response.modifiedon;
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
        Notify.setFormNotification = function (formContext) {
            formContext.ui.setFormNotification("This form has been updated by another user, refresh the form?", "INFO", "GetAlongNotification");
        };
        return Notify;
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
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.formContext = executionContext.getFormContext();
                            if (!this.isValidForm()) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.getFormModifiedOn()];
                        case 1:
                            _a.sent();
                            this.addResetOnSave();
                            Poll.poll(function () { return _this.checkIfModifiedOnHasChanged(); }, 1800 / timeout, timeout);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Returns true if the form type is not create or undefined.
         */
        GetAlong.isValidForm = function () {
            var formType = GetAlong.formContext.ui.getFormType();
            return formType !== undefined &&
                formType !== 0 &&
                formType !== 1;
        };
        /**
         * Gets the form modified on date. Calls CRM API if modified on attribute is not on the form.
         */
        GetAlong.getFormModifiedOn = function () {
            return __awaiter(this, void 0, Promise, function () {
                var modifiedOn, modifiedOnAttribute;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            modifiedOnAttribute = GetAlong.formContext.getAttribute("modifiedon");
                            if (!modifiedOnAttribute) return [3 /*break*/, 1];
                            modifiedOn = modifiedOnAttribute.getValue();
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, Query.getLatestModifiedOn(GetAlong.formContext)];
                        case 2:
                            modifiedOn = _a.sent();
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
        GetAlong.checkIfModifiedOnHasChanged = function () {
            return __awaiter(this, void 0, Promise, function () {
                var _a, _b, latestModifiedOn, modifiedOnHasChanged;
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
                            return [4 /*yield*/, Query.getLatestModifiedOn(GetAlong.formContext)];
                        case 3:
                            latestModifiedOn = _c.sent();
                            modifiedOnHasChanged = this.initialModifiedOn && (latestModifiedOn > this.initialModifiedOn) ? true : false;
                            if (modifiedOnHasChanged) {
                                Notify.setFormNotification(GetAlong.formContext);
                            }
                            return [2 /*return*/, modifiedOnHasChanged];
                    }
                });
            });
        };
        GetAlong.addResetOnSave = function () {
            var _this = this;
            this.formContext.data.entity.addOnSave(function () {
                _this.initialModifiedOn = undefined;
            });
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qb2xsLnRzIiwiLi4vc3JjL1F1ZXJ5LnRzIiwiLi4vc3JjL05vdGlmeS50cyIsIi4uL3NyYy9HZXRBbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBQb2xsIHtcclxuICAgIC8qKlxyXG4gICAgICogUG9sbHMgYSBmdW5jdGlvbiBldmVyeSBzcGVjaWZpZWQgbnVtYmVyIG9mIHNlY29uZHMgdW50aWwgaXQgcmV0dXJucyB0cnVlIG9yIHRpbWVvdXQgaXMgcmVhY2hlZC5cclxuICAgICAqIEBwYXJhbSBmbiBjYWxsYmFjayBQcm9taXNlIHRvIHBvbGwuXHJcbiAgICAgKiBAcGFyYW0gdGltZW91dCBzZWNvbmRzIHRvIGNvbnRpbnVlIHBvbGxpbmcgZm9yLlxyXG4gICAgICogQHBhcmFtIGludGVydmFsIHNlY29uZHMgYmV0d2VlbiBwb2xsaW5nIGNhbGxzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGwoZm46IGFueSwgdGltZW91dDogbnVtYmVyLCBpbnRlcnZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IE51bWJlcihuZXcgRGF0ZSgpKSArICh0aW1lb3V0ICogMTAwMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNoZWNrQ29uZGl0aW9uID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGZuKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKE51bWJlcihuZXcgRGF0ZSgpKSA8IGVuZFRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNoZWNrQ29uZGl0aW9uLmJpbmQodGhpcyksIGludGVydmFsICogMTAwMCwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChjb25zb2xlLmxvZyhcIkdldEFsb25nIGhhcyBiZWVuIHBvbGxpbmcgZm9yIDMwIG1pbnV0ZXMgYW5kIHdpbGwgc3RvcCBub3cuXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGNoZWNrQ29uZGl0aW9uKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGVudGl0eUlkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxscyBDUk0gQVBJIGFuZCByZXR1cm5zIHRoZSBnaXZlbiBlbnRpdHkncyBtb2RpZmllZCBvbiBkYXRlLlxyXG4gICAgICogQHBhcmFtIGVudGl0eU5hbWUgc2NoZW1hIG5hbWUgb2YgdGhlIGVudGl0eSB0byBxdWVyeS5cclxuICAgICAqIEBwYXJhbSBlbnRpdHlJZCBpZCBvZiB0aGUgZW50aXR5IHRvIHF1ZXJ5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGdldExhdGVzdE1vZGlmaWVkT24oZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCwgZW50aXR5TmFtZT86IHN0cmluZywgZW50aXR5SWQ/OiBzdHJpbmcpOiBQcm9taXNlPERhdGU+IHtcclxuICAgICAgICB0aGlzLmVudGl0eUlkID0gdGhpcy5lbnRpdHlJZCB8fCBlbnRpdHlJZCB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRJZCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXR5TmFtZSA9IHRoaXMuZW50aXR5TmFtZSB8fCBlbnRpdHlOYW1lIHx8IGZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmdldEVudGl0eU5hbWUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFhybS5XZWJBcGkucmV0cmlldmVSZWNvcmQodGhpcy5lbnRpdHlOYW1lLCB0aGlzLmVudGl0eUlkLCBcIj8kc2VsZWN0PW1vZGlmaWVkb25cIikudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5tb2RpZmllZG9uO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZ5IHtcclxuICAgIC8qKlxyXG4gICAgICogTm90aWZpZXMgdXNlciBvZiBhIGZvcm0gY2hhbmdlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldEZvcm1Ob3RpZmljYXRpb24oZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oXCJUaGlzIGZvcm0gaGFzIGJlZW4gdXBkYXRlZCBieSBhbm90aGVyIHVzZXIsIHJlZnJlc2ggdGhlIGZvcm0/XCIsIFwiSU5GT1wiLCBcIkdldEFsb25nTm90aWZpY2F0aW9uXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBvbGwgZnJvbSBcIi4vUG9sbFwiO1xyXG5pbXBvcnQgUXVlcnkgZnJvbSBcIi4vUXVlcnlcIjtcclxuaW1wb3J0IE5vdGlmeSBmcm9tIFwiLi9Ob3RpZnlcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdldEFsb25nIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsTW9kaWZpZWRPbjogRGF0ZSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBvbGxzIGZvciBtb2RpZmljYXRpb25zIHRvIHRoZSBjdXJyZW50IGZvcm0uXHJcbiAgICAgKiBAcGFyYW0gZXhlY3V0aW9uQ29udGV4dCBwYXNzZWQgYnkgZGVmYXVsdCBmcm9tIER5bmFtaWNzIENSTSBmb3JtLlxyXG4gICAgICogQHBhcmFtIHRpbWVvdXQgZHVyYXRpb24gaW4gc2Vjb25kcyB0byB0aW1lb3V0IGJldHdlZW4gcG9sbCBvcGVyYXRpb25zLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGxGb3JNb2RpZmljYXRpb25zKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgdGltZW91dDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGV4ZWN1dGlvbkNvbnRleHQuZ2V0Rm9ybUNvbnRleHQoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRGb3JtKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRGb3JtTW9kaWZpZWRPbigpO1xyXG4gICAgICAgIHRoaXMuYWRkUmVzZXRPblNhdmUoKTtcclxuICAgICAgICBQb2xsLnBvbGwoKCkgPT4gdGhpcy5jaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoKSwgMTgwMCAvIHRpbWVvdXQsIHRpbWVvdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBmb3JtIHR5cGUgaXMgbm90IGNyZWF0ZSBvciB1bmRlZmluZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGlzVmFsaWRGb3JtKCkge1xyXG4gICAgICAgIGNvbnN0IGZvcm1UeXBlOiBYcm1FbnVtLkZvcm1UeXBlID0gR2V0QWxvbmcuZm9ybUNvbnRleHQudWkuZ2V0Rm9ybVR5cGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZvcm1UeXBlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgZm9ybVR5cGUgIT09IDAgJiZcclxuICAgICAgICAgICAgZm9ybVR5cGUgIT09IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBmb3JtIG1vZGlmaWVkIG9uIGRhdGUuIENhbGxzIENSTSBBUEkgaWYgbW9kaWZpZWQgb24gYXR0cmlidXRlIGlzIG5vdCBvbiB0aGUgZm9ybS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgZ2V0Rm9ybU1vZGlmaWVkT24oKTogUHJvbWlzZTxEYXRlIHwgdW5kZWZpbmVkPiB7XHJcbiAgICAgICAgbGV0IG1vZGlmaWVkT246IERhdGUgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRPbkF0dHJpYnV0ZTogWHJtLkF0dHJpYnV0ZXMuRGF0ZUF0dHJpYnV0ZSA9IEdldEFsb25nLmZvcm1Db250ZXh0LmdldEF0dHJpYnV0ZShcIm1vZGlmaWVkb25cIik7XHJcblxyXG4gICAgICAgIGlmIChtb2RpZmllZE9uQXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgIG1vZGlmaWVkT24gPSBtb2RpZmllZE9uQXR0cmlidXRlLmdldFZhbHVlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbW9kaWZpZWRPbiA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24oR2V0QWxvbmcuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IG1vZGlmaWVkT247XHJcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVkT247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIG1vZGlmaWVkIG9uIGZyb20gQ1JNIHNlcnZlciBhbmQgcmV0dXJucyB0cnVlIGlmIGl0IGhhcyBjaGFuZ2VkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBjaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsTW9kaWZpZWRPbiA9IHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gfHwgYXdhaXQgdGhpcy5nZXRGb3JtTW9kaWZpZWRPbigpO1xyXG4gICAgICAgIGNvbnN0IGxhdGVzdE1vZGlmaWVkT24gPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKEdldEFsb25nLmZvcm1Db250ZXh0KTtcclxuICAgICAgICBjb25zdCBtb2RpZmllZE9uSGFzQ2hhbmdlZCA9IHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gJiYgKGxhdGVzdE1vZGlmaWVkT24gPiB0aGlzLmluaXRpYWxNb2RpZmllZE9uKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGlmaWVkT25IYXNDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgIE5vdGlmeS5zZXRGb3JtTm90aWZpY2F0aW9uKEdldEFsb25nLmZvcm1Db250ZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uSGFzQ2hhbmdlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhZGRSZXNldE9uU2F2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZvcm1Db250ZXh0LmRhdGEuZW50aXR5LmFkZE9uU2F2ZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBO1FBQUE7U0EyQkM7Ozs7Ozs7UUFwQnVCLFNBQUksR0FBeEIsVUFBeUIsRUFBTyxFQUFFLE9B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
