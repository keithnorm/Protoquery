# Protoquery
The concept of Protoquery is to allow you to write code in such a way that it will be syntatically identical in Prototype and jQuery. This is useful for porting large applications from Prototype to jQuery because it allows you to literally swap out Prototype for jQuery instantly with very little modifications to your existing codebase.

Currently Protoquery supports the following Prototype element methods:

    addClassName
    cumulativeOffset
    classNames
    disable
    down
    enable
    fire
    getDimensions
    getHeight
    getStyle
    getWidth
    getValue
    hasClassName
    identify
    insert
    invoke
    match
    observe
    positionedOffset
    readAttribute
    removeClassName
    replace
    request
    select
    setStyle       
    setValue
    stopObserving
    toggleClassName
    up
    update
    viewportOffset
    visible
		writeAttribute


## What does it mean?
It means that you can write something like this and it will work in Prototype and in jQuery + Protoquery:

    $$('p').invoke('insert', {top: 'some content to insert'});

Notice the use of invoke ensures backwards compatibility with existing Prototype code. For instance, if you DON'T care about having your code continue to work in Prototype, you could just write:

    $$('p').insert({top: 'some content to insert'});

The same goes for each element method that Protoquery implements.

# Native Extensions
Prototype adds a lot of methods onto Array, Function and String. Here are the ones that Protoquery supports:

    Array:
      each
      map
      reduce
      inject
      reduceRight
      detect
      select
      reject
      all
      any
      include
      invoke
      pluck
      max
      min
      sortBy
      sortedIndex
      size
      first
      rest
      last
      compact
      flatten
      without
      uniq
      intersect
      zip
      indexOf
      lastIndexOf
      range

    Function:
      bind
      bindAll
      memoize
      delay
      defer
      throttle
      debounce
      wrap
      compose

    String:
      blank        
      capitalize   
      empty        
      escapeHTML   
      evalJSON     
      stripHTML    
      stripTags    
      toQueryParams
      unescapeHTML 

Note: Protoquery uses underscore.js to add these methods (with the exception of String extensions which underscore does not cover), so in order to use native type extensions, you need to also include underscore.js before including Protoquery. Under the hood, Protoquery extends Array and Function by delegating to underscore methods. For instance, it does something like this:

    Function.prototype.bind = function() {
      var args = Array.prototype.slice.apply(arguments);
      args.unshift(this);
      _.bind.apply(window, args);
    }

#Utility Methods
Protoquery also implements several of Prototype's utility methods including:
    
    $H
    $A
    $F
    document.viewport.getDimensions
    document.viewport.getScrollOffsets
    new Element
    new Ajax.Request

# $.toJSON
Lastly, I've added in a toJSON helper in lieu of Prototype's toJSON extension for arrays and hashes. 

    $.toJSON({user: {name: 'jack', email: 'jack@gmail.com'}})
    

# In Conclusion
Protoquery was a project that came out of necessity. It is meant to be a temporary bridge to help port large projects from Prototype to jQuery. It does not (currently) implement every Prototype method, but it's not too far off. If you are using Prototype methods that are not implemented by Protoquery, but would like to use the library, let me know and i'll patch it in! Someday, I may (for fun) get to the point where Prototype's entire test suite will pass using only jQuery and Protoquery.
