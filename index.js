const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

(function() {
    const Colors = [ 'Aqua' , 'Azure' , 'Beige', 'Bisque', 'Black', 'Blue', 'Brown', 'Chocolate', 'Coral', 'AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'];
    const Grammar = `#JSGF V1.0; grammar Colors; public <Color> = ${Colors.join(' | ')} ;`

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    let recognition = new SpeechRecognition();
    let speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(Grammar, 1);
    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 4;
    console.warn(recognition);


    let diagnostic = document.querySelector(".output");
    let outputWrap = document.querySelector(".output-wrap");
    let bg = document.querySelector("body");
    let hints = document.querySelector(".hints");
    let overlay = document.querySelector(".speech-overlay");
    let footer = document.querySelector("footer");
    let shuffledColors = shuffle(Colors);
    let colorHTML= '';
    shuffledColors.forEach(function(color, index){
        colorHTML += '<span style="background-color:' + color + ';"> ' + color + ' </span>';
    });
    console.warn(hints);
    hints.innerHTML += colorHTML;

    document.body.onclick = function() {
        recognition.start();
        console.log('Ready to receive a color command.');
        overlay.style.display = "block";
    }
    footer.onclick = function(ev) {
        ev.stopPropagation();
    }

    recognition.onresult = (event) => {
        let last = event.results.length - 1;
        let color = event.results[last][0].transcript;
        color = color.split(" ");
        let formattedColor = color.map((colorWord) => {
            colorWord = colorWord[0].toUpperCase() + colorWord.substring(1);
            return colorWord;
        });
        color = formattedColor;
        color = color.join("");
        for (let i = 0; i < event.results.length; i++) {
            let result = event.results[i];
            for (let j = 0; j < result.length; j++) {
                let match = result[j];
                console.warn(`Matched speech with word: ${match.transcript} | Confidence ${(match.confidence * 100).toFixed(2)}%`);
            }
        }

        if (Colors.indexOf(color) > -1) {
            diagnostic.textContent = 'Matched color: ' + color + '.';
            console.warn("setting matched color: " + color);
            bg.style.backgroundColor = color;
            outputWrap.style.backgroundColor = color;
        }
        else {
            diagnostic.textContent = 'You said: "' + color + '" but no match was found. Try again!';
            bg.style.backgroundColor = "white";
            outputWrap.style.backgroundColor = "white";
        }
    };
    recognition.onspeechend = () => {
        recognition.stop();
        overlay.style.display = "none";
    };
    recognition.onnomatch = () => {
        diagnostic.textContent = "No recognition found";
        overlay.style.display = "none";
        bg.style.backgroundColor = "white";
    }
    recognition.onerror = (event) => {
        diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
        overlay.style.display = "none";
        bg.style.backgroundColor = "white";
    };
})();






