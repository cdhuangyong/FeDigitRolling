function FeDigitRolling(options){

	options = this.options = options || {};
	this.container = options.container || null;
	this.fontSize = options.fontSize;
	this,fontFamily = options.fontFamily;
	this.number = options.number || 0;
	this.padding = options.padding || [5,5,5,5];
	this.gap = options.gap == undefined ? 3 : options.gap;
	this.width = options.width || 100;
	this.height = options.height || 50;
	this.color = options.color || "white";
	this.bgColor = options.bgColor || "black";
	this.maxWidth = options.maxWidth || 200;
	this.format = options.format || "n"; // "f"
	this.block1 = {};
	this.block2 = {};
	this.block3 = {};
	this.len = 0;
	this.times = options.times || 1;
	this.sub_groups = {};
	this.blockTween = {};
	this.initScene();
	
}

FeDigitRolling.prototype = {
	constructor:FeDigitRolling,
	initScene:function(){
		var  group= this.createElementObject();
		var camera  = this.camera= new THREE.OrthographicCamera( this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 1000 );
		var scene = this.scene = new THREE.Scene();
		var renderer = this.renderer = new THREE.CSS3DRenderer();
		renderer.setSize(this.width , this.height);
		scene.add(group);
		this.group = group;
		this.container.appendChild(renderer.domElement);
		this.animate();
		renderer.render(scene,camera);
	},
	createElementObject:function(){
		var number = this.number.toString();
		var formatSymbol = this.options.formatSymbol || ",";
		
		var hasDot = number.indexOf(".") > -1;
		var symbolLength = hasDot ? 1 : 0;
		if(this.format == "f"){
			var strArr = number.split("");
			var nStrArr = [];
			var count = 0;
			for(var i = strArr.length - 1 ; i >= 0 ; i --){
				nStrArr.unshift(strArr[i]);
				if(hasDot){
					if(i < number.indexOf(".")){
						count ++;
					}
				}else{
					count ++;
				}
				if(count != 0 && count % 3 == 0 && i != 0){
					nStrArr.unshift(formatSymbol);
					symbolLength++;
				}
			} 
			number = nStrArr.join("");
		}
		var len = number.length;
		var group = this.group || new THREE.Group();
		var x,y;
		var pl = this.padding[3];
		var pr = this.padding[1];
		var pt = this.padding[0];
		var pb = this.padding[2];
		
		var w = (this.width - this.gap * (len - 1) )  / len;
		w = w > this.maxWidth ? this.maxWidth : w;
		var fontSize = w - (pr + pl);
		//var w = fontSize +  (pr + pl );
		var fwidth = symbolLength > 0 ? ( w + ( w / 2)  / ( len-1 ) * symbolLength ) : w;
		var dotWidth = fwidth / 2;
		var fheight = this.height;

		var aw = symbolLength > 0 ? ( fwidth * (len - symbolLength  ) + dotWidth * symbolLength ) :  fwidth * (len);

		var startx = - aw / 2; 
		if(len < this.len){
			this.clear(len,this.len);
		}
		for (var i = 0; i < len ; i++) {
			var c = number.charAt(i);
			this.createOrUpdateObj(i,c,symbolLength > 0,dotWidth,fwidth,fheight,fontSize,startx,group);
			startx += (c == "." || c == "," ? dotWidth : fwidth) + this.gap - 0.05 * i;
		}
		this.len = len;
		return group
	},
	clear:function(start,end){
		for (var i = start; i <= end - 1; i++) {
			this.group.remove( this.sub_groups[i]);
			var nodes = document.getElementsByClassName("node-"+i);
			while(nodes.length != 0){
				nodes.item(0).parentNode.removeChild(nodes.item(0));
			}
			delete this.block1[i];
			delete this.block2[i];
			delete this.block3[i]; 
			delete this.blockTween[i];               }
	},
	changeValue:function(number,times){
		if(!number && number !== 0)return;
		this.times = times || 1;
		this.number = number;
		this.createElementObject();
	},
	createOrUpdateObj:function(index,c,hasDot,dotWidth,fwidth,fheight,fontSize,startx,parent){
		var _this = this;
		//上面第一张
		var group = new THREE.Group();
		var el,object,obj;
		fontSize = this.fontSize || fontSize;
		if(this.block1[index] ){

			el = this.block1[index].el;
			this.block1[index].lastValue = this.block1[index].value;
			this.block1[index].value = c;
			el.style.width = (c == "." || c == "," ? dotWidth : fwidth) + "px";
			el.style.height = fheight / 2 + "px";
			el.style.fontSize = fontSize + "px";

			object = this.block1[index].cssobject;
			object.position.x = startx + (c == "."  || c == ","? dotWidth : fwidth) / 2;

		}else{
			el = document.createElement("div");
			el.style.width = (c == "." || c == "," ? dotWidth : fwidth) + "px";
			el.style.height = fheight / 2 + "px";
			el.style.lineHeight = fheight + "px";
			el.style.color =  this.color;
			el.style.textAlign = "center";
			el.style.backgroundColor = this.bgColor;
			el.style.fontSize = fontSize + "px";
			el.style.transition = "width 1s";
			el.style.overflow = "hidden";
			el.innerText = "0";
			el.className = "fedigit_node node-"+index;
			object = new THREE.CSS3DObject(el);
			object.position.x = startx + (c == "." || c == "," ? dotWidth : fwidth) / 2;
			object.position.y = 0;//fheight / 2;
			object.position.z = 0.0001 ;
			//object.rotation.x = Math.PI / 4;
			object.translateY(fheight / 2 / 2);

			obj = new THREE.Object3D();
			obj.add(object);
			obj.position.set(0,0,0);
			this.block1[index] = {
				fheight:fheight,
				fwidth:fwidth,
				lastValue:0,
				obj : obj,
				el : el,
				cssobject:object,
				value:c,
				order:3
			};
			group.add(obj);
		}

		if(this.block2[index] ){

			el = this.block2[index].el;
			this.block2[index].lastValue = this.block2[index].value;
			this.block2[index].value = c;
			el.style.width = (c == "." || c == "," ? dotWidth : fwidth) + "px";
			el.style.height = fheight / 2 + "px";
			el.style.fontSize = fontSize + "px";

			object = this.block2[index].cssobject;
			object.position.x = startx + (c == "." || c == "," ? dotWidth : fwidth) / 2;

		}else{

			el = document.createElement("div");
			el.style.width = (c == "." || c == "," ? dotWidth : fwidth) + "px";
			el.style.height = fheight / 2 + "px";
			el.style.color = this.color;
			el.style.lineHeight = fheight + "px";
			el.style.textAlign = "center";
			el.style.backgroundColor = this.bgColor;
			el.style.fontSize = fontSize + "px";
			el.style.transition = "width 1s";
			el.style.overflow = "hidden";
			el.innerText = "0";
			el.className = "fedigit_node node-"+index;
			object = new THREE.CSS3DObject(el);
			object.position.x = startx + (c == "." || c == "," ? dotWidth : fwidth) / 2;
			object.position.y = 0;//fheight / 2;
			object.position.z = 0.0001 ;
			//object.rotation.x = Math.PI / 4;
			object.translateY(fheight / 2 / 2);

			obj = new THREE.Object3D();
			obj.add(object);
			obj.position.set(0,0,0);
			this.block2[index] = {
				fheight:fheight,
				fwidth:fwidth,
				lastValue:0,
				obj : obj,
				el : el,
				cssobject:object,
				value:c,
				order:0
			};
			group.add(obj);
		}

		if(this.block3[index] ){

			el = this.block3[index].el;
			this.block3[index].lastValue = this.block3[index].value;
			this.block3[index].value = c;
			el.style.width = (c == "." || c == "," ? dotWidth : fwidth) + "px";
			el.style.height = fheight / 2 + "px";
			el.style.fontSize = fontSize + "px";

			object = this.block3[index].cssobject;
			object.position.x = startx + (c == "." || c == "," ? dotWidth : fwidth) / 2;

		}else{
			el = document.createElement("div");
			el.style.width = (c == "." || c == "," ? dotWidth : fwidth) + "px";
			el.style.height = fheight / 2 + "px";
			el.style.color = this.color;
			el.style.lineHeight = 0 + "px";
			el.style.textAlign = "center";
			el.style.backgroundColor = this.bgColor;
			el.style.fontSize = fontSize + "px";
			el.style.transition = "width 1s";
			el.style.overflow = "hidden";
			el.innerText = "0";
			el.className = "fedigit_node node-"+index;
			object = new THREE.CSS3DObject(el);
			object.position.x = startx + (c == "." || c == "," ? dotWidth : fwidth) / 2;
			object.position.y = 0;//fheight / 2;
			object.position.z = 0.00001 ;
			//object.rotation.x = Math.PI / 4;
			object.translateY(-fheight / 2 / 2);

			obj = new THREE.Object3D();
			obj.add(object);
			obj.position.set(0,0,0);
			this.block3[index] = {
				fheight:fheight,
				fwidth:fwidth,
				lastValue:0,
				obj : obj,
				el : el,
				cssobject:object,
				value:c,
				order:1
			};
			group.add(obj);
			parent.add(group);
			this.sub_groups[index] = group;
		}

		var arr = [this.block1[index],this.block2[index],this.block3[index]].sort(function(a,b){
			return a.order - b.order;
		});


		this.animateBlock(arr[0],arr[1],arr[2],index);

	},
	animate:function(){
		var _this = this;
		function fn(){
			TWEEN.update(); 
			_this.renderer.render(_this.scene,_this.camera);
			requestAnimationFrame(fn);
		}
		fn();
	},
	animateBlock:function(a,b,c,index,repeat,times,lastValue){
		var _this = this;

		var times =  times || this.times;

		if(times == "auto" && !repeat){
			times = parseInt(1 + Math.random() * 8);
		}

		var lastValue = repeat ? lastValue : a.lastValue;
		var value = times > 1 ? parseInt(Math.random() * 10) : a.value;

		
		if(!repeat && a.value == a.lastValue)return;
		
		a.cssobject.position.z = a.obj.position.z = 0;
		b.cssobject.position.z = a.obj.position.z = -1;
		c.cssobject.position.z = a.obj.position.z = -0.5;
		
		a.el.innerText = lastValue
		b.el.innerText = lastValue;
		c.el.innerText = value;

		if(a.value == "." || a.value == "," ){
			times = 1;
			value = a.value;
			c.el.innerText = value;
			/*
			*/	
		}

		if(this.blockTween[index] && !repeat){
			this.blockTween[index].stop();
		}

		var isswitch = false;
		var tween = new TWEEN.Tween(a.obj.rotation)
		.to({ x: Math.PI }, 500)
		.onUpdate(function(t) {
			if(!isswitch && t >= 0.5){
				a.el.innerText = value;
				a.el.style.lineHeight = 0 + "px";
				a.cssobject.rotation.z = Math.PI;
				a.cssobject.rotation.y = Math.PI;
				isswitch = true;
			}
		})
		.onComplete(function(){
			a.el.style.lineHeight = 0 + "px";
			a.cssobject.rotation.z = 0;
			a.cssobject.rotation.y = 0;
			//console.log(a.obj);
			a.obj.rotation.x = 0;
			a.cssobject.translateY(-b.fheight / 2 / 2);
			a.cssobject.translateY(-b.fheight / 2 / 2);

			b.el.style.lineHeight = b.fheight + "px";

			b.cssobject.translateY(b.fheight / 2 / 2);
			b.cssobject.translateY(b.fheight / 2 / 2);

			a.order = 1;
			b.order = 2;
			c.order = 0;

			if(times > 1){
				_this.animateBlock(c,a,b,index,true,--times,value);
			}

		})
		.start();

		this.blockTween[index] = tween;
	}
}