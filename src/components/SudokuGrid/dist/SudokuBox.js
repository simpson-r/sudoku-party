'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.SudokuBox = void 0;
var react_1 = require("@chakra-ui/react");
var SudokuCell_1 = require("./SudokuCell");
exports.SudokuBox = function (_a) {
    var cells = _a.cells, selected = _a.selected, onCellSelect = _a.onCellSelect, onCellFill = _a.onCellFill, onCellClear = _a.onCellClear, props = __rest(_a, ["cells", "selected", "onCellSelect", "onCellFill", "onCellClear"]);
    var withinBox = cells.some(function (cell) { return cell.row === (selected === null || selected === void 0 ? void 0 : selected.row) && cell.col === (selected === null || selected === void 0 ? void 0 : selected.col); });
    return (React.createElement(react_1.SimpleGrid, __assign({ w: "full", h: "full", 
        // bg="gray.border"
        columns: 3, gap: "1px" }, props), cells.map(function (cell) { return (React.createElement(SudokuCell_1.SudokuCell, { key: cell.row + "-" + cell.col, cell: cell, selected: (selected === null || selected === void 0 ? void 0 : selected.row) === cell.row && (selected === null || selected === void 0 ? void 0 : selected.col) === cell.col, highlighted: (selected === null || selected === void 0 ? void 0 : selected.row) === cell.row ||
            (selected === null || selected === void 0 ? void 0 : selected.col) === cell.col ||
            withinBox, identical: !!(selected === null || selected === void 0 ? void 0 : selected.value) && cell.value === (selected === null || selected === void 0 ? void 0 : selected.value), onClick: function () { return onCellSelect(cell); }, onCellFill: onCellFill, onCellClear: onCellClear })); })));
};
