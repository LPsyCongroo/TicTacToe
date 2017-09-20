;
// "use strict";
window.$ = window.Sizzle;




/* VARIABLES */

const canvas = $('canvas')[0];
const ctx = canvas.getContext('2d');
const mouse = {};

let boardSize = 3;
let winCondition = 3;
let gameType = 'PvsP';
let margin = 10;
let padding = 30;
let strokeWidth = 10;
let player1 = 'X';
let player2 = 'O';
let turn;
let board;





/* CONSTRUCTORS */

/**
 * Space on the board
 * @param {number} x 
 * @param {number} y 
 */
function Space(x, y){
    this.x = x;
    this.y = y;
    this.occupant = null; //or X or O
    this.box = {
        topLeft: {},
        topRight: {},
        bottomLeft: {},
        bottomRight: {},
        center: {}
    }
}

Space.prototype.isInBox = function(){
    if(    mouse.x > this.box.topLeft.x 
        && mouse.x < this.box.topRight.x
        && mouse.y > this.box.topLeft.y
        && mouse.y < this.box.bottomLeft.y
    ){
        return true;
    }
    else{
        return false;
    }
};




/* FUNCTIONS */

function init(){

    // Initialize Board
    let column = []
    for(let i = 0; i < boardSize; i++){
        let row = [];
        for(let j = 0; j < boardSize; j++){
            row.push(new Space(i, j));
        }
        column.push(row);   
    }
    board = column;
    turn = player1;
    
    onResize();
    
    renderBoard();
    
    // animatedRender();
}

function forEachSpace(doThis){
    for(let x = 0; x < boardSize; x++){
        for(let y = 0; y < boardSize; y++){
            doThis(x, y);
        }        
    }
}

function makeMove(){

    let selectedSpace;

    forEachSpace((x,y)=>{
        if(board[x][y].isInBox())
            selectedSpace = board[x][y];
    });
        
    if(!selectedSpace.occupant){
        renderPiece(selectedSpace.box, turn);

        selectedSpace.occupant = turn;

        turn === player1 ? turn = player2 : turn = player1;
    }

    checkWinner();

}

function getPossibleRows(x,y){
    let space = board[x][y];
    let possibleRows = {
        horizontal : [],
        vertical : [],
        forwardD : [],
        backD : []
    }

    // Horizontal
    let col = x;
    while(col >= 0){
        if(board[col][y].occupant === null || space.occupant)
            possibleRows.horizontal.unshift(board[col][y]);
        else
            break;
        col--;
    }
    col = x+1;
    while(col < boardSize){
        if(board[col][y].occupant === null || space.occupant)
            possibleRows.horizontal.push(board[col][y]);
        else
            break;
        col++;
    }

    // Vertical
    let row = y;
    while(row >= 0){
        if(board[x][row].occupant === null || space.occupant)
            possibleRows.vertical.unshift(board[x][row]);
        else
            break;
        row--;
    }
    row = x+1;
    while(row < boardSize){
        if(board[x][row].occupant === null || space.occupant)
            possibleRows.vertical.push(board[x][row]);
        else
            break;
        row++;
    }


    return possibleRows;
}

function checkWinner(){
    console.log('Checking winner....');
    forEachSpace((x,y)=>{
        let space = board[x][y];
        let possibleRows = getPossibleRows(x,y);
        if(space.occupant)
            console.log(possibleRows);
        let winString = '';
        for(let i = 0; i < winCondition; i++)
            winString += space.occupant;
        for(let i in possibleRows){
            let possRow = possibleRows[i];
            let rowString = '';
            possRow.forEach((space, index)=>{
                if(space.occupant)
                    rowString += space.occupant;
                else
                    string = '';
                if(rowString === winString)
                    declareWinner(possRow[index - winCondition + 1], space);
            });
            
        }
        
    });
}

/**
 * 
 * @param {Space} start - first item in a row
 * @param {Space} end - last item in a row
 */
function declareWinner(start, end){
    console.log('we have a winner!!!');
    ctx.beginPath();
    ctx.moveTo(start.box.center.x,start.box.center.y);
    ctx.lineTo(end.box.center.x, end.box.center.y);
    ctx.closePath();
    ctx.stroke();
}





/* RENDERING */

function renderBoard(){

    // Render Lines
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = strokeWidth;
    for(var i = 1; i < boardSize; i++){
        let start = (canvas.width / boardSize * i) - (ctx.lineWidth);
        ctx.moveTo(margin + start, margin);
        ctx.lineTo(margin + start, canvas.height - margin);
        ctx.closePath();
        ctx.moveTo(margin, margin + start);
        ctx.lineTo(canvas.height - margin, margin + start);
        ctx.closePath();
        ctx.stroke();
    }

    // Render Moves
    // board.forEach((col)=>{
    //     col.forEach((space)=>{
    //         if(space.occupant){
    //             renderPiece(space.box, space.occupant);
    //         }
    //     });
    // });
    forEachSpace((x,y)=>{
        if(board[x][y].occupant)
            renderPiece(board[x][y].box, board[x][y].occupant);
    });
}

// function animatedRender(){}

function renderPiece(box, piece){
    if(piece === 'X'){
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        // \
        ctx.moveTo(box.topLeft.x + padding, box.topLeft.y + padding);
        ctx.lineTo(box.bottomRight.x - padding, box.bottomRight.y - padding);
        ctx.closePath();
        // X
        ctx.moveTo(box.topRight.x - padding, box.topRight.y + padding);
        ctx.lineTo(box.bottomLeft.x + padding, box.bottomLeft.y - padding);
        ctx.closePath();

        ctx.stroke();    
    }
    else if(piece === 'O'){
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        // O
        ctx.arc(box.center.x, box.center.y, box.center.x - box.topLeft.x - padding, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
    }
    else{
        console.error("WTF no piece was entered?");
    }
}




/* EVENTS */

function onResize(){
    // Canvas Size
    if(window.innerWidth < 250){
        canvas.width = 250;
    }
    else if(window.innerWidth < 500){
        canvas.width = window.innerWidth;
    }
    else{
        canvas.width = 500;
    }
    canvas.height = canvas.width;

    spaceSide = (canvas.width - margin) / boardSize;

    // Bounding Box Size
    // for(let col = 0; col < boardSize; col++){
    //     for(let row = 0; row < boardSize; row++){

    //         board[col][row].box.topLeft.x       =   margin/2 + (spaceSide * col);
    //         board[col][row].box.topLeft.y       =   margin/2 + (spaceSide * row);

    //         board[col][row].box.topRight.x      =   margin/2 + (spaceSide * (col + 1));
    //         board[col][row].box.topRight.y      =   margin/2 + (spaceSide * row);

    //         board[col][row].box.bottomLeft.x    =   margin/2 + (spaceSide * col);
    //         board[col][row].box.bottomLeft.y    =   margin/2 + (spaceSide * (row + 1));

    //         board[col][row].box.bottomRight.x   =   margin/2 + (spaceSide * (col + 1));
    //         board[col][row].box.bottomRight.y   =   margin/2 + (spaceSide * (row + 1));

    //         board[col][row].box.center.x        =   margin/2 + (spaceSide * col) + (spaceSide/2);
    //         board[col][row].box.center.y        =   margin/2 + (spaceSide * row) + (spaceSide/2);
            
    //     }
    // }

    forEachSpace((col, row)=>{
            board[col][row].box.topLeft.x       =   margin/2 + (spaceSide * col);
            board[col][row].box.topLeft.y       =   margin/2 + (spaceSide * row);

            board[col][row].box.topRight.x      =   margin/2 + (spaceSide * (col + 1));
            board[col][row].box.topRight.y      =   margin/2 + (spaceSide * row);

            board[col][row].box.bottomLeft.x    =   margin/2 + (spaceSide * col);
            board[col][row].box.bottomLeft.y    =   margin/2 + (spaceSide * (row + 1));

            board[col][row].box.bottomRight.x   =   margin/2 + (spaceSide * (col + 1));
            board[col][row].box.bottomRight.y   =   margin/2 + (spaceSide * (row + 1));

            board[col][row].box.center.x        =   margin/2 + (spaceSide * col) + (spaceSide/2);
            board[col][row].box.center.y        =   margin/2 + (spaceSide * row) + (spaceSide/2);
    });
}

function onMouseMove(event){
    mouse.x = event.x - canvas.getBoundingClientRect().left;
    mouse.y = event.y - canvas.getBoundingClientRect().top;
    // console.log('x is '+mouse.x + ' y is ' + mouse.y);

    
}

function onClick(){
    makeMove();
}

window.addEventListener('resize', ()=>{
    onResize();
    renderBoard();
});

canvas.addEventListener('mousemove', onMouseMove);

canvas.addEventListener('click', onClick);

init();
