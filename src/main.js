const video = document.getElementById('videoElement');

async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('../lib/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('../lib/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('../lib/models');
}

async function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing the webcam:', err);
        });
}

async function detectExpressions() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                        .withFaceExpressions();
    if (detections.length > 0) {
        const { expressions } = detections[0];

        //Change the environment based on the emotion
        emotionImage = document.getElementById('emotion');
        emotion=document.getElementById('emotionTxt');
        if (expressions.happy > 0.5) {
            emotionImage.src = '../img/happy.jpg';
            emotion.innerHTML="Happy";
            // document.body.style.backgroundColor = 'red';
        } else if (expressions.sad > 0.5) {
            emotionImage.src = '../img/sad.jpg';
            emotion.innerHTML="Sad";
            // document.body.style.backgroundColor = 'green';
        } else if (expressions.angry > 0.5){
            emotionImage.src = '../img/angry.jpg';
            emotion.innerHTML="Angry";
            // document.body.style.backgroundColor = 'blue';
        }else {
            emotionImage.src = '../img/emotions.jpg';
            emotion.innerHTML="...";
            // document.body.style.backgroundColor = 'white';
        }
    }
    setTimeout(() => detectExpressions(), 1000);
}

loadModels().then(() => {
    startVideo();
    video.onplay = () => {
        detectExpressions();
    };
});