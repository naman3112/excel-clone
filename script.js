const ps = new PerfectScrollbar("#cells", {
  wheelSpeed: 15,
  wheelPropagation: true,
});

for (let i = 1; i <= 100; i++) {
  let str = "";
  let n = i;
  while (n > 0) {
    let rem = n % 26;
    if (rem == 0) {
      str = "Z";
      n = Math.floor(n / 26) - 1;
    } else {
      str = String.fromCharCode(rem - 1 + 65) + str;
      n = Math.floor(n / 26);
    }
  }
  $("#columns").append(`<div class="column-name">${str}</div>`);
  $("#rows").append(`<div class="row-name"> ${i} </div>`);
}
let cellData=[];
for (let i = 1; i <= 100; i++) {
  let row = $(`<div class="cell-row"></div>`);
  let rowArray=[];
  for (let j = 1; j <= 100; j++) {
    row.append(
      ` <div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`
    );
    rowArray.push({
      "font-family" : "Noto Sans", 
      "font-size" : 14,
      "text" : "", 
      "bold" : false, 
      "italic" : false, 
      "underlined" : false, 
      "alignment" : "left", 
      "color" : "", 
      "bgcolor" : ""

    })
  }
  cellData.push(rowArray)
  $("#cells").append(row);
}

$("#cells").scroll(function (e) {
  $("#columns").scrollLeft(this.scrollLeft);
  $("#rows").scrollTop(this.scrollTop);
});

$(".input-cell").dblclick(function (e) {
  $(".input-cell.selected").removeClass(
    "selected top-selected bottom-selected left-selected right-selected"
  );
  $(this).addClass("selected")
  $(this).attr("contenteditable", "true");
  $(this).focus();
});
$(".input-cell");

function getRowCol(ele) {
  let id = $(ele).attr("id");
  let idArray = id.split("-");
  let rowId = parseInt(idArray[1]);
  let colId = parseInt(idArray[3]);
  return [rowId, colId];
}

function getTopLeftBottomRightCell(rowId, colId) {
  let topCell = $(`#row-${rowId - 1}-col-${colId}`);
  let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
  let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
  let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
  return [topCell, bottomCell, leftCell, rightCell];
}

$(".input-cell").click(function (e) {
  let [rowId, colId] = getRowCol(this);
  let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(
    rowId,
    colId
  );
  if ($(this).hasClass("selected") && e.ctrlKey) {
    unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
  } else {
    selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
  }
});

function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
  if ($(ele).attr("contenteditable") == "false") {
    if ($(ele).hasClass("top-selected")) {
      topCell.removeClass("bottom-selected");
    }
    if ($(ele).hasClass("bottom-selected")) {
      bottomCell.removeClass("top-selected");
    }
    if ($(ele).hasClass("left-selected")) {
      leftCell.removeClass("right-selected");
    }
    if ($(ele).hasClass("right-selected")) {
      rightCell.removeClass("left-selected");
    }
    $(ele).removeClass(
      "selected top-selected bottom-selected left-selected right-selected"
    );
  }
}

function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
  if (e.ctrlKey) {
    // top selected
    let topSelected;
    if (topCell) {
      topSelected = topCell.hasClass("selected");
    }
    //bottom selected
    let bottomSelected;
    if (bottomCell) {
      bottomSelected = bottomCell.hasClass("selected");
    }
    //left selected
    let leftSelected;
    if (leftCell) {
      leftSelected = leftCell.hasClass("selected");
    }
    //right selected
    let rightSelected;
    if (rightCell) {
      rightSelected = rightCell.hasClass("selected");
    }
    if (topSelected) {
      $(ele).addClass("top-selected");
      topCell.addClass("bottom-selected");
    }

    if (bottomSelected) {
      $(ele).addClass("bottom-selected");
      bottomCell.addClass("top-selected");
    }

    if (leftSelected) {
      $(ele).addClass("left-selected");
      leftCell.addClass("right-selected");
    }

    if (rightSelected) {
      $(ele).addClass("right-selected");
      rightCell.addClass("left-selected");
    }
  } else {
    $(".input-cell.selected").removeClass(
      "selected top-selected bottom-selected left-selected right-selected"
    );
  }
  $(ele).addClass("selected");
  changeHeader(getRowCol(ele))
}

function changeHeader([rowId, colId]){
  let data=cellData[rowId-1][colId-1];
  $(".alignment.selected").removeClass("selected");
  $(`.alignment[data-type=${data.alignment}]`).addClass("selected")
  if(data.bold){
    $('#bold').addClass("selected")
  }else{
    $('#bold').removeClass("selected")
  }
}


let startcellSelected = false;
let startCell = {};
let endCell = {};
let scrollXRStarted=false;
let scrollXLStarted=false;
let mouseMoved = false;
$(".input-cell").mousemove(function (e) {
  e.preventDefault();
 
  if (e.buttons == 1) {
    if(e.pageX>($(window).width()-100) && !scrollXRStarted){
      scrollXR();
    }
    else if(e.pageX<($(window).width()-100) && !scrollXLStarted){
      scrollXL();
    }
    if (!startcellSelected) {
      let [rowId, colId] = getRowCol(this);
      startCell = { "rowId": rowId, "colId": colId };
      selectAllBetweenCells(startCell,startCell);
      startcellSelected = true;
   
      // mouseMoved = true; 
    } 
  } else {
    startcellSelected = false;
    // mouseMoved = false;
  }
});

$(".input-cell").mouseenter(function (e) {
  if (e.buttons == 1) {
    if(e.pageX< ($(window).width()-10) && scrollXRStarted){
      clearInterval(scrollXRInterval);
      scrollXRStarted=false;
    }
    if(e.pageX > 10 && scrollXLStarted){
      clearInterval(scrollXLInterval);
      scrollXLStarted=false;
    }
    let [rowId, colId] = getRowCol(this);
    endCell = { rowId: rowId, colId: colId };
    selectAllBetweenCells(startCell, endCell);
  }
});
function selectAllBetweenCells(start, end) {
  $(".input-cell.selected").removeClass(
    "selected top-selected bottom-selected left-selected right-selected"
  );
  for (
    let i = Math.min(start.rowId, end.rowId);
    i <= Math.max(start.rowId, end.rowId);
    i++
  ) {
    for (
      let j = Math.min(start.colId, end.colId);
      j <= Math.max(end.colId, start.colId);
      j++
    ) {
      let [topCell, bottomCell, leftCell, rightCell] =
        getTopLeftBottomRightCell(i, j);

      selectCell(
        $(`#row-${i}-col-${j}`)[0],
        { ctrlKey: true },
        topCell,
        bottomCell,
        leftCell,
        rightCell
      );
    }
  }
}
let scrollXRInterval;
let scrollXLInterval;
function scrollXR(){
  scrollXRStarted = true;
  scrollXRInterval= setInterval(()=>{
    $("#cells").scrollLeft($("#cells").scrollLeft()+100)
   },100)
}

function scrollXL(){
  scrollXLStarted=true;
  scrollXLInterval= setInterval(()=>{
    $("#cells").scrollLeft($("#cells").scrollLeft()-100)
   },100)
}
$("#rows").mousemove(function(e){
  if(e.buttons==1){
    if(e.pageX>($(window).width()-100) && !scrollXRStarted){
      scrollXR();
    }
    else if(e.pageX<10 && !scrollXLStarted){
      scrollXL();
    }
  }
  
})
$(".data-container").mouseup(function(e){
  console.log("i am in")
  clearInterval(scrollXRInterval);
  clearInterval(scrollXLInterval);
  scrollXRStarted=false;
  scrollXLStarted=false;
  
})
$(".data-container").mouseup(function(e){
  console.log("i am in")
  clearInterval(scrollXRInterval);
  clearInterval(scrollXLInterval);
  scrollXRStarted=false;
  scrollXLStarted=false;
  
}) 



$(".alignment").click(function(e){
  let alignment = $(this).attr("data-type");
  $(".alignment.selected").removeClass("selected");
  $(this).addClass("selected");
  $(".input-cell.selected").css("text-align", alignment);
  $(".input-cell.selected").each(function(index, data){
    let [rowId, colId]=getRowCol(data);
    cellData[rowId-1][colId-1].alignment=alignment
  })
})

$("#bold").click(function(e){
  if($(this).hasClass("selected")){
    $(this).removeClass("selected");
    $(".input-cell.selected").css("font-weight", "") 
    $(".input-cell.selected").each(function(index, data){
      let [rowId, colId]=getRowCol(data);
      cellData[rowId-1][colId-1].bold=false;
    })
  }
  else{
    $(this).addClass("selected");
    $(".input-cell.selected").css("font-weight", "bold");
    $(".input-cell.selected").each(function(index, data){
      let [rowId, colId]=getRowCol(data);
      cellData[rowId-1][colId-1].bold=true;
    })


  }

})