// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyA_riukF7zesz15Z6uycqK8bvKcbDDc8G8",
  authDomain: "bookclub-e4ca9.firebaseapp.com",
  projectId: "bookclub-e4ca9",
  storageBucket: "bookclub-e4ca9.appspot.com",
  messagingSenderId: "156534187660",
  appId: "1:156534187660:web:f980cafd1ff2d0518abda9",
  measurementId: "G-BZRK3BJQ4R"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
let url;

messaging.onBackgroundMessage((payload) => {

  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/logo.png',
  };

  url = `https://bookclub-e4ca9.web.app/questions/${ payload.data.isbn }/${ payload.data.id }`;
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(url)
    );
    console.log('click', url)
  });

  self.registration.showNotification(notificationTitle, notificationOptions);

  
});