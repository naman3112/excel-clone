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

for (let i = 1; i <= 100; i++) {
  let row = $(`<div class="cell-row"></div>`);
  for (let j = 1; j <= 100; j++) {
    row.append(
      ` <div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`
    );
  }
  $("#cells").append(row);
}

$("#cells").scroll(function (e) {
  $("#columns").scrollLeft(this.scrollLeft);
  $("#rows").scrollTop(this.scrollTop);
});

$(".input-cell").dblclick(function (e) {
  $(this).attr("contenteditable", "true");
  $(this).focus();
});

function getRowCol(ele){
    let id =$(ele).attr("id");
    let idArray=id.split("-");
    let rowId=parseInt(idArray[1]);
    let colId=parseInt(idArray[3]);
    return [rowId, colId];
}

function getTopLeftBottomRightCell(rowId,colId){
    let topCell=$(`#row-${ rowId-1}-col-${colId}`)
    let bottomCell=$(`#row-${rowId+1}-col-${colId}`)
    let leftCell=$(`#row-${rowId}-col-${colId-1}`)
    let rightCell=$(`#row-${rowId}-col-${colId+1}`)
    return [topCell, bottomCell, leftCell, rightCell];
}

$(".input-cell").click(function (e) {
    let [rowId, colId]=getRowCol(this);
    let [topCell, bottomCell, leftCell, rightCell]=getTopLeftBottomRightCell(rowId, colId)
    
    selectCell(this, e,topCell, bottomCell, leftCell, rightCell);
});

function selectCell(ele, e,topCell, bottomCell, leftCell, rightCell) {
  if (e.ctrlKey) {
      // top selected 
      let topSelected;
      if(topCell){
          topSelected=topCell.hasClass("selected");
      }
      //bottom selected 
      let bottomSelected;
      if(bottomCell){
          bottomSelected=bottomCell.hasClass("selected");
      }
      //left selected
      let leftSelected;
      if(leftCell){
          leftSelected=leftCell.hasClass("selected");
      }
      //right selected
      let rightSelected;
      if(rightCell){
          rightSelected=rightCell.hasClass("selected");
      }
      if(topSelected){
          $(ele).addClass("top-selected");
          topCell.addClass("bottom-selected");
      }

      if(bottomSelected){
        $(ele).addClass("bottom-selected");
        bottomCell.addClass("top-selected");
    }

    if(leftSelected){
        $(ele).addClass("left-selected");
        leftCell.addClass("right-selected");
    }

    if(rightSelected){
        $(ele).addClass("right-selected");
        rightCell.addClass("left-selected");
    }


  } else {
    $(".input-cell.selected").removeClass("selected");
   
  }
  $(ele).addClass("selected");
}
