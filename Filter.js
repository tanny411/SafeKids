class Filter {

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
    constructor(options = {}) {
      Object.assign(this, {
        list: options.emptyList && [] || ['testWord'],
        exclude: options.exclude || [],
        placeHolder: options.placeHolder || '*',
        regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
        replaceRegex: options.replaceRegex || /\w/g
      })
    }
  
    /**
     * Determine if a string contains profane language.
     * @param {string} string - String to evaluate for profanity.
     */
    isProfane(string) {
      return this.list
        .filter((word) => {
          const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
          return !this.exclude.includes(word) && wordExp.test(string);
        })
        .length > 0 || false;
    }
  
    /**
     * Replace a word with placeHolder characters;
     * @param {string} string - String to replace.
     */
    replaceWord(string) {
      return string
        .replace(this.regex, '')
        .replace(this.replaceRegex, this.placeHolder);
    }
  
    /**
     * Evaluate a string for profanity and return an edited version.
     * @param {string} string - Sentence to filter.
     */
    clean(string) {
      return string.split(/\b/).map((word) => {
        return this.isProfane(word) ? this.replaceWord(word) : word;
      }).join('');
    }
  
    /**
     * Add word(s) to blacklist filter / remove words from whitelist filter
     * @param {...string} word - Word(s) to add to blacklist
     */
    addWords() {
      let words = Array.from(arguments);
  
      this.list.push(...words);
  
      words.forEach((word) => {
        if (this.exclude.includes(word)) {
          this.exclude.splice(this.exclude.indexOf(word), 1);
        }
      });
    }
  
    /**
     * Add words to whitelist filter
     * @param {...string} word - Word(s) to add to whitelist.
     */
    removeWords() {
      this.exclude.push(...Array.from(arguments));
    }
  }

/*
filter = new Filter();
console.log(filter.clean("Don't be an ash0le"));
/*
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