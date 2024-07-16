const canvas = document.querySelector('canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorPicker = document.querySelector('#color-picker'),
clearBtn = document.querySelector('.clear-canvas'),
colorBtn = document.querySelectorAll('.colors .option'),
saveBtn = document.querySelector('.save-img'),
ctx = canvas.getContext('2d');

let prevMouseX, prevMouseY,snapshot,
isDrawing = false,
secectedTool = 'brush',
brushSize = 5,
selectedColor = 'black';

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBg();
});

const drawRect = (e) => {

    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);

}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, Math.PI * 2);
    if (!fillColor.checked) {
        ctx.stroke();
    }else{
        ctx.fill();
    }
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX + (prevMouseX - e.offsetX), e.offsetY);
    ctx.closePath();
    if (!fillColor.checked) {
        ctx.stroke();
    }else{
        ctx.fill();
    }
}

const startDraw = (e) => {
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if (secectedTool === 'brush' || secectedTool === 'eraser') {
        ctx.strokeStyle = secectedTool === 'brush' ? selectedColor : 'white';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();  
    }else if (secectedTool === 'rectangle') {
        drawRect(e);
    }else if (secectedTool === 'circle') {
        drawCircle(e);
    }else if (secectedTool === 'triangle') {
        drawTriangle(e);
    }  
    
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        secectedTool = btn.id;
        console.log(btn.id);
    });
});

colorPicker.addEventListener('change', () =>{
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
});

const setCanvasBg = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}
    

sizeSlider.addEventListener('change', () => brushSize= sizeSlider.value);

colorBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');

    });
});

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => isDrawing = false);

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBg();
});
saveBtn.addEventListener('click', () => {
    const data = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = data;
    a.download = 'image.png';
    a.click();
});