var bingClientTTS = new BingTTS.Client("46adbdd87c3e442d92bb33e7f5b5d317");
var speak_text = document.getElementById("speak_text");
var tts_select_one=document.getElementById("tool_one");
var speech = new webkitSpeechRecognition();
speech.lang = "ja";

document.getElementById("play_btn").addEventListener("click", function () {
    
    var answer_text_speak = speak_text.value; 
    var index = tts_select_one.selectedIndex;
    var optionvalue = tts_select_one.options[index].value;
    if (optionvalue == "Microsoft-BingSpeech") {
    	microsoft_speak(answer_text_speak);
    } else{
    	/*
        var su = new SpeechSynthesisUtterance();
        su.lang = "ja";
        su.text = answer_text_speak;
        speechSynthesis.speak(su);
        */
    	html_speak(answer_text_speak);
   
    }
});

function microsoft_speak(answer_text_speak){
	bingClientTTS.multipleXHR = document.getElementById("multipleXHRChk").checked;
    bingClientTTS.synthesize(answer_text_speak, BingTTS.SupportedLocales.jpJP_Female);
}

function html_speak(answer_text_speak) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]{5,}");
    for(i=0;i<100;i++)
        answer_text_speak = answer_text_speak.replace(pattern, '')

    var splitPatten = new RegExp("[、。？?]")
    var res = answer_text_speak.split(splitPatten)

    for(var j = 0; j < res.length; j++){
      if (navigator.userAgent.indexOf("Chrome") > -1){
        responsiveVoice.speak(
            res[j],
            'Japanese Female',
            {
              rate: 1.0
            }
        );
      }
    }
}






