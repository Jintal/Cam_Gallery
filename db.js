// IndexexDB is better storage system than LocalStorage with more features also it can handle much bigger data then Localstorage . It is also asynchronous
// To use IndexedDB use following steps :-
// 1 -> Open Database
// 2 -> Creat ObjectStore (Each objectstore will hold a different type of obj. E.g.:- Video ObjectStore will be used to store videos, Audio Objectstore will be used to save audio and so on)
// 3 -> Make transaction (CRUD)

let db;

// It is an async method
// When we first try to open a DB it names the version as 1, so it is considered as a upgrade hence upgraded is printed first and then success.
// After that if we just refresh the DB is not changes so only success is printed
const openRequest = indexedDB.open('myDatabase');

// Add event listener on the request
openRequest.addEventListener('success', function(event){
    console.log('DB success');

    // If database already exist then success will be trigerred so assign here
    db = openRequest.result; 
});

openRequest.addEventListener('error', function(event){
    console.log('DB error');
});

openRequest.addEventListener('upgradeneeded', function(event){
    // When the DB is created fo first time, it prints upgraded first since it changes the version to number 1, so we can get the access to the DB here.
    console.log('DB upgraded');

    // Get access to DB
    db = openRequest.result;

    // ObjectStore can only be created  and modified in upgradeneeded
    // Every object inside the objectStore will have a unique id for it's identification
    db.createObjectStore('video', {keyPath : 'id'});
    db.createObjectStore('image', {keyPath : 'id'});
});

