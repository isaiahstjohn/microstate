"use strict"

/*
 * Just a sketch of the concept
 *
 */

Value.prototype.stateChange = function (dependencies, updateFun){
  dependencyValues = Array.from({length: dependencies.length});
  function replaceValue(newValue, newValueIndex){
    dependencyValues[newValueIndex] = newValue;
    this._value = updateFun(...dependencyValues);
  } 
  dependencies.forEach((dependency, idx) => {
    dependency[registerListener](
    (newValue) => replaceValue(newValue, idx));
  });
}


let wordRegEx = /\b[\w'-]+\b/g;

let title           = document.getElementById("output");
let inputBox        = document.getElementById("input");
let charCount       = document.getElementById("char-count");
let wordCharCount   = document.getElementById("word-char-count");
let wordCount       = document.getElementById("word-count");
let aveLen          = document.getElementById("ave-len");
let punctuationList = document.getElementById("punctuation-list");
let wordList        = document.getElementById("word-list");

let titleVal            = new Value();
let charCountVal        = new Value();
let wordCharCountVal    = new Value();
let wordCountVal        = new Value();
let aveLenVal           = new Value();
let punctuatuionListVal = new Value();
let wordListVal         = new Value();

charCountVal.stateChange({
  dependencies: [titleVal],
  update: function (newTitle){

  }
});
wordCharCountVal.stateChange({
  dependencies: [titleVal],
  update: function (newTitle){

  }
});
wordCountVal.stateChange({
  dependencies: [titleVal],
  update: function (newTitle){

  }
});
aveLenVal.stateChange({
  dependencies: [wordCharCountVal, wordCountVal],
  update: function (newWordCharCount, newWordCount){
    return (newWordCharCount / newWordCount).toFixed(2);
  }
});
punctuationListVal.stateChange({
  dependencies: [titleVal],
  update: function (newTitle){

  }
});
wordListVal.stateChange({
  dependencies: [titleVal],
  update: function (newTitle){

  }
});






