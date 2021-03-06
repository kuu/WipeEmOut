window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;

var audioContext = new AudioContext();
var carrierBuffer = null;

// Debug visualizer stuff here
var analyser1;
//var analyser2;
var analyserView1;
//var analyserView2;

var vocoderCanvas;

var cheapAnalysis;

var recorder;

var recordingslist;

//var recordedData;

function WipeEmOut_DoFSCommand(command, args) {

  var audio = window.bgmAudio, volume;

  if (audio) {
    volume = audio.volume;
    audio.volume /= 2;
  }

  window.swfPlayer.pause();
  window.swfPlayer.container.style.display = 'none';

  var container = document.getElementById('container');
  container.innerHTML = "<h3>Live input to the Vocoder!</h3>";

  var tDiv = document.createElement('div');
  var tCanvas = document.createElement('canvas');
  tCanvas.id = 'view1';
  tCanvas.width = 582;
  tCanvas.height = 480;
  tDiv.appendChild(tCanvas);
  container.appendChild(tDiv);

  getUserMedia({audio:true}, gotStream);

  // initiate auth popup
  SC.connect(function() {
    SC.record({
      start: function() {}
    });
  });

  cheapAnalysis = (navigator.userAgent.indexOf("Android")!=-1)||(navigator.userAgent.indexOf("iPad")!=-1)||(navigator.userAgent.indexOf("iPhone")!=-1);;
	generateVocoderBands( 55, 7040, cheapAnalysis ? 14 : 28 );
	downloadAudioFromURL("/root/assets/junky.ogg", loadCarrier);

	// Debug visualizer
  analyser1 = audioContext.createAnalyser();
  analyser1.fftSize = cheapAnalysis ? 256 : 1024;
  analyser1.smoothingTimeConstant = 0.5;
  //analyser2 = audioContext.createAnalyser();
  //analyser2.fftSize = cheapAnalysis ? 256 : 1024;
  //analyser2.smoothingTimeConstant = 0.5;

  if (cheapAnalysis) {
    analyserView1 = document.getElementById("view1").getContext('2d');
    //analyserView2 = document.getElementById("view2").getContext('2d');
  } else {
	  analyserView1 = new AnalyserView("view1");
	  analyserView1.initByteBuffer( analyser1 );
	  //analyserView2 = new AnalyserView("view2");
	  //analyserView2.initByteBuffer( analyser2 );
	}
  //vocoderCanvas = document.getElementById("vcanvas").getContext('2d');

  initBandpassFilters();

  var range = document.createElement('input');
  range.type = 'range';
  range.min = 0;
  range.max = 10;
  window.voiceOutput.gain.value = range.value = 7.5;
  range.addEventListener('change', function () {
    window.voiceOutput.gain.value = range.value;
  }, false); 
  container.appendChild(range);

  var button = document.createElement('button');
  button.innerText = 'Start recording';
  button.addEventListener('click', function () {
    if (!window.microphone) {
      return;
    }

    if (button.innerText === 'Start recording') {
      recorder = new RecorderJS(window.voiceOutput);
      recorder.record();
      button.innerText = 'Stop recording';
    } else if (button.innerText === 'Stop recording') {
      btnStopRecording();
      button.innerText = 'Upload your voice';
    } else {
      btnUploadVoice(container, volume);
      window.microphone = null;
    }
  }, false);
  container.appendChild(button);

  recordingslist = document.createElement('ul');
  container.appendChild(recordingslist);

  window.swipeObject.disable();
}

function downloadAudioFromURL( url, cb ){
	var request = new XMLHttpRequest();
 request.open('GET', url, true);
 request.responseType = 'arraybuffer';

 // Decode asynchronously
 request.onload = function() {
   audioContext.decodeAudioData( request.response, function(buffer) {
     cb(buffer);
   }, function(){alert("error loading!");});
  }
  request.send();
}

function loadCarrier( buffer ) {
	carrierBuffer = buffer;
	if (/*vocoding*/0) {
		newCarrierNode = audioContext.createBufferSource();
		newCarrierNode.buffer = carrierBuffer;
		newCarrierNode.loop = true;
		newCarrierNode.connect( carrierInput );
		carrierNode.disconnect();
		newCarrierNode.start(0);
		carrierNode.stop(0);
		carrierNode = newCarrierNode;	
	}
}

function stopRecording() {
  recorder && recorder.stop();
  // create WAV download link using audio data blob
  createDownloadLink();
    
  recorder.clear();
  window.voiceOutput.disconnect();
  window.voiceOutput = null;
  recorder = null;
}

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');
      
    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);
    //recordedData = blob;
  });
}

function btnStopRecording() {
  window.microphone.stop();
  stopRecording();
  window.bgmAudio.volume /= 4;

}

function btnUploadVoice(container, volume) {

  SC.recordStop();
  SC.recordUpload({
    track: { title: 'Music Hack Day Tokyo 2014' }
  });

  /*
  Recorder.initialize({swfSrc: recordedData});
  var uri = SC.prepareRequestURI("/tracks", {title: 'test'});
  uri.query.format = "json";
  SC.Helper.setFlashStatusCodeMaps(uri.query);
  var flattenedParams = uri.flattenParams(uri.query);
  Recorder.upload({
    method: "POST",
    url: "https://api.soundcloud.com/tracks",
    audioParam: "track[asset_data]",
    params: flattenedParams,
    success: function(responseText) {
      //var response = SC.Helper.responseHandler(responseText);
      //return callback(response.json, response.error)
    }
  });
  */

  container.innerHTML = '';
  window.bgmAudio.volume = volume;
  var swipe = window.swipeObject;
  var swf = window.swfPlayer;
  swipe.enable();
  swipe.onLeft = function () {
    swf.SetVariable('direction', 'left');
  };
  swipe.onRight = function () {
    swf.SetVariable('direction', 'right');
  };
  swipe.onTap = function () {
    swf.SetVariable('state', 'fire');
  };
  swf.play();
  swf.container.style.display = 'block';
}
