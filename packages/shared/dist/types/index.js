"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStatus = exports.AreaUnit = exports.PropertyStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["BUYER"] = "buyer";
    UserRole["SELLER"] = "seller";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["AVAILABLE"] = "Available";
    PropertyStatus["PENDING"] = "Pending";
    PropertyStatus["RENTED"] = "Rented";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
var AreaUnit;
(function (AreaUnit) {
    AreaUnit["MARLA"] = "Marla";
    AreaUnit["KANAL"] = "Kanal";
})(AreaUnit || (exports.AreaUnit = AreaUnit = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
//# sourceMappingURL=index.js.map