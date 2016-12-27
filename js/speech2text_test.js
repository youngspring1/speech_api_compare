var client;
var request;
var output = document.getElementById("output");
var tts_select=document.getElementById("tool_two");
//var webspeech = new webkitSpeechRecognition();

document.getElementById("speak_btn").addEventListener("click", function () {
    output.value = "";
    var textresult = speak_text.value; 
    var index = tts_select.selectedIndex;
    var optionvalue = tts_select.options[index].value;
    if (optionvalue == "Microsoft-BingSpeech") {
    	
    	start();
    } else{
    	
    	htmlSpeech();
    	
    }
});

function htmlSpeech(){
  
    var recognizer = new webkitSpeechRecognition();
    
    recognizer.lang = "ja";
    recognizer.onresult = function(event) {
    	console.log(event);
    if (event.results.length > 0) {
        var result = event.results[event.results.length-1];
        if(result.isFinal) {
        	output.value = result[0].transcript;
        }
      }  
    };
    
    recognizer.start();
}


function useMic() {
    return document.getElementById("useMic").checked;
}

function getMode() {
    return Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase;
}

function getKey() {
    return "2dff5d9da5ee4cb59fcdaaaf630793a2";
}

function getLanguage() {
    //return "en-us";
    return "ja-JP";
}

function clearText() {
    document.getElementById("output").value = "";
}

function setText(text) {
    document.getElementById("output").value += text;
}

function getLuisConfig() {
    var appid = document.getElementById("luis_appid").value;
    var subid = document.getElementById("luis_subid").value;

    if (appid.length > 0 && subid.length > 0) {
        return { appid: appid, subid: subid };
    }

    return null;
}

function start() {
    var mode = getMode();
    var luisCfg = getLuisConfig();

    clearText();

    if (useMic()) {
        if (luisCfg) {
            client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClientWithIntent(
                getLanguage(),
                getKey(),
                luisCfg.appid,
                luisCfg.subid);
        } else {
            client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
                mode,
                getLanguage(),
                getKey());
        }
        client.startMicAndRecognition();
        setTimeout(function () {
            client.endMicAndRecognition();
        }, 5000);
    } else {
        if (luisCfg) {
            client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createDataClientWithIntent(
                getLanguage(),
                getKey(),
                luisCfg.appid,
                luisCfg.subid);
        } else {
            client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createDataClient(
                mode,
                getLanguage(),
                getKey());
        }
        request = new XMLHttpRequest();
        request.open(
            'GET',
            (mode == Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase) ? "whatstheweatherlike.wav" : "batman.wav",
            true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            if (request.status !== 200) {
                setText("unable to receive audio file");
            } else {
                client.sendAudio(request.response, request.response.length);
            }
        };

        request.send();
    }

    client.onPartialResponseReceived = function (response) {
        setText(response);
    }

    client.onFinalResponseReceived = function (response) {
        //setText(JSON.stringify(response));
        setText(response[0].transcript);
        
    }

    client.onIntentReceived = function (response) {
        setText(response);
    };
}