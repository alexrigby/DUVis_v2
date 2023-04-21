export function capitalizeEachWord(words) {
  var secCopy = words.slice();
  var capSecWords = secCopy.split(" ");
  capSecWords.forEach((word, i) => (capSecWords[i] = word[0].toUpperCase() + word.substring(1)));
  return capSecWords.join(" ");
}

export default capitalizeEachWord;
