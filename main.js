function Value({updater}={}){
  this.update = updater;
  this._value = undefined;
  this._listeners = [];
  this._alters = [];
}

Value.prototype.value = function(){ return this._value; }
Value.prototype.reg = function(listener){ 
  this._listeners.push(listener);
}
Value.prototype.set = function(value){
  if(this.update) return; // A value can either be set() or update()
  const oldValue = this._value;
  this._value = value;
  this._listeners.forEach(listener => listener(value, oldValue));
  this._alters.forEach(altered => altered.update());
}
Value.prototype.alters = function(...values){
  this._alters.push(...values);
}

let wordRegEx = /\b[\w'-]+\b/g;

let title = document.getElementById("output");
let inputBox = document.getElementById("input");
let charCount = document.getElementById("char-count");
let wordCharCount = document.getElementById("word-char-count");
let wordCount = document.getElementById("word-count");
let aveLen = document.getElementById("ave-len");
let punctuationList = document.getElementById("punctuation-list");
let wordList = document.getElementById("word-list");

let titleVal = new Value();
inputBox.addEventListener('keyup', 
  () => titleVal.set(inputBox.value));

let charCountVal = new Value({
  updater: function (){
    this.set(titleVal.value().length);
  }});

let wordCharCountVal = new Value({
  updater: function (){
    let wcc = 0;
    let matches = titleVal.value().match(wordRegEx);
    if(matches){
      wcc = matches.reduce((acc, cur) => acc + cur.length, 0);
    }
    this.set(wcc);
  }});

let wordCountVal = new Value({
  updater: function () {
    let words = titleVal.value().match(wordRegEx);
    let wc = words ? words.length : 0;
    this.set(wc);
  }});

let aveLenVal = new Value({
  updater: function () {
    let avelen = wordCharCountVal.value() / wordCountVal.value();
    this.set(avelen.toFixed(2));
  }});

let punctuationListVal = new Value({
  updater: function (){
    let list = [... new Set(titleVal.value().match(/[^\w\s]/g))]
      .sort()
      .join('');
    this.set(list);
  }});

let wordListVal = new Value({
  updater: function () {
    let list = [... new Set(
      titleVal.value().toLowerCase().match(wordRegEx)
    )]
      .sort()
      .join(" ");
    this.set(list);
  }});

[[titleVal, title],
  [charCountVal, charCount],
  [wordCharCountVal, wordCharCount],
  [wordCountVal, wordCount],
  [aveLenVal, aveLen],
  [punctuationListVal, punctuationList],
  [wordListVal, wordList]
].forEach(([val, target]) => 
  val.reg(() => target.innerText = val.value()));

titleVal.alters(charCountVal,
  wordCharCountVal,
  wordCountVal,
  punctuationListVal,
  wordListVal);

wordCharCountVal.alters(aveLenVal);

wordCountVal.alters(aveLenVal);
 
