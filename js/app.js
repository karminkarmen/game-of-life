const CELL_SIZE_PX = 10;
const CYCLE_TIME_MS = 1000;

function GameOfLife(boardWidth, boardHeight) {
    this.width = boardWidth;
    this.height = boardHeight;
    this.board = document.getElementById("board");
    this.createBoard = function () {
        var fieldsCount = this.width * this.height;
        this.board.style.width = (this.width * CELL_SIZE_PX) + "px";
        this.board.style.height = (this.height * CELL_SIZE_PX) + "px";
        for (var i = 0; i < fieldsCount; i++) {
            var newDiv = document.createElement("div");
            this.board.appendChild(newDiv);
            this.cells.push(newDiv);
        }
        this.cells.forEach(function (cell) {
            cell.addEventListener("click", function () {
                this.classList.toggle("live");
            })
        })
    };
    this.cells = [];
    this.getIndex = function (x, y) {
        return x + y * this.width;
    };
    this.setCellState = function (x, y, state) {
        var index = this.getIndex(x, y);
        if (state !== "live") {
            this.cells[index].classList.remove("live");
        } else {
            this.cells[index].classList.add("live");
        }
    };
    this.firstGlider = function () {
        this.setCellState(1, 3, 'live');
        this.setCellState(1, 1, 'live');
        this.setCellState(2, 3, 'live');
        this.setCellState(1, 5, 'live');
        this.setCellState(1, 4, 'live');
    };

    this.computeCellNextState = function (x, y) {
        var mainCellIndex = this.getIndex(x, y);
        var mainCell = this.cells[mainCellIndex];
        if (!mainCell) {
            return;
        }

        var liveCells = [];
        var neighboursCellsIndex = [
            this.getIndex(x - 1, y - 1),    this.getIndex(x, y - 1),    this.getIndex(x + 1, y - 1),
            this.getIndex(x - 1, y),        /* this cell */             this.getIndex(x + 1, y),
            this.getIndex(x - 1, y + 1),    this.getIndex(x, y + 1),    this.getIndex(x + 1, y + 1)
        ];
        // var aliveCellsCount = neighboursCellsIndex.filter(function(index) {
        //     return ((index !== undefined) && (this.cells[index].classList.contains("live")))
        // }).length;
        // return (aliveCellsCount === 3 || (aliveCellsCount === 2 && mainCell.classList.contains("live")) ? 1 : 0;

        var correctIndexArray = [];
        for (var i = 0; i < neighboursCellsIndex.length; i++) {
            var newIndex = neighboursCellsIndex[i];
            if (this.cells[newIndex] !== undefined) {
                correctIndexArray.push(newIndex);
            }
        }

        for (var i = 0; i < correctIndexArray.length; i++) {
            var cell = this.cells[correctIndexArray[i]];
            if (cell.classList.contains("live")) {
                liveCells.push(cell);
            }
        }

        if (mainCell.classList.contains("live") && (liveCells.length === 2 || liveCells.length === 3)) {
            return 1
        } else if (!mainCell.classList.contains("live") && liveCells.length === 3) {
            return 1
        } else {
            return 0
        }


    };

    var nextBoard;

    this.computeNextGeneration = function () {
        nextBoard = [];
        for (var y = 0; y < this.width; y++) {
            for (var x = 0; x < this.height; x++) {
                nextBoard.push(this.computeCellNextState(x, y));
            }
        }
        return nextBoard;
    };

    this.printNextGeneration = function () {
        this.computeNextGeneration();
        for (var i = 0; i < this.cells.length; i++) {
            if (nextBoard[i] === 1) {
                this.cells[i].classList.add("live");
            } else {
                this.cells[i].classList.remove("live")
            }
        }
    };
}

var game = new GameOfLife(10, 10);
game.createBoard();
game.firstGlider();



var printInterval;
var playButton = document.getElementById("play");
playButton.addEventListener("click", function () {
     printInterval = setInterval(function() {
        game.printNextGeneration();
    }, CYCLE_TIME_MS);
    game.printNextGeneration();
});

var pauseButton = document.getElementById("pause");
pauseButton.addEventListener("click", function() {
    clearInterval(printInterval);
});
