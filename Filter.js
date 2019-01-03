var Filter = (function() {
  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   */
  function Filter(options) {
    options = options || {};
    this.list = options.emptyList && [] || options.list || [];//Array.prototype.concat.apply(localList, [baseList, options.list || []]);
    this.exclude = options.exclude || [];
    this.placeHolder = options.placeHolder || '*';
    this.regex = options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g;
    this.replaceRegex = options.replaceRegex || /\w/g;
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  Filter.prototype.isProfane = function isProfane(string) {
    return string
      .split(' ')
      .map(function(w) {
        return w.toLowerCase().replace(this.regex, '');
      }, this)
      .filter(this.isProfaneLike, this)
      .shift() || false;
  };

  /**
   * Determine if a single word is profane or looks profane.
   * @param {string} word - String to evaluate for profanity.
   */
  Filter.prototype.isProfaneLike = function profaneLike(word) {
    if (!!~this.exclude.indexOf(word)) {
      return false;
    }

    if (!!~this.list.indexOf(word)) {
      return true;
    }

    return this.list
      .map(function(w) {
        return new RegExp('^' + w.replace(/(\W)/g, '\\$1') + '$', 'gi');
      }, this)
      .reduce(function(outcome, wordExp) {
        return outcome || wordExp.test(word);
      }, false);
  };

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  Filter.prototype.replaceWord = function replaceWord(string) {
    return string.replace(this.regex, '').replace(this.replaceRegex, this.placeHolder);
  };

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  Filter.prototype.clean = function clean(string) {
    return string.split(/\b/).map(function(word) {
      return this.isProfane(word) ? this.replaceWord(word) : word;
    }.bind(this)).join('');
  };

  /**
   * Add words to blacklist filter / remove words from whitelist filter
   * @param {(string|string[])}
   */ 
  Filter.prototype.addWords = function addWords(words) {
    words = (words instanceof Array) ? words : [words];
    this.list = this.list.concat(words);

    words.forEach(function(word) {
      if(!!~this.exclude.indexOf(word)) {
        this.exclude.splice(this.exclude.indexOf(word), 1);
      }
    }, this);
  };

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word to add to whitelist.
   */ 
  Filter.prototype.removeWords = function removeWords() {
    var words = Array.prototype.slice.call(arguments);
    this.exclude.push.apply(this.exclude, words);
  };

  return Filter;
})();

/*
filter = new Filter({emptyList:true});
filter.addWords(...['hol']);
console.log(filter.isProfane("Don't be a hol"));
*/

/*
//change placeholder
var customFilter = new Filter({ placeHolder: 'x'});
console.log(customFilter.clean('Don\'t be an ash0le'));

//custom regex
var mfilter = new Filter({ regex: /\*|\.|$/gi });
console.log(mfilter.clean("Don't be an ash0le"));

//Add words
filter = new Filter();
filter.addWords('some', 'bad', 'word');
console.log(filter.clean("some bad word!"));
 
filter = new Filter();
//or use an array using the spread operator
newBadWords = ['some', 'bad', 'word'];
filter.addWords(...newBadWords);
console.log(filter.clean("some bad word!"));

//Instantiate with an empty list
filter = new Filter({ emptyList: true }); 
filter.clean('hell this wont clean anything');

filter = new Filter(); 
filter.removeWords('hells','sadist');
console.log(filter.clean("some hells word!"));
 
//or use an array using the spread operator
removeWords = ['hells', 'sadist'];
filter.removeWords(...removeWords);
console.log(filter.clean("some sadist hells word!")); //some sadist hells word!
*/