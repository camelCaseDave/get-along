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
        Notify.setFormNotification = function (formContext) {
            formContext.ui.setFormNotification("This form has been updated by another user, refresh the form?", "INFO", "GetAlongNotification");
        };
        return Notify;
    }());

    var GetAlong = /** @class */ (function () {
        function GetAlong() {
        }
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
                            Poll.poll(function () { return _this.checkIfModifiedOnHasChanged(); }, 1800 / timeout, timeout);
                            return [2 /*return*/];
                    }
                });
            });
        };
        GetAlong.isValidForm = function () {
            var formType = GetAlong.formContext.ui.getFormType();
            return formType !== undefined &&
                formType !== 0 &&
                formType !== 1;
        };
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
        GetAlong.checkIfModifiedOnHasChanged = function () {
            return __awaiter(this, void 0, Promise, function () {
                var latestModifiedOn, modifiedOnHasChanged;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Query.getLatestModifiedOn(GetAlong.formContext)];
                        case 1:
                            latestModifiedOn = _a.sent();
                            modifiedOnHasChanged = latestModifiedOn > this.initialModifiedOn;
                            if (modifiedOnHasChanged) {
                                Notify.setFormNotification(GetAlong.formContext);
                            }
                            return [2 /*return*/, modifiedOnHasChanged];
                    }
                });
            });
        };
        return GetAlong;
    }());

    return GetAlong;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0YWxvbmcuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qb2xsLnRzIiwiLi4vc3JjL1F1ZXJ5LnRzIiwiLi4vc3JjL05vdGlmeS50cyIsIi4uL3NyYy9HZXRBbG9uZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBQb2xsIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcG9sbChmbiwgdGltZW91dDogbnVtYmVyLCBpbnRlcnZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IE51bWJlcihuZXcgRGF0ZSgpKSArICh0aW1lb3V0ICogMTAwMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNoZWNrQ29uZGl0aW9uID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGZuKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKE51bWJlcihuZXcgRGF0ZSgpKSA8IGVuZFRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNoZWNrQ29uZGl0aW9uLmJpbmQodGhpcyksIGludGVydmFsICogMTAwMCwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChjb25zb2xlLmxvZyhcIkdldEFsb25nIGhhcyBiZWVuIHBvbGxpbmcgZm9yIDMwIG1pbnV0ZXMgYW5kIHdpbGwgc3RvcCBub3cuXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGNoZWNrQ29uZGl0aW9uKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGVudGl0eUlkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBlbnRpdHlOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBnZXRMYXRlc3RNb2RpZmllZE9uKGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQsIGVudGl0eU5hbWU/OiBzdHJpbmcsIGVudGl0eUlkPzogc3RyaW5nKTogUHJvbWlzZTxEYXRlPiB7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlJZCA9IHRoaXMuZW50aXR5SWQgfHwgZW50aXR5SWQgfHwgZm9ybUNvbnRleHQuZGF0YS5lbnRpdHkuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmVudGl0eU5hbWUgPSB0aGlzLmVudGl0eU5hbWUgfHwgZW50aXR5TmFtZSB8fCBmb3JtQ29udGV4dC5kYXRhLmVudGl0eS5nZXRFbnRpdHlOYW1lKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBYcm0uV2ViQXBpLnJldHJpZXZlUmVjb3JkKHRoaXMuZW50aXR5TmFtZSwgdGhpcy5lbnRpdHlJZCwgXCI/JHNlbGVjdD1tb2RpZmllZG9uXCIpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UubW9kaWZpZWRvbjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdGlmeSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNldEZvcm1Ob3RpZmljYXRpb24oZm9ybUNvbnRleHQ6IFhybS5Gb3JtQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGZvcm1Db250ZXh0LnVpLnNldEZvcm1Ob3RpZmljYXRpb24oXCJUaGlzIGZvcm0gaGFzIGJlZW4gdXBkYXRlZCBieSBhbm90aGVyIHVzZXIsIHJlZnJlc2ggdGhlIGZvcm0/XCIsIFwiSU5GT1wiLCBcIkdldEFsb25nTm90aWZpY2F0aW9uXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBvbGwgZnJvbSBcIi4vUG9sbFwiO1xyXG5pbXBvcnQgUXVlcnkgZnJvbSBcIi4vUXVlcnlcIjtcclxuaW1wb3J0IE5vdGlmeSBmcm9tIFwiLi9Ob3RpZnlcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdldEFsb25nIHsgICBcclxuICAgIHByaXZhdGUgc3RhdGljIGZvcm1Db250ZXh0OiBYcm0uRm9ybUNvbnRleHQ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsTW9kaWZpZWRPbjogRGF0ZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHBvbGxGb3JNb2RpZmljYXRpb25zKGV4ZWN1dGlvbkNvbnRleHQ6IFhybS5QYWdlLkV2ZW50Q29udGV4dCwgdGltZW91dDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtQ29udGV4dCA9IGV4ZWN1dGlvbkNvbnRleHQuZ2V0Rm9ybUNvbnRleHQoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRGb3JtKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRGb3JtTW9kaWZpZWRPbigpOyAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgUG9sbC5wb2xsKCgpID0+IHRoaXMuY2hlY2tJZk1vZGlmaWVkT25IYXNDaGFuZ2VkKCksIDE4MDAgLyB0aW1lb3V0LCB0aW1lb3V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpc1ZhbGlkRm9ybSgpIHtcclxuICAgICAgICBjb25zdCBmb3JtVHlwZTogWHJtRW51bS5Gb3JtVHlwZSA9IEdldEFsb25nLmZvcm1Db250ZXh0LnVpLmdldEZvcm1UeXBlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmb3JtVHlwZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAwICYmXHJcbiAgICAgICAgICAgIGZvcm1UeXBlICE9PSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGdldEZvcm1Nb2RpZmllZE9uKCk6IFByb21pc2U8RGF0ZSB8IHVuZGVmaW5lZD4ge1xyXG4gICAgICAgIGxldCBtb2RpZmllZE9uOiBEYXRlIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25BdHRyaWJ1dGU6IFhybS5BdHRyaWJ1dGVzLkRhdGVBdHRyaWJ1dGUgPSBHZXRBbG9uZy5mb3JtQ29udGV4dC5nZXRBdHRyaWJ1dGUoXCJtb2RpZmllZG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAobW9kaWZpZWRPbkF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICBtb2RpZmllZE9uID0gbW9kaWZpZWRPbkF0dHJpYnV0ZS5nZXRWYWx1ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1vZGlmaWVkT24gPSBhd2FpdCBRdWVyeS5nZXRMYXRlc3RNb2RpZmllZE9uKEdldEFsb25nLmZvcm1Db250ZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbE1vZGlmaWVkT24gPSBtb2RpZmllZE9uO1xyXG4gICAgICAgIHJldHVybiBtb2RpZmllZE9uO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBjaGVja0lmTW9kaWZpZWRPbkhhc0NoYW5nZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgY29uc3QgbGF0ZXN0TW9kaWZpZWRPbiA9IGF3YWl0IFF1ZXJ5LmdldExhdGVzdE1vZGlmaWVkT24oR2V0QWxvbmcuZm9ybUNvbnRleHQpO1xyXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkT25IYXNDaGFuZ2VkID0gbGF0ZXN0TW9kaWZpZWRPbiA+IHRoaXMuaW5pdGlhbE1vZGlmaWVkT247XHJcblxyXG4gICAgICAgIGlmIChtb2RpZmllZE9uSGFzQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICBOb3RpZnkuc2V0Rm9ybU5vdGlmaWNhdGlvbihHZXRBbG9uZy5mb3JtQ29udGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbW9kaWZpZWRPbkhhc0NoYW5nZWQ7XHJcbiAgICB9XHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBO1FBQUE7U0FxQkM7UUFwQnVCLFNBQUksR0FBeEIsVUFBeUIsRUFBRSxFQUFFLE9BQWUsRUFBRSxRQUFnQjs7Ozs7b0JBQ3BELE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFFaEQsY0FBYyxHQUFHLFVBQUMsT0FBTyxFQUFFLE1BQU07d0JBQ25DLElBQU0sUUFBUSxHQUFHLEVBQUUsRUFBRSxDQUFDO3dCQUN0QixRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTs0QkFDbEIsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO2dDQUNsQixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7NkJBQ3JCO2lDQUNJLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUU7Z0NBQ25DLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxFQUFFLFFBQVEsR0FBRyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDOzZCQUMzRTtpQ0FDSTtnQ0FDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDLENBQUM7NkJBQ3RGO3lCQUNKLENBQUMsQ0FBQztxQkFDTixDQUFDO29CQUVGLHNCQUFPLElBQUksT0FBTyxDQUFDLGNB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
