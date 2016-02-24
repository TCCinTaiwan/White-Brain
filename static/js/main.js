console.groupCollapsed('步驟1(載入網頁)');
var context;
var mode = -1; //0:正常 1:移動地圖
var shape = -1; //0:畫筆 1:直線 2:圓形 3:多邊形 4:矩形 5:橡皮擦
var leftbutton = false; //滑鼠左鍵是否按下
var startpoint = {
    x: 0,
    y: 0
}; //起點
var canvashistory = [];
var canvasstep = -1;
var rid = location.pathname.replace("/b/", "");
var uid;
// 初始化畫布
function initCanvas() {
    context = canvas.getContext('2d');
    clearCanvas();
    var img = new Image();
    map.onload = function imgLoadHander() {
        context.drawImage(map, 0, 0); // Or at whatever offset you like
    };
    img.src = '/room/' + rid + '_' + uid + '.png?' + new Date().getTime();
    map.src = img.src;
}
window.onresize = function ResizeHander() {
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
//  首先來獲取觸發onMouseOut事件的元素，IE下通過event的toElement屬性來獲得，firefox下通過event的relatedTarget屬性來獲得。
// IE：event.toElement ，Firefox：event.relatedTarget（注意：Firefox下的event須通過在函數調用時傳入，而IE下的event則可以直接通過window.event系統對象來獲得)
//  ①　接下來就是判斷獲取的元素是否是主體div的子元素（IE下可以通過元素的obj.contains(element)方法來判斷，但Firefox下沒有這個方法，所以需要給firefox定義元素的obj.contains()方法）。
// 代碼如下：
if(typeof(HTMLElement) != "undefined") { // 給firefox定義contains()方法，IE已經系統自帶有這個方法了
    HTMLElement.prototype.contains = function(obj) {
        while(obj != null && typeof(obj.tagName) != "undefind") { // 通過循環對比來判斷是不是obj的父元素
            if(obj == this) {
                return true;
            }
            obj = obj.parentNode;
        }
        return false;
    };
}
// ③　到此為止所有要解決的問題都得到了解決，當觸發onMouseOut事件時，我們將針對不同的瀏覽器先獲取滑鼠到達的元素，然後通過判斷該元素是否在信息欄(div)內，如果元素是子元素，那麼不執行onMouseOut事件，反之則執行事件，隱藏信息欄，完成後的代碼如下：
function hideMsgBox(theEvent) { //theEvent用來傳入事件，Firefox的方式
    if (theEvent) {
        var browser=navigator.userAgent; //取得瀏覽器屬性
        if (browser.indexOf("Firefox")>0) { //如果是Firefox
            if (document.getElementById('MsgBox').contains(theEvent.relatedTarget)) {//如果是子元素
                return; //結束函數
            }
        }
        if (browser.indexOf("MSIE")>0){ //如果是IE
            if (document.getElementById('MsgBox').contains(event.toElement)) { //如果是子元素
                return; //結束函數
            }
        }
    }
    /*要執行的操作（如：隱藏）*/
    document.getElementById('MsgBox').style.display='none' ;
}

// ④　在信息欄(Div)上設置onMouseOut=hideMsgBox(event)來調用。
function FireFoxEvent(e) {
    if (e.path == undefined) {
        e.path = [];
        var obj = e.target;
        while (obj != null) {
            e.path[e.path.lenght] = obj;
            obj = obj.parentNode;
        }
        e.path[e.path.lenght] = window;
    }
    e.offsetX = (e.offsetX == undefined) ? e.layerX : e.offsetX;
    e.offsetY = (e.offsetY == undefined) ? e.layerY : e.offsetY;
    e.toElement = e.toElement || e.relatedTarget || e.target || function () { throw "Failed to attach an event target!"; }
    return e
}
//滑鼠事件
document.onmousedown = function MouseDownHandler(e) {
    e = FireFoxEvent(e || window.event);
    console.log('滑鼠按下%O', e);
    temp1 = e; //DDDDDDDDDDDDDDeBug
    leftbutton = e.button == 0;
    if (leftbutton) {
        if (contextMenu.style.display == "block" && (e.path.indexOf(contextMenu) > -1 && e.toElement.tagName != 'I' || e.toElement == canvas)) { // 選單取消
            contextMenu.style.display = "none";
            leftbutton = false; //假如是取消選單就不執行左鍵
        } else if ((e.toElement == canvas)) {
            startpoint.x = e.clientX;
            startpoint.y = e.clientY;
            startpoint = {
                x: e.offsetX,
                y: e.offsetY
            }
            // cross(startpoint.x, startpoint.y, lineWidth);
            if (shape == 0) { //鉛筆
                console.count("beginPath");
                context.beginPath(); //
                context.moveTo(startpoint.x, startpoint.y);
            } else if (shape == 1) { //直線
                preview.style.left = startpoint.x + "px";
                preview.style.top = startpoint.y + "px";
                preview.style.width = "0px";
                preview.style.display = "block";
            } else if (shape == 5){
                //要原地清空喔!!!
            }
        }
    }
}
document.onmousemove = function MouseMoveHandler(e) {
    e = FireFoxEvent(e || window.event);
    if (leftbutton) {
        if (shape == 0) {
            var x = (e.offsetX == undefined) ? e.layerX : e.offsetX;
            var y = (e.offsetY == undefined) ? e.layerY : e.offsetY;
            context.lineTo(x, y);
            context.stroke(); //繪製路徑
        } else if (shape == 1) { //直線
            ab = Math.sqrt(Math.pow(e.clientX - startpoint.x, 2) + Math.pow(e.clientY - startpoint.y, 2)) + context.lineWidth;
            preview.style.width = ab + "px"; //線長
            rad = Math.atan((startpoint.y - e.clientY) / (startpoint.x - e.clientX));
            // console.log("神奇的角度:" + rad * 180 / Math.PI); //顯示角度
            previewmargin = {
                x: ((startpoint.x < e.clientX ? -1 : 1) * Math.sin(rad) - 1) * context.lineWidth / 2,
                y: (startpoint.x < e.clientX ? -1 : 1) * Math.cos(rad) * context.lineWidth / 2
            };
            preview.style.margin = previewmargin.x + "px " + previewmargin.y + "px";
            preview.style.transform = "rotate(" + (rad + ((startpoint.x >= e.clientX) ? Math.PI : 0)) + "rad)"; //rad
        } else if (shape == 5) { //橡皮擦
            eraser(e.clientX, e.clientY, context.lineWidth);
            startpoint = {
                x : e.clientX,
                y : e.clientY
            };
        }
    }
}
document.onmouseup = function MouseUpHandler(e) {
    e = FireFoxEvent(e || window.event);
    console.log('滑鼠放開%O', e);
    if (e.button == 0 && leftbutton) {
        leftbutton = false;
        if (shape == 0) {
            context.lineTo(e.clientX, e.clientY);
            context.stroke(); //繪製路徑
            console.count("closePath");
            context.closePath(); //
        } else if (shape == 1) {
            console.count("beginPath");
            context.beginPath();
            context.moveTo(startpoint.x, startpoint.y);
            context.lineTo(e.clientX, e.clientY);
            context.stroke(); //繪製路徑
            console.count("closePath");
            context.closePath(); //
            preview.style.display = "none";
        } else if (shape == 2) { //圓形
            console.count("beginPath");
            context.beginPath();
            context.arc(
                startpoint.x,
                startpoint.y,
                Math.sqrt(
                    Math.pow(
                        startpoint.x - e.clientX,
                        2
                    ) +
                    Math.pow(
                        startpoint.y - e.clientY,
                        2
                    )
                ),
                0,
                Math.PI * 2,
                true
            );
            console.count("closePath");
            context.closePath();
            context.stroke();
            preview.style.display = "none";
        } else if (shape == 4) { //矩形
            console.count("beginPath");
            context.beginPath();
            context.strokeRect(
                startpoint.x,
                startpoint.y,
                e.clientX - startpoint.x,
                e.clientY - startpoint.y
            );
            console.count("closePath");
            context.closePath();
            preview.style.display = "none";
        }
        canvaspush("MouseUp");
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
        success: function _uploadsuccess(response) {
            console.log('上傳成功!!' + response);
            initCanvas();
        },
        error: function _uploaderror(error) {
            console.log('上傳錯誤:' + error);
        }
    });
}
// 畫十字(debug)
function cross(x, y, size) {
    console.count("beginPath");
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(x - size / 2, y);
    context.lineTo(x + size / 2, y);
    context.moveTo(x, y - size / 2);
    context.lineTo(x, y + size / 2);
    context.stroke(); //繪製路徑
    console.count("closePath");
    context.closePath();
    context.lineWidth = size;
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
function changeRoom() {
    rid = prompt('房間ID:');
    if (rid != null){
        location.pathname = "/b/" + rid;
        localStorage.setItem("Write's Brain", JSON.stringify({rid: rid, uid: uid}));
    }
}
function changeShape() {
    shapeList = [
        "<i class='fa fa-pencil'></i> 畫筆",
        "<i class='fa fa-minus'></i> 直線",
        "<i class='fa fa-circle-thin'></i> 圓",
        "<span style='color:red'><i class='fa fa-square-o'></i> 多邊形</span>",
        "<i class='fa fa-star-o'></i> 矩形",
        "<i class='fa fa-eraser'></i> 橡皮擦"
    ];
    shape = (shape + 1) % shapeList.length; // 形狀(0~5)
    changeshape.innerHTML = shapeList[shape];
}
function changeMode() {
    modeList = [
        "<i class='fa fa-mouse-pointer'></i> 正常",
        "<span style='color:red'><i class='fa fa-arrows'></i> 移動</span>"
    ];
    mode = (mode + 1) % modeList.length; //模式(0~2)
    changemode.innerHTML = modeList[mode];
}
// 清空畫布
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
// 加入步驟
function canvaspush(summary) {
    summary = summary || "";
    canvasstep ++;
    if (canvasstep < canvashistory.length){
        canvashistory.length = canvasstep;
    }
    canvashistory.push(context.getImageData(0, 0, canvas.width, canvas.height));
    console.log("步驟%d%s: %O", (canvasstep + 1), summary != '' ? '(' + summary + ')' : '', canvashistory);
    console.groupEnd();
    console.groupCollapsed("步驟" + (canvasstep + 2) + (summary != '' ? '(' + summary + ')' : ''));
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
        console.warn(canvasstep > -1, "已回復到最前面(步驟" + (canvasstep + 1) + "/" + canvashistory.length + ")");
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
        console.warn(canvasstep < canvashistory.length - 1, "已重做所有動作(步驟" + (canvasstep + 1) + "/" + canvashistory.length + ")");
    }

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
        console.count("beginPath");
        context.beginPath();
        context.moveTo(x3, y3);
        context.lineTo(x5, y5);
        context.lineTo(x6, y6);
        context.lineTo(x4, y4);
        console.count("closePath");
        context.closePath();
        context.clip(); //剪下
        clearCanvas();
        context.restore();

        // 清除當下點
        context.save();
        console.count("beginPath");
        context.beginPath();
        context.arc(_x, _y, _size, 0, 2 * Math.PI);
        console.count("closePath");
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
        // prompt('請輸入主控台密碼(誤)：');
    } else if (e.keyCode == 90 && e.ctrlKey) { // Ctrl + Z
        undo();
        e.preventDefault();
    } else if (e.keyCode == 89 && e.ctrlKey) { // Ctrl + Y
        redo();
        e.preventDefault();
    } else if (e.keyCode == 9) { // Tab
        changeShape();
        e.preventDefault();
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