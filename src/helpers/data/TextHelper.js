class TextHelper {


  /**
   * 
   * @param {String} str String to Translate 
   */
  sentenceCase = str => {
    str = String(str);
    str = str.toLowerCase();
    return str.replace(/[a-z]/i, (letter) => letter.toUpperCase()).trim();
  }

  titleCase = (str) => {
    str = String(str);
    str = str.toLowerCase().split(' ');
    let final = [];
    for (let word of str) {
      final.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
    return final.join(' ');
  }

  /**
   * @author Sanchit Dang
   * @param {String} time 
   */
  formatTime(time) {
    let newTime = new Date(time);
    return typeof newTime === "object" ? newTime.toLocaleDateString("en-US") : newTime;
  }
}

const instance = new TextHelper();
export default instance;
