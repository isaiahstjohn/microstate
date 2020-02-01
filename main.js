function escape(s){
  return s.replace(/[&<>]/g, c => "&#" + c.charCodeAt(0) + ";");
}


function Value(initialValue, validator){
  this._value = initialValue;
  this._listeners = [];
  this._validator = validator;
  this.FAIL = 1;
}

Value.prototype.get = function(){ return this._value; }
Value.prototype.reg = function(listener){ 
  this._listeners.push(listener);
}
Value.prototype.set = function(value){
  if(this._validator && !this._validator(value, this._value)){
    return this.FAIL;
  }
  const oldValue = this._value;
  this._value = value;
  this._listeners.forEach(listener => listener(value, oldValue));
}
let titleEl = document.getElementById("output");
let inputBox = document.getElementById("input");
let charCount = document.getElementById("char-count");
let wordCharCount = document.getElementById("word-char-count");
let wordCount = document.getElementById("word-count");
let aveLen = document.getElementById("ave-len");
let punctuationList = document.getElementById("punctuation-list");
let wordList = document.getElementById("word-list");

let title = new Value("");
let wordCharCountVal = new Value(0);
let wordCountVal = new Value(0);

inputBox.addEventListener('keyup', () => title.set(inputBox.value));
/*
 * [title]
 * charCount, punctuationList, wordList
 *  [wordCharCount]
 *    aveLen
 *  [wordCount]
 *    aveLen
*/
title.reg(displayTitle);
title.reg(displayCharCount);
title.reg(displayPunctuationList);
title.reg(displayWordList);

title.reg(updateWordCharCount);
title.reg(updateWordCount);

wordCharCountVal.reg(displayWordCharCount);
wordCharCountVal.reg(displayAveLen);

wordCountVal.reg(displayWordCount);
wordCountVal.reg(displayAveLen);

let wordRegEx = /\b[\w'-]+\b/g;

function updateWordCharCount(){
  let wcc = 0;
  let matches = title.get().match(wordRegEx);
  if(matches){
    wcc = matches.reduce((acc, cur) => acc + cur.length, 0);
  }
  wordCharCountVal.set(wcc);
}
function updateWordCount(){
  let words = title.get().match(wordRegEx);
  let wc = words ? words.length : 0;
  wordCountVal.set(wc);
  wordCount.innerHTML = wc;
}
function displayTitle(){
  titleEl.innerText = title.get();
}
function displayCharCount(){
  charCount.innerText = title.get().length;
}
function displayPunctuationList(){
  let list = [... new Set(title.get().match(/[^\w\s]/g))]
    .sort()
    .join('');
  punctuationList.innerHTML = escape(list);
}
function displayWordList(){
  let list = [... new Set(title.get().toLowerCase().match(wordRegEx))]
    .sort()
    .map(word => escape(word))
    .join(" ");
  wordList.innerHTML = escape(list);
}
function displayWordCharCount(){
  console.log(wordCharCountVal.get());
  wordCharCount.innerText = wordCharCountVal.get();

}
function displayWordCount(){
  wordCount.innerText = wordCountVal.get();
}
function displayAveLen(){
  let avelen = wordCharCountVal.get() / wordCountVal.get();
  aveLen.innerHTML = avelen.toFixed(2);
}
