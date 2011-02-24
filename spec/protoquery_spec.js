describe('jquery.utility', function() {
  it('works', function() {
    expect(true).toBeTruthy();
  });

  describe('$H', function() {
    it('returns an instance of jQuery.Utility.Hash', function() {
      var hash = $H({});
      expect(hash instanceof jQuery.Utility.Hash).toBeTruthy();
    });

    it('has a keys method that returns an array of keys', function() {
      expect($H({1: 'one', 2: 'two', 3: 'three'}).keys()).toEqual(['1','2','3']);
    });

    describe('#each', function() {
      beforeEach(function() {
        hash = $H({key1: 'value1'});
      });
      it('iterates over key/val pairs', function() {
        hash.each(function(pair){
          expect(pair.key).toBe('key1');
          expect(pair.value).toBe('value1');
        });
      });
    });

    describe('#merge', function() {

      it('takes one hash and merges it with another', function() {
        var hash1 = $H({key1: 'value1'});
        var hash2 = {key2: 'value2'};
        hash1.merge(hash2);
        expect(hash1.get('key2')).toBe('value2');
      });

    });

    describe('#get', function() {

      it('retrieves a value by its key', function() {
        var hash = $H({'key': 'value'});
        expect(hash.get('key')).toBe('value');
      });

    });
  });


  describe('$A', function(){

    describe('#each', function() {
      it('iterates over items in array', function() {
        var array = new $.Utility.Array([1, 2, 3]);
        array.each(function(item, index) {
          expect(item).toBe(array[index]);
        });
      });

    });

    describe('#map', function() {

      it('translates items  based on translation callback', function() {
        var array = new $.Utility.Array([1, 2, 3]);
        var translatedArray = array.map(function(el, i) {
          return el + i;
        });
        translatedArray.each(function(el, i){
          expect(el).toBe(array[i] + i);
        });
      });
    });
  });

  describe('Enumberable', function() {
    it('adds Array#each if not natively available', function() {
        var array = [1, 2, 3];
        array.each(function(item, index) {
          expect(item).toBe(array[index]);
        });
    });

    describe('#first', function() {

      it('returns the first item', function() {
        expect([1,2,3].first()).toEqual(1);
      });

    });

    describe('#last', function() {
      it('returns the last item', function() {
        expect([1,2,3].last()).toEqual(3);
      });
    });

    describe('#uniq', function() {
      it('returns unique numbers', function() {
        expect([1,1,2].uniq()).toEqual([1,2]);
      });

      it('returns unique strings', function(){
        expect(['one', 'one', 'two'].uniq()).toEqual(['one', 'two']);
      });

      it('returns unique objects', function() {
        expect([{1: 'one'}, {1: 'one'}].uniq()).toEqual([{1: 'one'}]);
      });
    });

  });


  describe('StringMethods', function() {
    describe('#blank', function() {
      it('is true if string is empty', function() {
        expect(''.blank()).toBeTruthy();
      });

      it('is false if string is not empty', function() {
        expect('something'.blank()).toBeFalsy();
      });
    });

    describe('#stripHTML', function() {
      it('strips all html', function() {
        expect('<p><a href="something.html">some text</a></p>'.stripHTML()).toEqual('some text');
      });

    });
  });

  describe('Control.Modal', function() {
    it('maps jQPos option to position', function() {
      var positionOptions = {
        my: 'top',
        at: 'top',
        of: $('#some_element')
      };
      spyOn($.fn, "modal");
      new Control.Modal('#selector', {
        jQPos: positionOptions
      });
      expect($.fn.modal).wasCalledWith({position: positionOptions, autoOpen: false});
    });
  });

  describe('Ajax.Request', function() {

    var optionMap = {
      'asynchronous': 'async',
      'method'      : 'type',
      'onComplete'  : 'success',
      'onFailure'   : 'error',
      'onSuccess'   : 'success',
      'postBody'    : 'data',
      'parameters'  : 'data'
    };

    it('maps prototype options to jquery options', function() {
      for(var prop in optionMap) {
        var ajax = jasmine.createSpy();
        $.ajax = ajax;
        var inOpts = {}, outOpts = {};
        inOpts[prop] = 'someValue';
        outOpts[optionMap[prop]] = 'someValue';
        outOpts['url'] = 'url';
        new Ajax.Request('url', inOpts);
        expect(ajax).wasCalledWith(outOpts);
      }
    });
  });

  describe('$.fn.each', function() {
    it('maintains callback param order when it is correct', function() {
      $('#fixtures img').each(function(i, el) {
        expect($.type(i)).toEqual('number');
        expect(el.src).toEqual($(el).attr('src'));
      });
    });

    it('reverses callback param order when it is NOT correct', function() {
      $('#fixtures img').each(function(el, i) {
        expect($.type(i)).toEqual('number');
        expect(el.src).toEqual($(el).attr('src'));
      });
    });
    
  });

  describe('$.fn.serialize', function() {

    beforeEach(function() {
      fakeForm = $('<input type="text" name="email" value="me@aol.com">');
    });

    it('serializes to a string by default', function() {
      expect($(fakeForm).serialize()).toEqual('email=me%40aol.com');
    });

    it('serializes to hash if passed true as first param', function() {
      expect($(fakeForm).serialize(true)).toEqual({email: 'me@aol.com'});
    });

  });

});

