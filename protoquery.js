$$ = jQuery;
Object.extend = jQuery.extend;

document.viewport = {
  getDimensions: function() {
    return { width: $(window).width(), height: $(window).height() };
  },

  getScrollOffsets: function() {
    return [
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];
  }
};

Effect = {
  toggle: function(id, type, options) {
    $('#' + id).animate({height: 'toggle'}, options || {});
  },
	Highlight: function(element, options, speed, callback) {
		$(element).effect("highlight", options || {});
	}
};

Control = {
	Modal: function(selector, options) {
    options = options || {};
    var optionsMap = {
      'jQPos': 'position'
    };

    var eventsMap = {
      'afterOpen': 'open'
    };

    for(var i in options) {
      if(optionsMap[i]) {
        options[optionsMap[i]] = options[i];
        delete options[i];
      }
    }

    for(var event in eventsMap) {
      if(options[event]) {
        $(selector).bind(eventsMap[event], options[event]);
      }
    }

    $.extend(options, {
      autoOpen: false
    });

    if($.type(selector) == 'string' && (selector.indexOf('#') !== 0))
      selector = '#' + selector;

    if($(selector).data('modal'))
      return $(selector).data('modal');

    var modal = $(selector).modal(options);
    return modal ? modal.data('modal') : $(selector);
  }
};

//Prototype's Element contstructor :-)
function Element(tag, options) { 
  options = options || {};
  return $(document.createElement(tag)).attr(options);
}

jQuery.extend(Control.Modal, {
  open: function(el, opts) {
    var modal = new this(el, opts);
    if(modal.open)
      modal.open();
  }, 
  close: function(){ 
    $.ui.modal.instances.each(function(modal){ modal.close(); });
  }
});

(function($) {

  var prototypeMethods = {
    Array: ["each", "map", "reduce", "inject", "reduceRight", "detect", "select", "reject", "all", "any", "include", "invoke", "pluck", "max", "min", "sortBy", "sortedIndex", "size", "first", "rest", "last", "compact", "flatten", "without", "uniq", "intersect", "zip", "indexOf", "lastIndexOf", "range"],
    Function: ["bind", "bindAll", "memoize", "delay", "defer", "throttle", "debounce", "wrap", "compose"]
  };

  for(var obj in prototypeMethods) {
    _.each(prototypeMethods[obj], function(method, i) {
      window[obj].prototype[method] = function() {
        var args = Array.prototype.slice.apply(arguments);
        args.unshift(this);
        return _[method].apply(window, args);
      };
    });
  }

  $.extend(Function.prototype, {
    argumentNames: function() {
      var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
      return names.length == 1 && !names[0] ? [] : names;
    }
  });

  $.extend(String.prototype, (function() {
    function blank(){
      return (/^\s*$/).test(this);
    }

    function capitalize() {
      return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    function stripTags() {
      return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

    function escapeHTML() {
      return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function evalJSON() {
      return $.parseJSON(this + '');
    }
    
    function unescapeHTML() {
      return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    }

    function toQueryParams(separator) {
      var match = this.match(/([^?#]*)(#.*)?$/);
      if (!match) return { };

      return match[1].split(separator || '&').inject({ }, function(hash, pair) {
        if ((pair = pair.split('='))[0]) {
          var key = decodeURIComponent(pair.shift()),
              value = pair.length > 1 ? pair.join('=') : pair[0];

          if (value != undefined) value = decodeURIComponent(value);

          if (key in hash) {
            if (!$.type(hash[key]) == 'array') hash[key] = [hash[key]];
            hash[key].push(value);
          }
          else hash[key] = value;
        }
        return hash;
      });
    }
    
    return {
      blank        : blank,
      capitalize   : capitalize,
      empty        : blank,
      escapeHTML   : escapeHTML,
      evalJSON     : evalJSON,
      stripHTML    : stripTags,
      stripTags    : stripTags,
      toQueryParams: toQueryParams,
      unescapeHTML : unescapeHTML
    };
  })());

  RegExp.escape = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  };
  
})(jQuery);

(function($) {
  var $break = { };

  $.Utility = {
    Array: function(array) {
      this.initialize(array);
    },
    
    Hash: function(object) {
      this.initialize(object);
    }
  };

  $.Utility.Hash.prototype = {

    initialize: function(object) {
      this._object = object;
      return this;
    },
    
    each: function(iterator, context) {
      var index = 0;
      try {
        for (var key in this._object) {
          var value = this._object[key], pair = [key, value];
          pair.key = key;
          pair.value = value;
          iterator(pair);
        }
      } catch (e) {
      if (e != $break) throw e;
      }
      return this;
    },

    keys: function() {
      var keys = [];
      for (var key in this._object) keys.push(key);
      return keys;
    },

    merge: function(object) {
      for (var prop in object) {
        this._object[prop] = object[prop];
      }
      return this;
    },
    
    get: function(key) {
      for(var prop in this._object) {
        if(prop == key)
          return this._object[prop];
      }
      return undefined;
    },

    toQueryString: function() {
      return $.param(this._object);
    }

  };

  $.Utility.Array.prototype = {
    initialize: function(array) {
			if (!array) return;
      this._array = array;
      this.length = this._array.length;
      for(var i = 0; i < this.length; i++) {
        this[i] = this._array[i];
      }
    },

    each: function(iterator, context) {
      for (var i = 0, length = this.length; i < length; i++)
        iterator.call(context, this[i], i);
    },

    map: function(callback) {
      var ret = [], value;
      for (var i = 0, length = this.length; i < length; i++) {
        value = callback(this[ i ], i);

        if (value !== null) {
          ret[ret.length] = value;
        }
      }
      return ret.concat.apply([], ret);
    },

    compact: function() {
      var ret = [];  
      this.each(function(el, i) {
        if(el !== null)
          ret.push(el);
      });
      return ret;
    },
	
    push: [].push,
    sort: [].sort,
    splice: [].splice
  };
  
})(jQuery);

(function() {
  prototypeAliases = {
    'addClassName'   : 'addClass',
    'cumulativeOffset': 'offset',
    'down'					 : 'find',
    'fire'           : 'trigger',
    'getHeight'      : 'height',
    'getStyle'       : 'css',
    'getWidth'       : 'width',
    'getValue'       : 'val',
    'hasClassName'   : 'hasClass',
    'match'          : 'is',
    'observe'        : 'bind',
    'readAttribute'  : 'attr',
    'removeClassName': 'removeClass',
    'replace'        : 'replaceWith',
    'select'         : 'find',
    'setStyle'       : 'css',
    'setValue'       : 'val',
    'stopObserving'  : 'unbind',
    'toggleClassName': 'toggleClass',
    'up'             : 'closest',
    'update'         : 'html',
		'writeAttribute' : 'attr'
  };

  for(var i in prototypeAliases){
    $.fn[i] = $.fn[prototypeAliases[i]];
  }

})();

function $F(element_or_id) {
  if(element_or_id.nodeType || (element_or_id instanceof jQuery)) {
    return $(element_or_id).val();
  }
  else
    return $('#' + element_or_id).val();
}

if(!$H)
	var $H = function(object) {
		return new jQuery.Utility.Hash(object);
	};

if(!$A)
  var $A = function(array) {
    return new jQuery.Utility.Array(array);
  };

(function($){
  $.fn.classNames = function() {
    return this.attr('class').split(/\s/);
  };

  $.fn.disable = function() {
    return this.attr('disabled', true);
  };

  $.fn.each = (function(original) {
    return function(callback) {
      return original.call(this, function(i, el) {
        var args = [i, el];
        if(callback.argumentNames()[0] != 'i'){
          args = args.reverse();
        }
        callback.apply(el, args);
      });
    };
  })($.fn.each);

  $.fn.enable = function(){
    return this.attr('disabled', false);
  };

  $.fn.getDimensions = function() {
    var height = this.getHeight();
    var width = this.getWidth();
    return {'height': height, 'width': width};
  };

  $.fn.identify = function() {
    if(typeof $.idCounter == 'undefined')
      $.idCounter = 0;

    var el = this.first();
    var id = el.attr('id');
    if (id) return id;
    do { $.idCounter++; id = 'anonymous_element_' + $.idCounter; } while ($('#' + id).length > 0);
    el.attr('id', id);
    return id;
  };

  //$(this.element).insert({top: selected});
  $.fn.insert = function(elementOrHash) {
    if((elementOrHash instanceof jQuery) || ($.type(elementOrHash) == 'string')){
      var element = elementOrHash;
      this.append(element);
    }

    else {
      var insertionHash = elementOrHash;
      for(var position in insertionHash){
        switch(position) {
        case 'top':
          this.prepend(insertionHash[position]);
          break;
        case 'bottom':
          this.append(insertionHash[position]);
          break;
        case 'before':
          this.before(insertionHash[position]);
          break;
        case 'after':
          this.after(insertionHash[position]);
          break;
        default:
          this.append(insertionHash[position]);
          break;
        }
      }
    }
    return this;
  };

  $.fn.invoke = function() {
    var args = Array.prototype.slice.call(arguments);
    var method = args.shift(); 
    this[method].apply(this, args);
    return this;
  };

	$.fn.positionedOffset = function() {
		var _offset = this.position();
		return [_offset.left, _offset.top];
	};

  $.fn.request = function(opts) {
		var jqopts = {
			url: this.attr('action'),
			type: this.attr('method') || 'GET',
			data: this.serialize()
		};
		new Ajax.Request(jqopts.url, $.extend(opts, jqopts));
		return this;
	};

  $.fn.oldSerialize = $.fn.serialize;

  $.fn.serialize = function(toHash) {
    var params = {};
    if(toHash)
      return $(this).serializeArray().inject({}, function(acc, obj) {
        acc[obj.name] = obj.value;
        return acc;
      });
    else
      return $(this).oldSerialize();
  };

  $.fn.setCaretPosition = function(position) {
    return this.each(function(i, el) {
      if (position == 'end') 
        position = $(el).val().length;
        
      if (el.createTextRange) {
        var range = element.createTextRange();
        range.move('character', position);
        range.select();
      } else {
        el.focus();
        if (el.setSelectionRange)
          el.setSelectionRange(position, position);
      }
    });
  };

  $.toJSON = function(o) {
    if (typeof(JSON) == 'object' && JSON.stringify)
      return JSON.stringify(o);
    
    var type = typeof(o);

    if (o === null)
        return "null";

    if (type == "undefined")
        return undefined;
    
    if (type == "number" || type == "boolean")
        return o + "";

    if (type == "string")
        return o;

    if (type == 'object') {
      if (typeof o.toJSON == "function") 
        return $.toJSON( o.toJSON() );
        
      if (o.constructor === Date) {
        var month = o.getUTCMonth() + 1;
        if (month < 10) month = '0' + month;

        var day = o.getUTCDate();
        if (day < 10) day = '0' + day;

        var year = o.getUTCFullYear();
        
        var hours = o.getUTCHours();
        if (hours < 10) hours = '0' + hours;
        
        var minutes = o.getUTCMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        
        var seconds = o.getUTCSeconds();
        if (seconds < 10) seconds = '0' + seconds;
        
        var milli = o.getUTCMilliseconds();
        if (milli < 100) milli = '0' + milli;
        if (milli < 10) milli = '0' + milli;

        return '"' + year + '-' + month + '-' + day + 'T' +
                     hours + ':' + minutes + ':' + seconds + 
                     '.' + milli + 'Z"'; 
      }

      if (o.constructor === Array) {
        var ret = [];
        for (var i = 0; i < o.length; i++)
            ret.push( $.toJSON(o[i]) || "null" );

        return "[" + ret.join(",") + "]";
      }
    
      var pairs = [];
      for (var k in o) {
        var name;
        type = typeof k;

        if (type == "number")
          name = '"' + k + '"';
        else if (type == "string")
          name = k;
        else
          continue;  //skip non-string or number keys
    
        if (typeof o[k] == "function") 
          continue;  //skip pairs where the value is a function.
    
        var val = $.toJSON(o[k]);
    
        pairs.push(name + ":" + val);
      }

      return "{" + pairs.join(", ") + "}";
    }
  };

  $.fn.viewportOffset =  function() {
    var element = this;
    return [element.cumulativeOffset().left - $(window).scrollLeft(), element.cumulativeOffset().top - $(window).scrollTop()];
  };
  
  $.fn.visible = function() {
    return this.is(':visible');
  };

  $.event.special.mouseleaveintent = {
    setup: function(data, namespaces) {
      var elem = this, $elem = $(elem), timer;
      var options = {
        timeout: 500
      };

      $elem.bind('mouseleave.intent', function(e) {
        var event = e;
        timer = setTimeout(function() {
          $.event.special.mouseleaveintent._handler.call(this, event);
        }.bind(this), options.timeout);
      });

      $elem.bind('mouseenter', function() {
        clearTimeout(timer);
      });
    },

    teardown: function(namespaces) {
      var elem = this, $elem = $(elem);
      $elem.unbind('mouseleave.intent');
    },

    _handler: function(event) {
      var elem = this, $elem = $(elem);
      event.type = 'mouseleaveintent';
      $.event.handle.apply(this, arguments);
    }
  };
  

  (function($,doc,outside){
    $.map(
      'click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup'.split(' '),
      function( event_name ) { jq_addOutsideEvent( event_name ); }
    );
    
    jq_addOutsideEvent( 'focusin',  'focus' + outside );
    jq_addOutsideEvent( 'focusout', 'blur' + outside );
    $.addOutsideEvent = jq_addOutsideEvent;
    function jq_addOutsideEvent( event_name, outside_event_name ) {
      
      outside_event_name = outside_event_name || event_name + outside;
      var elems = $(),
      event_namespaced = event_name + '.' + outside_event_name + '-special-event';
      $.event.special[ outside_event_name ] = {
        
        setup: function(){
         elems = elems.add( this );
          if ( elems.length === 1 ) {
            $(doc).bind( event_namespaced, handle_event );
          }
        },
        teardown: function(){
          elems = elems.not( this );
          if ( elems.length === 0 ) {
            $(doc).unbind( event_namespaced );
          }
        },
        
        add: function( handleObj ) {
          var old_handler = handleObj.handler;
          handleObj.handler = function( event, elem ) {
            event.target = elem;
            old_handler.apply( this, arguments );
          };
        }
      };
      
      function handle_event( event ) {
        $(elems).each(function(){
          var elem = $(this);
          
          if ( this !== event.target && !elem.has(event.target).length ) {
            elem.triggerHandler( outside_event_name, [ event.target ] );
          }
        });
      }
    }
    
  })($, document, 'outside');
  

  $.extend($.Event.prototype, {
    stop: $.Event.prototype.preventDefault,
    element: function(){
      return $(this.target);
    }
  });

})(jQuery);

var Ajax = {
  Request: function(url, options) {
    var optionMap = {
      'asynchronous': 'async',
      'method'      : 'type',
      'onComplete'  : 'success',
      'onFailure'   : 'error',
      'onSuccess'   : 'success',
      'postBody'    : 'data',
      'parameters'  : 'data'
    };

    for(var prop in options) {
      if(optionMap[prop]) {
        options[optionMap[prop]] = options[prop];
        delete options[prop];
      }
    }

    options = $.extend(options, {url: url});
    if(options.requestHeaders)
      options.beforeSend = function (request){
        for(var header in options.requestHeaders){
          request.setRequestHeader(header, options.requestHeaders[header]);
        }
      };

    if(options['success'])
      options['success'] = (function(original) {
        return function(response) {
          original({
            responseText: response
          });
        };
      })(options['success']);

    $.ajax(options);
  }
};

if($.widget) {
  $.widget('ui.modal', $.ui.dialog, {
    _init: function(options) {
      var self = this;
      this.options.modal = (this.element.data('overlay') !== undefined) ? this.element.data('overlay') : true;
      $('.ui-widget-overlay').die('click.ui-modal');
      $('.ui-widget-overlay').live('click.ui-modal', function() {
        self.close();
      });
      this.uiDialog = this.element;
      this.container = this.element.parent();
      $.ui.modal.instances.push(this);
      if ( this.options.autoOpen ) {
        this.open();
      }
    },

    destroy: function() {
      if (this.overlay) {
        this.overlay.destroy();
      }
      this.element.unbind('.dialog').
        removeData('dialog').
        removeClass('ui-dialog-content ui-widget-content').
        hide().appendTo('body');

      return this;
    },

    open: function() {
      if (this._isOpen) { return this; }
      var data = this.element.data();
      this.uiDialog = this.element = this.element.detach().data(data).appendTo('body');
      return $.ui.dialog.prototype.open.apply(this);
    },

    close: function() {
      var data = this.element.data();
      this.uiDialog = this.element = this.element.detach().data(data).appendTo(this.container);
      return $.ui.dialog.prototype.close.apply(this);
    },

    _size: function() {},

    _create: function() {
      if(this.options.draggable)
        this._makeDraggable();
    },

    _makeDraggable: function() {
      this.element.draggable({
        cancel: '.modal_window .close',
        handle: '.modal_header',
        containment: 'document'
      });
      
    }
  });

  $.extend($.ui.modal, {
    instances: []
  });
}


