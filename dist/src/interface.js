"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 类目类型
 * @export
 * @enum {number}
 */
var CategoryType;
(function (CategoryType) {
    // 限于某个类目
    CategoryType[CategoryType["CATEGORY"] = 1] = "CATEGORY";
    // 限于某个商品
    CategoryType[CategoryType["GOODS"] = 2] = "GOODS";
    // 所有商品
    CategoryType[CategoryType["ALL"] = 3] = "ALL";
    // 活动类目
    CategoryType[CategoryType["ACTIVITY_CATEGORY"] = 4] = "ACTIVITY_CATEGORY";
})(CategoryType = exports.CategoryType || (exports.CategoryType = {}));
/**
 *
 * 错误类型
 * @export
 * @enum {number}
 */
var ErrorType;
(function (ErrorType) {
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
//# sourceMappingURL=interface.js.map