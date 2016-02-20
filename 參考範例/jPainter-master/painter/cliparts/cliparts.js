/*  This script allows using specified images on the page as cliparts.
 *  Cliparts can be dragged and dropped on the DrawArea (in PC browsers only)
 *  or placed on the DrawArea by click (in any browser including tablet devices).
 *
 *  How to use:
 *   1. Include this script in your page
 *   2. For every image that you want to use as clipart set the attribute draggable="true"
 *   3. Create an instance of Painter object.
 *   4. Call initCliparts(painter,drawarea,x,y) passing to it your Painter object,
 *      the canvas element used as drawarea, and x,y coordinates
 *      where to put cliparts on the draw area when click is used.
 */
(function() {
    var initedSources = [];
    var initedTargets = [];

    window.initCliparts = function(painter,drawarea,click_x,click_y,options) {
	if (!options) options = {};

	function findElementPos(elem) {	    
	    var clientTop = document.documentElement.clientTop || document.clientTop || 0;
	    var clientLeft = document.documentElement.clientLeft || document.clientLeft || 0;	
	    var box = elem.getBoundingClientRect();
	    var top  = box.top  + window.pageYOffset - clientTop;
	    var left = box.left + window.pageXOffset - clientLeft;
	    return { 'x' : Math.round(left), 'y' : Math.round(top) };
	}
	
	function initSources() {
	    var images = document.getElementsByTagName('img');
	    for(var i=0; i < images.length; i++) {
		var image = images[i];
		if (image.getAttribute('draggable') && initedSources.indexOf(image) < 0) {
		    image.addEventListener('dragstart', function(event) {
			var element = event.target; 
			var srcPos = findElementPos(event.target);
			var dx = event.pageX-srcPos.x;
			var dy = event.pageY-srcPos.y;		
			var data = { 'url':element.getAttribute('src'), 'dx':dx, 'dy':dy };
			event.dataTransfer.setData('Text',JSON.stringify(data));
		    });

		    image.addEventListener('click', function(event) {
			var element = event.target; 
			// painter is undefined in frames
			if (painter) {
			    var x = click_x ? click_x : 0;
			    var y = click_y ? click_y : 0;
			    painter.putClipart(element.getAttribute('src'),x,y,options);
			}
		    });
		    initedSources.push(image);
		}
	    }
	}

	initSources();

	function initTarget(target) {
	    target.addEventListener('drop', function(event) {
		try {
		    var data = event.dataTransfer.getData('Text');
		    if (data) { // is '' in FF and null in IE when transfer from local drive
			var json = JSON.parse(data);
			var x = event.clientX-json.dx+window.pageXOffset;
			var y = event.clientY-json.dy+window.pageYOffset;
			var destPos = findElementPos(target);
			painter.putClipart(json.url,(x-destPos.x),(y-destPos.y),options);
		    }
		    else {
			if ('files' in event.dataTransfer) { // local files
			    for(var i=0; i < event.dataTransfer.files.length; i++) {
				var file = event.dataTransfer.files[i];
				if (file.type.match('image.*')) { // only process image files
				    var reader = new FileReader();
				    reader.onload = function(evt) {
					var pos = findElementPos(event.target);
					var x = event.clientX-pos.x;
					var y = event.clientY-pos.y;
					var image = new Image();
					image.onload = function() {
					    painter.putClipart(evt.target.result,x-image.width/2,y-image.height/2,options);
					};
					image.src = evt.target.result;
				    };
				    reader.readAsDataURL(file);
				}
			    }
			}
		    }
		}
		catch (e) {}
		event.preventDefault();
	    });
	    function cancelEvent(event) { event.preventDefault(); }
	    target.addEventListener('dragover',cancelEvent);
	    target.addEventListener('dragenter',cancelEvent);
	}


	if (initedTargets.indexOf(drawarea) < 0) {
	    initTarget(drawarea);
	    initedTargets.push(drawarea);
	}
    }
})();
