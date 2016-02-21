console.groupCollapsed('步驟1(載入網頁)');
var context;
var mode = 0;//0:正常 1:移動地圖
var shape = 0;//0:畫筆 1:直線 2:圓形 3:多邊形 4:矩形 5:橡皮擦
var leftbutton = false; //滑鼠左鍵是否按下
var startpoint = {
    x : 0,
    y : 0
}; //起點
var canvashistory = new Array();
var canvasstep = -1;
var rid = location.pathname.replace("/b/", "");
var uid;
// localStorage.setItem("Write's Brain", JSON.stringify({rid : rid, uid : uid}));
// if (localStorage.getItem("Write's Brain") != null) uid = JSON.parse(localStorage.getItem("Write's Brain")).uid;
// uid = uid == undefined ? prompt('ID:') : uid;
// window.onload = function() {
// };
function initCanvas() {
    context = canvas.getContext('2d');
    context.strokeStyle = $('#changestrokestyle').data('colorpicker').color;
    context.fillStyle = $('#changefillstyle').data('colorpicker').color;
    context.lineWidth = 5;
    context.lineJoin = 'round'; //bevel:斜角 miter:尖角
    context.lineCap = 'round'; //butt:平直 square:正方形
    clearCanvas();
    img = new Image();
    img.onload = function(){
        context.drawImage(img, 0, 0); // Or at whatever offset you like
        img = null;
    };
    img.src = '/room/' + rid + '_' + uid + '.png';
}
window.onresize = function() {
    resize();
};
function resize() { //保持畫布為視窗大小
    if (canvas.width < window.innerWidth) {
        canvas.width = window.innerWidth;
    }
    if (canvas.height < window.innerHeight) {
        canvas.height = window.innerHeight;
    }
}
function changeWidth() {
    _lineWidth = Number(prompt('請輸入畫筆寬度：'));
    if (_lineWidth != '') {
        _lineWidth = (_lineWidth < 1) ? 1 : _lineWidth;
        context.lineWidth = _lineWidth;
        preview.style.borderTopWidth = _lineWidth + "px";
        preview.style.borderRadius = _lineWidth+ "px";
    }
}
//滑鼠事件
document.onmousedown = function MouseDownHandler(e) {
    console.log('滑鼠按下%O', e);
    leftbutton = e.button == 0;
    // 選單自動消失
    if (contextMenu.style.display == "block" && (e.path.indexOf(contextMenu) > -1 && e.toElement.tagName != 'I' || e.toElement == canvas) && leftbutton) {
        contextMenu.style.display = "none";
        leftbutton = false;
    } else if (leftbutton && (e.toElement == canvas)) {
        startpoint.x = e.clientX;
        startpoint.y = e.clientY;
        if (mode == 0) {
            // cross(startpoint.x, startpoint.y, lineWidth);
            context.beginPath();
            context.moveTo(startpoint.x, startpoint.y);
        } else if (mode == 1) {
            preview.style.left = startpoint.x + "px";
            preview.style.top = startpoint.y + "px";
            preview.style.width = "0px";
            preview.style.display = "block";
        } else if (mode == 5){
            //要原地清空喔!!!
        }
    }
}
document.onmousemove = function MouseMoveHandler(e) {
    if (leftbutton) {
        if (mode == 0) {
            var x = e.clientX;
            var y = e.clientY;
            context.lineTo(x, y);
            context.stroke();//繪製路徑
        } else if (mode == 1) { //直線
            ab = Math.sqrt(Math.pow(e.clientX - startpoint.x, 2) + Math.pow(e.clientY - startpoint.y, 2))+ context.lineWidth;
            preview.style.width = ab + "px"; //線長
            rad = Math.atan((startpoint.y - e.clientY) / (startpoint.x - e.clientX));
            // console.log("神奇的角度:" + rad * 180 / Math.PI); //顯示角度
            previewmargin = {
                x: ((startpoint.x < e.clientX ? -1 : 1) * Math.sin(rad) - 1) * context.lineWidth / 2,
                y: (startpoint.x < e.clientX ? -1 : 1) * Math.cos(rad) * context.lineWidth / 2
            };
            preview.style.margin = previewmargin.x + "px " + previewmargin.y + "px";
            preview.style.transform = "rotate(" + (rad + ((startpoint.x >= e.clientX) ? Math.PI : 0)) + "rad)";//rad
        } else if (mode == 5) { //eraser
            eraser(e.clientX, e.clientY, context.lineWidth);
            startpoint = {
                x : e.clientX,
                y : e.clientY
            };
        }
    }
}
document.onmouseup = function MouseUpHandler(e) {
    console.log('滑鼠放開%O', e);
    if (leftbutton) {
        leftbutton = e.button != 0;
        if (!leftbutton){
            if (mode = 0) {
                context.lineTo(e.clientX, e.clientY);
                context.stroke();//繪製路徑
                context.closePath();
            } else if (mode == 1) {
                preview.style.display = "none";
                line = false;
            }
            canvaspush("MouseUp");
        }
    }
}
document.onmousewheel = function MousewhellHandler(e) {
    console.log("滾輪滾動:%O", e);
}
// 右鍵選單
document.oncontextmenu = function ContextMenuHandler(e) {
    contextMenu.style.display = "block";
    contextMenu.style.left = e.clientX + "px";
    contextMenu.style.top = e.clientY + "px";
    e.preventDefault();
}
function checkStatus() {
        Date.parse(Date()) < Date.parse("2016-02-20 18:33.00");
}
function upload() {
    $.ajax({
        url: '/b/' + rid,
        data: {
            user_id : uid,
            DataURL : canvas.toDataURL()
        },
        type: 'POST',
        success: function(response) {
            console.log('上傳成功!!' + response);
        },
        error: function(error) {
            console.log('上傳錯誤:' + error);
        }
    });
}
// 畫十字(debug)
function cross(x, y, size) {
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(x - size / 2, y);
    context.lineTo(x + size / 2, y);
    context.moveTo(x, y - size / 2);
    context.lineTo(x, y + size / 2);
    context.stroke();//繪製路徑
    context.closePath();
    context.lineWidth = size;
}
// 加入步驟
function canvaspush(summary) {
    summary = summary || "";
    canvasstep ++;
    if (canvasstep < canvashistory.length){
        canvashistory.length = canvasstep;
    }
    canvashistory.push(context.getImageData(0, 0, canvas.width, canvas.height));
    console.log("步驟%d%s:%O", (canvasstep + 1), summary != '' ? '(' + summary + ')' : '', canvashistory);
    console.groupEnd()
    console.groupCollapsed("步驟" + (canvasstep + 2))
    upload();
}
// 上一步
function undo() {
    clearCanvas();
    // 基本圖
    if (canvasstep >= 0) {
        console.log("回到步驟%d:%O", canvasstep, context);
        canvasstep --;
    } else {
        console.assert(canvasstep > -1, "已回復到最前面(步驟" + (canvasstep + 1) + "/" + canvashistory.length + ")");
    }
    if (canvasstep >= 0) {
        context.putImageData(canvashistory[canvasstep], 0, 0);
    }
    upload();
}
// 下一步
function redo() {
    // 基本圖
    if (canvasstep < canvashistory.length - 1) {
        clearCanvas();
        canvasstep ++;
        console.log("重做步驟" + (canvasstep + 1));
        context.putImageData(canvashistory[canvasstep], 0, 0);
    } else {
        console.assert(canvasstep, canvashistory.length - 1);
        console.assert(canvasstep < canvashistory.length - 1, "已重做所有動作(步驟" + (canvasstep + 1) + "/" + canvashistory.length + ")");
    }

}
// 清空畫布
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
// 橡皮擦
function eraser(_x, _y, _size) {
    if (startpoint.x != 0 && startpoint.y != 0) {
        //获取两个点之间的剪辑区域四个端点
        var asin = _size * Math.sin(Math.atan((_y - startpoint.y) / (_x - startpoint.x)));
        var acos = _size * Math.cos(Math.atan((_y - startpoint.y) / (_x - startpoint.x)));
        var x3 = startpoint.x + asin;
        var y3 = startpoint.y - acos;
        var x4 = startpoint.x - asin;
        var y4 = startpoint.y + acos;

        var x5 = _x + asin;
        var y5 = _y - acos;
        var x6 = _x - asin;
        var y6 = _y + acos;

        // //清除兩點間矩形內容
        context.save();
        context.beginPath();
        context.moveTo(x3, y3);
        context.lineTo(x5, y5);
        context.lineTo(x6, y6);
        context.lineTo(x4, y4);
        context.closePath();
        context.clip(); //剪下
        clearCanvas();
        context.restore();

        // 清除當下點
        context.save();
        context.beginPath();
        context.arc(_x, _y, _size, 0, 2 * Math.PI);
        context.closePath();
        context.clip(); //剪下
        clearCanvas();
        context.restore();
    }
}
// 鍵盤監控
window.onkeydown = function KeyDownHander(e) {
    console.log('按鍵：' + (e.ctrlKey ? 'Ctrl' + (e.keyCode == 13 ? '' : '+') : '') + String.fromCharCode(e.keyCode) + '(' + e.keyCode + ')', e);
    if (e.keyCode == 116) { // F5
        // initCanvas();
        // e.preventDefault();
    } else if (e.keyCode == 122) { // F11
        toggleFullScreen();
        e.preventDefault();
    } else if (e.keyCode == 123) { // F12
        // prompt('請輸入主控台密碼(誤)：')
    } else if (e.keyCode == 90 && e.ctrlKey) { // Ctrl + Z
        undo();
        e.preventDefault();
    } else if (e.keyCode == 89 && e.ctrlKey) { // Ctrl + Y
        redo();
        e.preventDefault();
    } else if (e.ctrlKey) {
    } else {
        // e.preventDefault();
    }
}
window.onkeyup = function KeyUpHander(e) {
    console.log('放開按鍵：' + (e.ctrlKey ? 'Ctrl' + (e.keyCode == 13 ? '' : '+') : '') + String.fromCharCode(e.keyCode) + '(' + e.keyCode + ')', e);
}
// 全螢幕
function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && ! document.msFullscreenElement ) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}