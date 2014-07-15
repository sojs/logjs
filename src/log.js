/**
 * Created by yangxinming on 14-5-22.
 */

//import JSON-js
if (typeof JSON !== 'object') {
    JSON = {};
}
(function() {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function() {

            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z' : null;
        };
        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function() {
                return this.valueOf();
        };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':

                if (!value) {
                    return 'null';
                }

                gap += indent;
                partial = [];

                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {
                '': value
            });
        };
    }

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());

//log.js
(function(console) {
    var i,
        global = this,
        doc = document,
        fnProto = Function.prototype,
        fnApply = fnProto.apply,
        fnBind = fnProto.bind,
        bind = function(context, fn) {
            return fnBind ?
                fnBind.call(fn, context) :
                function() {
                    return fnApply.call(fn, context, arguments);
                };
        },
        methods = 'assert count debug dir dirxml error group groupCollapsed groupEnd info log markTimeline profile profileEnd table trace warn'.split(' '),
        emptyFn = function() {},
        empty = {},
        timeCounters;

    function $(id){
        return document.getElementById(id);
    }

    function resize(elem) {
        var debugElem = $('__debug'),
            conentElem = $('__debug_content');
        elem.onmousedown = function(event) {
            var event = event || window.event;
            var startX = event.clientX - elem.offsetLeft;
            var startY = event.clientY - elem.offsetTop;
            var debugElemTop = debugElem.offsetTop;
            var debugElemHeigth = debugElem.offsetHeight;
            var conentElemHeigth = conentElem.offsetHeight;

            document.onmousemove = function() {
                var event = event || window.event;
                var distX = event.clientX - startX;
                var distY = event.clientY - startY;
                var iHeight = elem.offsetHeight - distY;
                debugElem.style.top = debugElemTop - iHeight + "px";
                debugElem.style.height = debugElemHeigth + iHeight + "px";
                conentElem.style.height = conentElemHeigth + iHeight + 'px';
                return false;
            }

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }

    for (i = methods.length; i--;) empty[methods[i]] = emptyFn;
    if (console) {
        for (i = methods.length; i--;) {
            console[methods[i]] = methods[i] in console ? bind(console, console[methods[i]]) : emptyFn;
        }
        console.disable = function() {
            global.console = empty;
        };
        empty.enable = function() {
            global.console = console;
        };
        empty.disable = console.enable = emptyFn;
    } else {
        console = global.console = empty;
        var debugCurTimer;
        var debugTimer = new Date().getTime();
        console.log = function() {
            var message = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                var arg = arguments[i];
                var isArray = arg instanceof Array;
                var data = JSON.stringify(arg, null, isArray ? 0 : 4) || arg;
                if (data && data.length) {
                    message = message.concat(data);
                } else {
                    message.push(data);
                }
            }
            message.join(',  ');
            var mess = doc.createElement('div');
            mess.style.cssText = 'border-bottom:1px dashed #e0ecff;line-height:12px;padding:2px 0;height:12px;';
            mess.innerHTML = '<xmp style="margin:0 80px 0 0;float:left;">' + message + '</xmp>';
            var timeDiv = doc.createElement('div');
            timeDiv.style.cssText = 'float:right;';
            debugCurTimer = new Date().getTime();
            timeDiv.innerHTML = (debugCurTimer - debugTimer) + ' ms';
            debugTimer = debugCurTimer;
            mess.appendChild(timeDiv);
            var dbg = doc.getElementById('__debug');
            var cont = doc.getElementById('__debug_content');
            if (!dbg) {
                dbg = doc.createElement('div');
                dbg.id = '__debug';
                dbg.style.cssText = 'position:fixed;*position:absolute;bottom:0;width:99%;height:150px;overflow:hidden;z-index:100000;background:#fff;font-size:11px;';
                doc.body.appendChild(dbg);
                var topBar = doc.createElement('div');
                topBar.style.cssText = 'cursor:n-resize;height:16px;line-height:16px;background:#888;position:relative;';
                topBar.innerHTML = '<span style="margin-left:5px;color:white;font-weight:bold;">Log</span>';
                var clear = doc.createElement('span');
                var acss = 'color:white;cursor:pointer;position:absolute;right:45px;text-decoration:underline;';
                clear.style.cssText = acss;
                clear.innerHTML = 'Clear';
                clear.onclick = function() {
                    cont.innerHTML = '';
                };
                var close = doc.createElement('span');
                close.style.cssText = acss;
                close.style.right = '10px';
                close.innerHTML = 'Hide';
                close.onclick = function() {
                    if (close.innerHTML == 'Hide') {
                        close.innerHTML = 'Show';
                        dbg.style.height = '16px';
                    } else {
                        close.innerHTML = 'Hide';
                        dbg.style.height = '100px';
                    }
                };
                topBar.appendChild(clear);
                topBar.appendChild(close);
                cont = doc.createElement('div');
                cont.id = '__debug_content';
                cont.style.cssText = 'height:130px;overflow:auto;background:#fff;margin:2px 5px;color:#333333;';
                dbg.appendChild(topBar);
                dbg.appendChild(cont);
                window.onload = window.onresize = function() {
                    resize(topBar);
                    dbg.style.top = (document.documentElement.clientHeight - dbg.offsetHeight)+ "px";
                }
            }
            dbg.style.display = '';
            cont.appendChild(mess);
            cont.scrollTop = cont.scrollHeight;

        };
        console.disable = console.enable = emptyFn;
    }
    if (!console.time) {
        console.timeCounters = timeCounters = {};
        console.time = function(name, reset) {
            if (name) {
                var time = +new Date,
                    key = "KEY" + name.toString();
                if (reset || !timeCounters[key]) timeCounters[key] = time;
            }
        };
        console.timeEnd = function(name) {
            var diff,
                time = +new Date,
                key = "KEY" + name.toString(),
                timeCounter = timeCounters[key];

            if (timeCounter) {
                diff = time - timeCounter;
                console.log(name + ": " + diff + "ms");
                delete timeCounters[key];
            }
            return diff;
        };
    }
})(typeof console === 'undefined' ? null : console);
