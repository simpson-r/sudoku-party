'use client';
"use strict";
exports.__esModule = true;
exports.SudokuBoard = void 0;
var react_1 = require("react");
var game_generator_1 = require("@/modules/game-generator");
var constants_1 = require("./constants");
var SudokuBox_1 = require("./SudokuBox");
var SudokuGrid_1 = require("./SudokuGrid");
var directions = {
    ArrowLeft: { dr: 0, dc: -1 },
    ArrowRight: { dr: 0, dc: 1 },
    ArrowUp: { dr: -1, dc: 0 },
    ArrowDown: { dr: 1, dc: 0 }
};
exports.SudokuBoard = function (_a) {
    var _b = react_1.useState(function () { return game_generator_1.generateSudokuGame(); })[0], puzzle = _b.puzzle, solution = _b.solution;
    var _c = react_1.useState(), selectedCell = _c[0], setSelectedCell = _c[1];
    var cellsPerBox = game_generator_1.generateCellsPerBox(puzzle, solution);
    /** handlers */
    var handleCellSelect = function (cell) { return setSelectedCell(cell); };
    var handleArrowKey = react_1.useCallback(function (e) {
        if (!selectedCell)
            return;
        var direction = directions[e.key];
        if (!direction)
            return;
        e.preventDefault();
        setSelectedCell({
            row: (selectedCell.row + direction.dr + constants_1.GRID_SIZE) % constants_1.GRID_SIZE,
            col: (selectedCell.col + direction.dc + constants_1.GRID_SIZE) % constants_1.GRID_SIZE
        });
    }, [selectedCell, setSelectedCell]);
    /** effects */
    react_1.useEffect(function () {
        document.addEventListener('keydown', handleArrowKey);
        return function () { return document.removeEventListener('keydown', handleArrowKey); };
    }, [handleArrowKey]);
    /** render */
    return (React.createElement(SudokuGrid_1.SudokuGrid, null, Array.from({ length: constants_1.GRID_SIZE }).map(function (_, boxIndex) { return (React.createElement(SudokuBox_1.SudokuBox, { key: boxIndex, cells: cellsPerBox[boxIndex], selected: selectedCell, onCellSelect: handleCellSelect })); })));
};
