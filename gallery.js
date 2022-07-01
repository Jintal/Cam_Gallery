// To let the page load

setTimeout(
    function() {
        if(db) {
            // video retreival
            const dbTransaction = db.transaction('video', 'readonly');
            const videoStore = dbTransaction.objectStore('video');
            const videoRequest = videoStore.getAll(); // Event driven
            videoRequest.onsuccess = function(event) {
                const videoResult = videoRequest.result;
                const galleryCont = document.querySelector('.gallery-cont');

                videoResult.forEach(function(videoObj){
                    const mediaElem = document.createElement('div');
                    mediaElem.setAttribute('class', 'media-cont');
                    mediaElem.setAttribute('id', videoObj.id);

                    const url = URL.createObjectURL(videoObj.blobData);

                    mediaElem.innerHTML = `
                    <div class="media">
                        <video autoplay loop src="${url}"></video>
                    </div>
                    <div class="download action-btn">DOWNLOAD</div>
                    <div class="delete action-btn">DELETE</div>
                    `;
                    
                    galleryCont.appendChild(mediaElem);


                    const deleteBtn = mediaElem.querySelector('.delete');
                    const downloadBtn = mediaElem.querySelector('.download');

                    deleteBtn.addEventListener('click', deleteListener);
                    downloadBtn.addEventListener('click', downloadListener);
                });
            };
        
            // image retreival
            const dbTransactionImg = db.transaction('image', 'readonly');
            const imageStore = dbTransactionImg.objectStore('image');
            const imageRequest = imageStore.getAll(); // Event driven
            imageRequest.onsuccess = function(event) {
                const imageResult = imageRequest.result;
                const galleryCont = document.querySelector('.gallery-cont');

                imageResult.forEach(function(imageObj){
                    const mediaElem = document.createElement('div');
                    mediaElem.setAttribute('class', 'media-cont');
                    mediaElem.setAttribute('id', imageObj.id);

                    const url = imageObj.url;

                    mediaElem.innerHTML = `
                    <div class="media">
                        <img src="${url}"/>
                    </div>
                    <div class="download action-btn">DOWNLOAD</div>
                    <div class="delete action-btn">DELETE</div>
                    `;
                    galleryCont.appendChild(mediaElem);


                    const deleteBtn = mediaElem.querySelector('.delete');
                    const downloadBtn = mediaElem.querySelector('.download');

                    deleteBtn.addEventListener('click', deleteListener);
                    downloadBtn.addEventListener('click', downloadListener);
                });
            };
        }
    }
, 100);

// Remove from UI and DB
function deleteListener(event) {
    // DB Removal
    // Each media container has an unique ID
    const id = event.target.parentElement.getAttribute('id');
    
    // Check if the element contains image or video
    if(id.slice(0, 3) === 'vid') {
        const dbTransaction = db.transaction('video', 'readwrite');
        const videoStore = dbTransaction.objectStore('video');
        videoStore.delete(id);
    } else if(id.slice(0, 3) === 'img'){
        const dbTransactionImg = db.transaction('image', 'readwrite');
        const imageStore = dbTransactionImg.objectStore('image');
        imageStore.delete(id);
    }

    // UI Removal
    event.target.parentElement.remove();
}

function downloadListener(event) {
    
    const id = event.target.parentElement.getAttribute('id');
    if(id.slice(0, 3) === 'vid') {
        const dbTransaction = db.transaction('video', 'readwrite');
        const videoStore = dbTransaction.objectStore('video');
        const videoRequest = videoStore.get(id);

        videoRequest.onsuccess = function(event) {
            const videoResult = videoRequest.result;
            const videoURL = URL.createObjectURL(videoResult.blobData);
            const a = document.createElement('a');
            a.href = videoURL;
            a.download = 'stream.mp4';
            a.click();
        }
    } else if(id.slice(0, 3) === 'img'){
        const dbTransactionImg = db.transaction('image', 'readwrite');
        const imageStore = dbTransactionImg.objectStore('image');
        const imageRequest = imageStore.getAll(); // Event driven
        
        imageRequest.onsuccess = function(event) {
            const imageResult = imageRequest.result;
            const a = document.createElement('a');
            a.href = imageResult.url;
            a.download = 'image.jpeg';
            a.click();
        }
    }
}