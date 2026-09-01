// 1. आपकी Firebase Config
const firebaseConfig = {
  apiKey: "आपकी_FIREBASE_API_KEY",
  authDomain: "आपकी_AUTH_DOMAIN",
  databaseURL: "आपकी_DATABASE_URL",
  projectId: "आपकी_PROJECT_ID",
  storageBucket: "आपकी_STORAGE_BUCKET",
  messagingSenderId: "आपकी_SENDER_ID",
  appId: "आपकी_FIREBASE_APP_ID"
};

// Firebase शुरू करें
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. लाइव नोटिस बोर्ड सिंक करना
database.ref('notice').on('value', (snapshot) => {
  const notice = snapshot.val();
  document.getElementById('notice-content').innerText = notice || "हाल ही में कोई नया नोटिस नहीं है।";
});

// 3. डायरेक्टरी सिंक करना
database.ref('directory').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const panchList = document.getElementById('panch-list');
    panchList.innerHTML = `
      <li><b>सरपंच:</b> ${data.sarpanch || 'उपलब्ध नहीं'}</li>
      <li><b>सचिव:</b> ${data.sachiv || 'उपलब्ध नहीं'}</li>
    `;
  }
});

// 4. Cloudinary फोटो/वीडियो अपलोड
function uploadMedia() {
  const fileInput = document.getElementById('imageInput');
  const file = fileInput.files[0];
  const status = document.getElementById('uploadStatus');

  if (!file) {
    status.innerText = "कृपया कोई फोटो या वीडियो चुनें!";
    status.style.color = "red";
    return;
  }

  status.innerText = "अपलोड हो रहा है...";
  status.style.color = "blue";

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'आपका_CLOUDINARY_PRESET'); 

  fetch('https://api.cloudinary.com/v1_1/आपका_CLOUD_NAME/auto/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    status.innerText = "अपलोड सफलतापूर्वक हो गया!";
    status.style.color = "green";
    
    database.ref('uploads').push({
      url: data.secure_url,
      timestamp: Date.now()
    });
  })
  .catch(error => {
    status.innerText = "अपलोड करने में त्रुटि हुई।";
    status.style.color = "red";
    console.error(error);
  });
}
