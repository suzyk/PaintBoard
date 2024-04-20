const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const modeBtn = document.getElementById("mode-btn");
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
  let isFilling = false;

  // draw when user clicks and drag (like normal drawing board.)
function onMove(event){

   if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
   }else{
    ctx.moveTo(event.offsetX, event.offsetY);
   }
}

function onCanvasClick(event){
   if (isFilling) {
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
}

function onColorClicked(event){
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

function onModeClick(event){
    if (isFilling){
        isFilling = false;
        modeBtn.innerText = "Fill";
    }else {
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
}

function onDestroyClick(){
    let originalColor = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = originalColor;
    modeBtn.innerText = "Fill";
    isFilling = false;
}

function onEraserClick(){
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
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

lineWidth.addEventListener("input", changeWidth);
color.addEventListener("input", changeColor);

colorOptions.forEach((color) => color.addEventListener("click", onColorClicked));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
canvas.addEventListener("dblclick", onDoubleClick);
saveBtn.addEventListener("click", onSave);

