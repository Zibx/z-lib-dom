(function() {
    var Z = require('z-lib');
    var DOM = Z.DOM = {
        init: function(){
            if (typeof window.addEventListener === 'function') {
                this.addListener = function (el, type, fn) {
                    el.addEventListener(type, fn, false);
                    return {remove: DOM.removeListener.bind(DOM, el, type, fn)};
                };
                this.removeListener = function (el, type, fn) {
                    el.removeEventListener(type, fn, false);
                };
            } else if (typeof document.attachEvent === 'function') { // IE
                this.addListener = function (el, type, fn) {
                    el.attachEvent('on' + type, fn);
                    return {remove: DOM.removeListener.bind(DOM, el, type, fn)};
                };
                this.removeListener = function (el, type, fn) {
                    el.detachEvent('on' + type, fn);
                };
            } else { // older browsers
                this.addListener = function (el, type, fn) {
                    el['on' + type] = fn;
                    return {remove: DOM.removeListener.bind(DOM, el, type, fn)};
                };
                this.removeListener = function (el, type) {
                    el['on' + type] = null;
                };
            }
        },
        stopEvent: function( e ){
            e.stopPropagation();
            e.preventDefault();
            return false;
        },
        keyCode: {
            backspace: 8,
            comma: 188,
            'delete': 46,
            'del': 46,
            down: 40,
            end: 35,
            enter: 13,
            escape: 27,
            home: 36,
            left: 37,
            numpad_add: 107,
            numpad_decimal: 110,
            numpad_divide: 111,
            numpad_enter: 108,
            numpad_multiply: 106,
            numpad_subtract: 109,
            page_down: 34,
            page_up: 33,
            period: 190,
            right: 39,
            space: 32,
            tab: 9,
            up: 38,
            any: -1
        },
        getKeyCode: function( e ){
            return String.fromCharCode(e.which || e.keyCode).toLowerCase().charCodeAt(0);
        },
        addOnceListener: function( el, type, fn ){
            var wrapFn = function(){
                window.DOM.removeListener(el, type, wrapFn);
                fn.apply( this, Array.prototype.slice.call( arguments ) );
            };
            this.addListener( el, type, wrapFn);
        },
        removeClass: function( el, name ){
            el.className = ((' '+el.className+' ').replace( ' '+name+' ', ' ')).trim();
        },
        addClass: function( el, name ){
            !this.hasClass( el, name ) && (el.className += ' '+ name);
        },
        hasClass: function( el, name ){
            return (' '+el.className+' ').indexOf( ' '+name+' ' ) > -1;
        },
        toggleClass: function( el, name ){
            this[ (this.hasClass(el, name) ? 'remove' : 'add' ) + 'Class' ]( el, name );
        },
        getOffset: function( target ){
            target = target || this.target;
            var left = this.pageX,
                top = this.pageY,
                width = target.offsetWidth,
                height = target.offsetHeight;

            if (target.offsetParent) {
                do {
                    left -= target.offsetLeft;
                    top -= target.offsetTop;
                } while( target = target.offsetParent );
            }
            return [left, top, width, height];
        },
        getXY: function( e ){
            if ( e.pageX == null && e.clientX != null ) {
                DOM.getXY = function( e ){
                    var eventDoc = e.target.ownerDocument || document,
                        doc = eventDoc.documentElement,
                        body = eventDoc.body;

                    return {
                        x: e.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 ),
                        y: e.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 )
                    };
                };
            }else{
                DOM.getXY = function( e ){
                    return {
                        x: e.pageX,
                        y: e.pageY
                    }
                };
            }
            return DOM.getXY( e );
        },
        _readyList: [],
        inited: false,
        ready: function( fn ){
            this._readyList.push(fn);
            this._ready();
        },
        _ready: function(  ){
            if( this.inited ){
                while( this._readyList.length ){
                    this._readyList.shift()();
                }
            }
        },
        tplRenderer: function( name ){
            var obj = new LogicTplUnit( w[name] );
            return function(data){return obj.f(data || {});};
        }
    };
    DOM.init();
    /*Z && Z.register('[object HTMLDivElement]', {
        addClass: function(name){
            for( var els = this.els, i = els.length; i; )
                DOM.addClass(els[--i], name);
            return this;
        },
        removeClass: function( name ){
            for( var els = this.els, i = els.length; i; )
                DOM.removeClass(els[--i], name);
            return this;
        },
        toggleClass: function( name ){
            for( var els = this.els, i = els.length; i; )
                DOM.toggleClass(els[--i], name);
            return this;
        },
        hasClass: function( name ){
            for( var els = this.els, i = els.length; i; )
                if( DOM.hasClass(els[--i], name) )
                    return true;
            return false;
        }
    });
    Z && Z.register('[object String]', {

    }, function( el ){
        return Z(Array.prototype.slice.call(document.querySelectorAll(el)),'[object HTMLDivElement]');
    });
        //Z.selfy(DOM, 'addListener,removeListener,addOnceListener, addClass,removeClass,!hasClass,toggleClass,!getOffset'));
*/
    var readyFn = function(){
        DOM.inited = true;
        DOM._ready();

    };


    function r( f ){
        /in/.test( document.readyState ) ? setTimeout( r.bind( null, f ), 90 ) : f()
    }
    r( readyFn );


    return DOM;
})();