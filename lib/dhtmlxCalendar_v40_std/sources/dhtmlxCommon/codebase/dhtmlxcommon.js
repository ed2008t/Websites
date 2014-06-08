/*
Product Name: dhtmlxCalendar 
Version: 4.0 
Edition: Standard 
License: content of this file is covered by GPL. Usage outside GPL terms is prohibited. To obtain Commercial or Enterprise license contact sales@dhtmlx.com
Copyright UAB Dinamenta http://www.dhtmlx.com
*/

/* dhtmlx.com */

if (typeof(window.dhx4) == "undefined") {
	
	window.dhx4 = {
		
		version: "4.0",
		
		skin: null, // allow to be set by user
		
		skinDetect: function(comp) {
			var t = document.createElement("DIV");
			t.className = comp+"_skin_detect";
			if (document.body.firstChild) document.body.insertBefore(t, document.body.firstChild); else document.body.appendChild(t);
			var w = t.offsetWidth;
			t.parentNode.removeChild(t);
			t = null;
			return {10:"dhx_skyblue",20:"dhx_web",30:"dhx_terrace"}[w]||null;
		},
		
		// id manager
		lastId: 1,
		newId: function() {
			return this.lastId++;
		},
		
		// z-index manager
		zim: {
			data: {},
			step: 5,
			first: function() {
				return 100;
			},
			last: function() {
				var t = this.first();
				for (var a in this.data) t = Math.max(t, this.data[a]);
				return t;
			},
			reserve: function(id) {
				this.data[id] = this.last()+this.step;
				return this.data[id];
			},
			clear: function(id) {
				if (this.data[id] != null) {
					this.data[id] = null;
					delete this.data[id];
				}
			}
		},
		
		// string to boolean
		s2b: function(r) {
			return (r == true || r == 1 || r == "true" || r == "1" || r == "yes" || r == "y");
		},
		
		// trim
		trim: function(t) {
			return String(t).replace(/^\s{1,}/,"").replace(/\s{1,}$/,"");
		},
		
		// template parsing
		template: function(tpl, data, trim) {
			// tpl - template text
			// data - object with key-value
			// trim - true/false, trim values
			return tpl.replace(/#([a-zA-Z0-9_-]{1,})#/g, function(t,k){
				if (k.length > 0 && typeof(data[k]) != "undefined") {
					if (trim == true) return window.dhx4.trim(data[k]);
					return String(data[k]);
				}
				return "";
			});
		},
		
		// absolute top/left position on screen
		absLeft: function(obj) {
			if (typeof(obj) == "string") obj = document.getElementById(obj);
			return this._aOfs(obj).left;
		},
		absTop: function(obj) {
			if (typeof(obj) == "string") obj = document.getElementById(obj);
			return this._aOfs(obj).top;
		},
		_aOfsSum: function(elem) {
			var top = 0, left = 0;
			while (elem) {
				top = top + parseInt(elem.offsetTop);
				left = left + parseInt(elem.offsetLeft);
				elem = elem.offsetParent;
			}
			return {top: top, left: left};
		},
		_aOfsRect: function(elem) {
			var box = elem.getBoundingClientRect();
			var body = document.body;
			var docElem = document.documentElement;
			var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
			var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
			var clientTop = docElem.clientTop || body.clientTop || 0;
			var clientLeft = docElem.clientLeft || body.clientLeft || 0;
			var top  = box.top +  scrollTop - clientTop;
			var left = box.left + scrollLeft - clientLeft;
			return { top: Math.round(top), left: Math.round(left) };
		},
		_aOfs: function(elem) {
			if (elem.getBoundingClientRect) {
				return this._aOfsRect(elem);
			} else {
				return this._aOfsSum(elem);
			}
		},
		
		// copy obj
		_isObj: function(k) {
			return (k != null && typeof(k) == "object" && typeof(k.length) == "undefined");
		},
		_copyObj: function(r) {
			if (this._isObj(r)) {
				var t = {};
				for (var a in r) {
					if (typeof(r[a]) == "object" && r[a] != null) t[a] = this._copyObj(r[a]); else t[a] = r[a];
				}
			} else {
				var t = [];
				for (var a=0; a<r.length; a++) {
					if (typeof(r[a]) == "object" && r[a] != null) t[a] = this._copyObj(r[a]); else t[a] = r[a];
				}
			}
			return t;
		},
		
		// screen dim
		screenDim: function() {
			var isIE = (navigator.userAgent.indexOf("MSIE") >= 0);
			var dim = {};
			dim.left = document.body.scrollLeft;
			dim.right = dim.left+(window.innerWidth||document.body.clientWidth);
			dim.top = Math.max((isIE?document.documentElement:document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);
			dim.bottom = dim.top+(isIE?Math.max(document.documentElement.clientHeight||0,document.documentElement.offsetHeight||0):window.innerHeight);
			return dim;
		},
		
		// input/textarea range selection
		selectTextRange: function(inp, start, end) {
			
			inp = (typeof(inp)=="string"?document.getElementById(inp):inp);
			
			var len = inp.value.length;
			start = Math.max(Math.min(start, len), 0);
			end = Math.min(end, len);
			
			if (inp.setSelectionRange) {
				inp.setSelectionRange(start, end);
			} else if (inp.createTextRange) {
				var range = inp.createTextRange();
				range.moveStart("character", start);
				range.moveEnd("character", end-len);
				try {range.select();} catch(e){};
			}
		},
		
		// transition
		transData: null,
		transDetect: function() {
			
			if (this.transData == null) {
				
				this.transData = {transProp: false, transEv: null};
				
				// transition, MozTransition, WebkitTransition, msTransition, OTransition
				var k = {
					"MozTransition": "transitionend",
					"WebkitTransition": "webkitTransitionEnd",
					"OTransition": "oTransitionEnd",
					"msTransition": "transitionend",
					"transition": "transitionend"
				};
				
				for (var a in k) {
					if (this.transData.transProp == false && document.documentElement.style[a] != null) {
						this.transData.transProp = a;
						this.transData.transEv = k[a];
					}
				}
				k = null;
			}
			
			return this.transData;
			
		}
		
	};
	
	// browser
	window.dhx4.isIE = (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0);
	window.dhx4.isIE6 = (window.XMLHttpRequest == null && navigator.userAgent.indexOf("MSIE") >= 0);
	window.dhx4.isOpera = (navigator.userAgent.indexOf("Opera") >= 0);
	window.dhx4.isChrome = (navigator.userAgent.indexOf("Chrome") >= 0);
	window.dhx4.isKHTML = (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0);
	window.dhx4.isFF = (navigator.userAgent.indexOf("Firefox") >= 0);
	window.dhx4.isIPad = (navigator.userAgent.search(/iPad/gi) >= 0);
};

if (typeof(window.dhx4.ajax) == "undefined") {
	
	window.dhx4.ajax = {
		get: function(url, onLoad) {
			this._call("GET", url, null, true, onLoad);
		},
		getSync: function(url) {
			return this._call("GET", url, null, false);
		},
		post: function(url, postData, onLoad) {
			if (arguments.length == 1) {
				postData = "";
			} else if (arguments.length == 2 && (typeof(postData) == "function" || typeof(window[postData]) == "function")) {
				onLoad = postData;
				postData = "";
			} else {
				postData = String(postData);
			}
			this._call("POST", url, postData, true, onLoad);
		},
		postSync: function(url, postData) {
			postData = (postData == null ? "" : String(postData));
			return this._call("POST", url, postData, false);
		},
		getLong: function(url, onLoad) {
			this._call("GET", url, null, true, onLoad, {url:url});
		},
		postLong: function(url, postData, onLoad) {
			if (arguments.length == 2 && (typeof(postData) == "function" || typeof(window[postData]))) {
				onLoad = postData;
				postData = "";
			}
			this._call("POST", url, postData, true, onLoad, {url:url, postData:postData});
		},
		_call: function(method, url, postData, async, onLoad, longParams) {
			
			var t = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
			
			if (async == true) {
				t.onreadystatechange = function() {
					if (t.readyState == 4 && t.status == 200) { // what for long response and status 404?
						if (typeof(onLoad) == "function") {
							onLoad.apply(window, [{xmlDoc:t}]); // dhtmlx-compat, response.xmlDoc.responseXML/responseText
						}
						if (longParams != null) {
							if (typeof(longParams.postData) != "undefined") {
								dhx4.ajax.postLong(longParams.url, longParams.postData, onLoad);
							} else {
								dhx4.ajax.getLong(longParams.url, onLoad);
							}
						}
						onLoad = null;
						t = null;
					}
				}
			}
			
			if (method == "GET") {
				url += (url.indexOf("?")>=0?"&":"?")+"dhxr"+new Date().getTime();
			}
			
			t.open(method, url, async);
			
			if (method == "POST") {
				t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				postData += (postData.length>0?"&":"")+"dhxr"+new Date().getTime();
			} else {
				postData = null;
			}
			
			t.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			
			t.send(postData);
			
			if (!async) return {xmlDoc:t}; // dhtmlx-compat, response.xmlDoc.responseXML/responseText
			
		}
	};
	
};

if (typeof(window.dhx4._enableDataLoading) == "undefined") {

	window.dhx4._enableDataLoading = function(obj, initObj, xmlToJson, xmlRootTag, mode) {
		
		if (mode == "clear") {
			
			// clear attached functionality
			
			for (var a in obj._dhxdataload) {
				obj._dhxdataload[a] = null;
				delete obj._dhxdataload[a];
			};
			
			obj._loadData = null;
			obj._dhxdataload = null;
			obj.load = null;
			obj.loadStruct = null;
			
			obj = null;
			
			return;
			
		}
		
		obj._dhxdataload = { // move to obj.conf?
			initObj: initObj,
			xmlToJson: xmlToJson,
			xmlRootTag: xmlRootTag,
			onBeforeXLS: null
		};
		
		obj._loadData = function(data, loadParams, onLoad) {
			
			if (arguments.length == 2) {
				onLoad = loadParams;
				loadParams = null;
			}
			
			var obj = null;
			
			// deprecated from 4.0, compatability with version (url, type[json|xml], onLoad)
			if (arguments.length == 3) onLoad = arguments[2];
			
			if (typeof(data) == "string") {
				
				var k = data.replace(/^\s{1,}/,"").replace(/\s{1,}$/,"");
				
				var tag = new RegExp("^<"+this._dhxdataload.xmlRootTag);
				
				// xml
				if (tag.test(k.replace(/^<\?xml[^\?]*\?>\s*/, ""))) { // remove leading <?xml ...?> if any, \n can be also presenе
					if (window.DOMParser) { // ff,ie9
						obj = (new window.DOMParser()).parseFromString(data, "text/xml");
					} else if (typeof(window.ActiveXObject) != "undefined") {
						obj = new window.ActiveXObject("Microsoft.XMLDOM");
						obj.async = "false";
						obj.loadXML(data);
					}
					if (obj != null) obj = this[this._dhxdataload.xmlToJson].apply(this, [obj]); // xml to json
				}
				
				if (obj == null && (k.match(/^\{.*\}$/) != null || k.match(/^\[.*\]$/) != null)) {
					try { eval("dhx4.temp="+k); } catch(e) { dhx4.temp = null; }
					obj = dhx4.temp;
					dhx4.temp = null;
				}
				
				if (obj == null) {
					
					this.callEvent("onXLS",[]);
					
					var params = [];
					
					// allow to modify url and add params
					if (typeof(this._dhxdataload.onBeforeXLS) == "function") {
						var k = this._dhxdataload.onBeforeXLS.apply(this,[data]);
						if (k != null && typeof(k) == "object") {
							if (k.url != null) data = k.url;
							if (k.params != null) { for (var a in k.params) params.push(a+"="+encodeURIComponent(k.params[a])); }
						}
					}
					
					var t = this;
					
					dhx4.ajax.post(data, params.join("&")+(typeof(loadParams)=="string"?"&"+loadParams:""), function(r){
						
						var obj = null;
						
						if (r.xmlDoc.getResponseHeader("Content-Type").search(/xml/gi) >= 0 || (r.xmlDoc.responseText.replace(/^\s{1,}/,"")).match(/^</) != null) {
							obj = t[t._dhxdataload.xmlToJson].apply(t,[r.xmlDoc.responseXML]);
						} else {
							try { eval("dhx4.temp="+r.xmlDoc.responseText); } catch(e){ dhx4.temp = null; };
							obj = dhx4.temp;
							dhx4.temp = null;
						}
						
						// init
						if (obj != null) t[t._dhxdataload.initObj].apply(t,[obj,data]); // data => url
						
						t.callEvent("onXLE",[]);
						
						if (onLoad != null) {
							if (typeof(onLoad) == "function") {
								onLoad.apply(t,[]);
							} else if (typeof(window[onLoad]) == "function") {
								window[onLoad].apply(t,[]);
							}
						}
						
						onLoad = null;
						t = null;
						
					});
					
					return;
				}
				
			} else {
				if (typeof(data.documentElement) == "object" || (typeof(data.tagName) != "undefined" && typeof(data.getElementsByTagName) != "undefined" && data.getElementsByTagName(this._dhxdataload.xmlRootTag).length > 0)) { // xml
					obj = this[this._dhxdataload.xmlToJson].apply(this, [data]);
				} else { // json
					obj = window.dhx4._copyObj(data);
				}
				
			}
			
			// init
			if (obj != null) this[this._dhxdataload.initObj].apply(this,[obj]);
			
			if (onLoad != null) {
				if (typeof(onLoad) == "function") {
					onLoad.apply(this, []);
				} else if (typeof(window[onLoad]) == "function") {
					window[onLoad].apply(this, []);
				}
				onLoad = null;
			}
			
		};
		
		// loadStruct for hdr/conf
		// load for data
		if (mode != null) {
			var k = {struct: "loadStruct", data: "load"};
			for (var a in mode) {
				if (mode[a] == true) obj[k[a]] = function() {return this._loadData.apply(this, arguments);}
			}
		}
		
		obj = null;
		
	};
};
if (typeof(window.dhx4._eventable) == "undefined") {
	
	window.dhx4._eventable = function(obj, mode) {
		
		if (mode == "clear") {
			
			obj.detachAllEvents();
			
			obj.dhxevs = null;
			
			obj.attachEvent = null;
			obj.detachEvent = null;
			obj.checkEvent = null;
			obj.callEvent = null;
			obj.detachAllEvents = null;
			
			obj = null;
			
			return;
			
		}
		
		obj.dhxevs = { data: {} };
		
		obj.attachEvent = function(name, func) {
			name = String(name).toLowerCase();
			if (!this.dhxevs.data[name]) this.dhxevs.data[name] = {};
			var eventId = window.dhx4.newId();
			this.dhxevs.data[name][eventId] = func;
			return eventId;
		}
		
		obj.detachEvent = function(eventId) {
			for (var a in this.dhxevs.data) {
				var k = 0;
				for (var b in this.dhxevs.data[a]) {
					if (b == eventId) {
						this.dhxevs.data[a][b] = null;
						delete this.dhxevs.data[a][b];
					} else {
						k++;
					}
				}
				if (k == 0) {
					this.dhxevs.data[a] = null;
					delete this.dhxevs.data[a];
				}
			}
		}
		
		obj.checkEvent = function(name) {
			name = String(name).toLowerCase();
			return (this.dhxevs.data[name] != null);
		}
		
		obj.callEvent = function(name, params) {
			name = String(name).toLowerCase();
			if (this.dhxevs.data[name] == null) return true;
			var r = true;
			for (var a in this.dhxevs.data[name]) {
				r = this.dhxevs.data[name][a].apply(this, params) && r;
			}
			return r;
		}
		
		obj.detachAllEvents = function() {
			for (var a in this.dhxevs.data) {
				for (var b in this.dhxevs.data[a]) {
					this.dhxevs.data[a][b] = null;
					delete this.dhxevs.data[a][b];
				}
				this.dhxevs.data[a] = null;
				delete this.dhxevs.data[a];
			}
		}
		
		obj = null;
	};
	
};
