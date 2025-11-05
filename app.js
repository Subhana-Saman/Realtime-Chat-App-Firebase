  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , GoogleAuthProvider , signInWithPopup , signOut} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
 import {getDatabase , ref, push, onChildAdded , update, remove ,onChildChanged , onChildRemoved }  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js"
 
 
 const firebaseConfig = {
    apiKey: "AIzaSyCE00Iq-vCIz19uuD_CsB5S9TeJs9MKLgM",
    authDomain: "real-time-database-8ca56.firebaseapp.com",
    databaseURL: "https://real-time-database-8ca56-default-rtdb.firebaseio.com",
    projectId: "real-time-database-8ca56",
    storageBucket: "real-time-database-8ca56.appspot.com",
    messagingSenderId: "395187705387",
    appId: "1:395187705387:web:c47ff0c77a3b963d6afc6e",
    measurementId: "G-48E6KVHVV4"
  };


  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app)
  const provider =  new GoogleAuthProvider();
  const db = getDatabase(app)

  // Sign Up code
  document.getElementById('signup')?.addEventListener('click',()=>{
    const email = document.getElementById('email').value ;
    const password = document.getElementById('password').value ;

    createUserWithEmailAndPassword(auth , email ,password)
    .then(()=>{
        alert('SignUp Successfully')
        window.location.href = 'user.html'
    })
    .catch((error)=>{
     alert(error.message)
    })
  })

  // login code

   document.getElementById('login')?.addEventListener('click',()=>{
    const email = document.getElementById('email').value ;
    const password = document.getElementById('password').value ;

    signInWithEmailAndPassword(auth , email ,password)
    .then(()=>{
        alert('Login Successfully')
        window.location.href = 'user.html'
    })
    .catch((error)=>{
     alert(error.message)
    })
  })

  // logout
document.getElementById('logout')?.addEventListener('click',()=>{
    signOut(auth)
    .then(()=>{
        alert('Logout Successfully')
        window.location.href = 'index.html'
    })
     .catch((error)=>{
     alert(error.message)
    })
})
// Continue with Google
document.getElementById('google-btn')?.addEventListener('click', ()=>{
  signInWithPopup(auth, provider)
  .then(()=>{
    alert('Login Successfully')
    window.location.href ='user.html'
  })
  .catch((error)=>{
    alert(error.message)
  })
})

document.getElementById('user-btn')?.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();

  if (username === "") {
    alert("Please enter a username");
    return;
  }

  localStorage.setItem("chatUser", username); // ✅ Save username
  window.location.href = "chat.html"; // ✅ Move to chat page
});



// chat app page code
window.sendMessage =  function () {
  const username = localStorage.getItem("chatUser"); // ✅ Get saved username
  const message = document.getElementById('message').value.trim();

  if (!username) {
    alert("Username missing! Go back and enter username.");
    window.location.href = "user.html";
    return;
  }

  if (message === "") return;

  if (message.length > 500) {  // NEW: Limit message length to 500 characters
    alert('Message too long! Max 500 characters.');
    return;
  }

  push(ref(db, "messages"), {
    name: username,
    text: message
  });

  document.getElementById('message').value = "";
};


function createMessageElement(id, data) {
  const wrapper = document.createElement("div");
  wrapper.className = "message-item";
  wrapper.dataset.id = id;

  const currentUser = localStorage.getItem("chatUser");

  if (data.name === currentUser) {
    wrapper.classList.add("own");
  }

  // Message Text
  const textP = document.createElement("p");
  textP.className = "message-text";
  textP.textContent = `${data.text}`;
  wrapper.appendChild(textP);

  // USERNAME small label
  const userLabel = document.createElement("span");
userLabel.className = "user-label";
userLabel.textContent = data.name;
wrapper.insertBefore(userLabel, textP); // ✅ Username uper


  // ✅ Only your own messages should have action buttons
  if (data.name === currentUser) {
    const actionRow = document.createElement("div");
    actionRow.className = "message-actions";

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "  ✏️";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editMsg(id, data.text);

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "  🗑️";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      if (confirm("Delete this message?")) deleteMsg(id);
    };

    actionRow.appendChild(editBtn);
    actionRow.appendChild(delBtn);
    wrapper.appendChild(actionRow);
  }

  return wrapper;
}

// on new message
onChildAdded(ref(db, "messages"), function(snapshot) {
  const data = snapshot.val();
  const id = snapshot.key;
  const msgBox = document.getElementById('messages');

  const msgEl = createMessageElement(id, data);
  msgBox.appendChild(msgEl);
  msgBox.scrollTop = msgBox.scrollHeight;
});

// when a message is edited -> update the element
onChildChanged(ref(db, "messages"), function(snapshot) {
  const data = snapshot.val();
  const id = snapshot.key;
  const msgBox = document.getElementById('messages');
  const existing = msgBox.querySelector(`.message-item[data-id="${id}"]`);
  if (existing) {
    const textP = existing.querySelector('.message-text');
    textP.textContent = `${data.name} : ${data.text}`;
  }
});

// when a message is removed -> remove the element
onChildRemoved(ref(db, "messages"), function(snapshot) {
  const id = snapshot.key;
  const msgBox = document.getElementById('messages');
  const existing = msgBox.querySelector(`.message-item[data-id="${id}"]`);
  if (existing) existing.remove();
});

function deleteMsg(id) {
  remove(ref(db, "messages/" + id))
    .catch(err => alert('Delete error: ' + err.message));
}

function editMsg(id, oldText) {
  const newText = prompt('Edit message', oldText);
  if (newText == null) return; // user cancelled
  const trimmed = newText.trim();
  if (trimmed === '') {
    alert('Message cannot be empty.');
    return;
  }
  if (!confirm('Confirm edit?')) return;  // NEW: Add confirmation to prevent accidental edits
  update(ref(db, "messages/" + id), { text: trimmed })
    .catch(err => alert('Update error: ' + err.message));
}
