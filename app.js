const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const brushThickness = document.getElementById("brush-thickness");
const color = document.getElementById("color");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const drawBtn = document.getElementById("draw-btn");
const fillBtn = document.getElementById("fill-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save");

canvas.width = 700;   //resetting the size in CSS causes up with cursor and drawing gap
canvas.height = 700;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

// multi line selection shift, option, i

  let isPainting = false;

  const PENCIL_MODE = 0;
  const FILL_MODE = 1;
  const ERASE_MODE = 2;
  const TEXT_MODE = 3;
  let mode = PENCIL_MODE;


  // update the mode and set the cursor image.
function setTools(newMode){
    mode = newMode;
    if (mode == PENCIL_MODE){
        canvas.style.cursor = "url(icons/pencil.png) 0 22, auto";
    }else if(mode == FILL_MODE){
        canvas.style.cursor = "url(icons/paint.png), auto";
    }else if(mode == ERASE_MODE){
        canvas.style.cursor = "url(icons/eraser.png) 0 22, auto";
    }else if(mode == TEXT_MODE){
        canvas.style.cursor = "default";
    }else{
        canvas.style.cursor = auto;
    }
}
  // draw when user clicks and drag (like normal drawing board.)
function onMove(event){
    if(mode == ERASE_MODE){
        ctx.strokeStyle = "white";
    }else{
        ctx.strokeStyle = color.value;
    }
   if (isPainting && mode != TEXT_MODE) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
   }else{
    // text, fill, shapes should happen from this coordinate.
    ctx.moveTo(event.offsetX, event.offsetY);
   }
}

function onCanvasClick(event){
   if (mode == FILL_MODE) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   }
}
function changeColor(event){
    ctx.strokeStyle = event.target.value;
}

function onMouseDown(){
    isPainting = true;
}

function cancelPainting(){
    isPainting = false;
    ctx.beginPath();
}

function changeWidth(event){
    ctx.lineWidth = event.target.value;
    brushThickness.textContent = event.target.value;
}

function onColorClicked(event){
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

function onDrawClick(){
    // make sure the icon is very small, otherwise it simply doesn't work.
    // the x y coordinates must not be outside the pixel size of the image
    // otherwise it simply does not work.
    setTools(PENCIL_MODE);
}

function onFillClick(){
    setTools(FILL_MODE);
}

function onDestroyClick(){
    if (confirm("Click OK to destroy your work")){
        // destroy the canvas only when confirmed.
        let originalColor = ctx.fillStyle;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = originalColor;
        isFilling = false;
    }
}

function onEraserClick(){
    ctx.strokeStyle = "white";
    setTools(ERASE_MODE);
    mode = ERASE_MODE;
}
function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    
    image.onload = function () {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        fileInput.value = null;
      };
}

function onDoubleClick(event){
    let text = textInput.value;
    if (text !== ""){
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "48px serif";
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore();
    }
}

function onTextboxClick(){
    setTools(TEXT_MODE);
    isPainting = false;
}

function onSave(){
    const url = canvas.toDataURL();
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "myDrawing.png";
    anchor.click();
}


canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
setTools(PENCIL_MODE);

lineWidth.addEventListener("input", changeWidth);
color.addEventListener("input", changeColor);

colorOptions.forEach((color) => color.addEventListener("click", onColorClicked));
drawBtn.addEventListener("click", onDrawClick);
fillBtn.addEventListener("click", onFillClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
textInput.addEventListener("click", onTextboxClick);
canvas.addEventListener("dblclick", onDoubleClick);
saveBtn.addEventListener("click", onSave);

// crosshair for shape cursor