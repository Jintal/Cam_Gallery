'use strict'

const video = document.querySelector('video');
const recordBtnCnt = document.querySelector('.record-btn-cont');
const recordBtn = document.querySelector('.record-btn');
const captureBtnCnt = document.querySelector('.capture-btn-cont');
const captureBtn = document.querySelector('.capture-btn');
const timer = document.querySelector('.timer');
const filterLayer = document.querySelector(".filter-layer");
const allFilters = [...document.querySelectorAll(".filter")];


// Because the stream is not continous the media comes in chunks and then it shows them.
const mediaChunks = [];
let transparentColor = "transparent";
let recordFlag = false;
let recorder;
let timerID;
// Total time since started recording
let cntr = 0;   





const constraints = {
    video:true,
    audio:true
}

// It returns a stream of audio and video from the camera
// navigator -> Global object returns info about browser
// mediadevices -> It is an interface to connect aduio and video devies
// getUserMedia -> It prompts the user with popup for asking permission then provides a 'MediaStream' containing video/audio

navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream){
        video.srcObject = stream;

        // To record the input mediastrem we use mediarecorder API
        recorder = new MediaRecorder(stream);

        recorder.addEventListener('start', function(event){
            mediaChunks.splice(0, mediaChunks.length);
        });

        recorder.addEventListener('dataavailable', function(event){
            mediaChunks.push(event.data);
        });

        recorder.addEventListener('stop', function(event){
            // Convert the collected media chunks to video
            const blob = new Blob(mediaChunks, {type : 'video/mp4'});

            // Store video in DB
            if(db) {
                const videoID = shortid();
                const dbTransaction = db.transaction("video", 'readwrite');
                const videoStore = dbTransaction.objectStore('video');
                const videoEntry = {
                    id : `vid-${videoID}`,
                    blobData : blob
                };
                videoStore.add(videoEntry);
            }

            // Download Video
            // const videoURL = URL.createObjectURL(blob);
            // const a = document.createElement('a');
            // a.href = videoURL;
            // a.download = 'stream.mp4';
            // a.click();
        });
    })


recordBtnCnt.addEventListener('click', function(event){
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag) {
        // Start recording
        recorder.start();

        // Add animation
        recordBtn.classList.toggle('scale-record');

        // Call Timer
        startTimer();
    } else {
        // Stop recording
        recorder.stop();

        // Remove animation
        recordBtn.classList.toggle('scale-record');

        // Stop Timer
        stopTimer();
    }
});


captureBtnCnt.addEventListener("click", function(event) {
    captureBtn.classList.toggle("scale-capture");

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Filtering 
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    const imageURL = canvas.toDataURL();

    // Store image in DB
    if(db) {
        const imageID = shortid();
        const dbTransaction = db.transaction("image", 'readwrite');
        const imageStore = dbTransaction.objectStore('image');
        const imageEntry = {
            id : `img-${imageID}`,
            url : imageURL
        };
        imageStore.add(imageEntry);
    }

    // Image Download
    // const a = document.createElement('a');
    // a.href = imageURL;
    // a.download = 'image.jpeg';
    // a.click();

    setTimeout(() => {
        captureBtn.classList.toggle("scale-capture");
    }, 500);
});


function startTimer() {
    timer.style.display = 'block';

    function displayTimer() {
        cntr++;

        let time = cntr;

        let hr = Number.parseInt(time/3600);
        time %= 3600;
        let mint = Number.parseInt(time/60);
        time %= 60;
        let sec = time;

        hr = (hr < 10) ? `0${hr}`: hr;
        mint = (mint < 10) ? `0${mint}` : mint;
        sec = (sec < 10) ? `0${sec}` : sec;

        timer.textContent = `${hr}:${mint}:${sec}`;

    }

    timerID = setInterval(displayTimer, 1000);
}


function stopTimer() {
    clearTimeout(timerID);
    cntr = 0;
    timer.textContent = '00:00:00';
    timer.style.display = 'none';
}


// Filtering logic
allFilters.forEach(function (filterElem) {
    filterElem.addEventListener("click", function(event) {
        // Get style
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})

