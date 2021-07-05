//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

// var encodingTypeSelect = document.getElementById("encodingTypeSelect");
// var recordButton = document.getElementById("startRecording");
// var stopButton = document.getElementById("stopRecording");
//
// add events to those 2 buttons
// recordButton.addEventListener("click", startRecording);
// stopButton.addEventListener("click", stopRecording);


function startRecording() {
	console.log("startRecording() called");

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video: false };

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
		audioContext = new AudioContext();

		//update the format 
		// document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		// encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		encodingType = "wav";

		//disable the encoding selector
		// encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "js/", // must end with slash
		  encoding: encodingType,
		  numChannels: 2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    console.log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    console.log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			console.log("Encoding complete");
			// createDownloadLink(blob, recorder.encoding);
			// encodingTypeSelect.disabled = false;
			sendData(blob);
		};

		function sendData(data) {
			var form = new FormData();
			form.append('file', data, 'data');
			form.append('title', 'valet');
			form.append('language', DATA[CURRENT_ELEMENT_INDEX]['lang']);
			form.append('source-text', DATA[CURRENT_ELEMENT_INDEX]['content']);
			//Chrome inspector shows that the post data includes a file and a title.
			$.ajax({
				type: 'POST',
				url: '/submit-results',
				data: form,
				cache: false,
				processData: false,
				contentType: false
			}).done(function(data) {
				$('#recognized-text')[0].value = data['recognized-text'];
				$('#similarity-score').text(`${data['similarity-score-value']}% of similarity. ${data['similarity-score-comment']}`);
				$('#recording-btn-text')[0].innerText = 'Start recording';
				$('#recording-btn-spinner')[0].hidden = true;
				$('#recording-btn')
            		.removeClass('btn-secondary')
            		.addClass('btn-success')
					.prop('disabled', false);
				console.log(data);
			});
		}

		recorder.setOptions({
		  timeLimit: 600,
		  encodeAfterRecord: encodeAfterRecord,
	      ogg: {quality: 1.0},
	      mp3: {bitRate: 320}
	    });

		//start the recording process
		recorder.startRecording();

		 console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	// recordButton.disabled = false;
    	// stopButton.disabled = true;
		console.log(err);
	});

	//disable the record button
    // recordButton.disabled = true;
    // stopButton.disabled = false;
	console.log('properties changed');
}

function stopRecording() {
	console.log("stopRecording() called");
	// $("#score")[0].innerText = "Generating a score...";

	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	// stopButton.disabled = true;
	// recordButton.disabled = false;
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	console.log('Recording stopped');
}
