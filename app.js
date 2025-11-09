
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged ,  sendPasswordResetEmail, GoogleAuthProvider , signInWithPopup , signOut} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
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
        Swal.fire({
       icon: "success",          // success, error, warning, info
       title: "Login Successfully",
         text: "Welcome!",
           theme: 'light'
        });

       setTimeout(()=>{
        window.location.href = "user.html";
        }, 1500)
    })
  .catch((error)=>{
  Swal.fire({
  icon: "error",
  title: "Login Failed",
    theme: 'light',
  text: error.message
});

})

  })

  // login code

   document.getElementById('login')?.addEventListener('click',()=>{
    const email = document.getElementById('email').value ;
    const password = document.getElementById('password').value ;

    signInWithEmailAndPassword(auth , email ,password)
    .then(()=>{
     Swal.fire({
       icon: "success",          // success, error, warning, info
       title: "Login Successfully",
         text: "Welcome!",
           theme: 'light'
        });
       setTimeout(()=>{
        window.location.href = "user.html";
        }, 1500);
       
    })
    .catch((error)=>{
  window.Swal.fire({
  icon: "error",
  title: "Login Failed",
    theme: 'light',
  text: error.message
});

})

  })
  

  // logout
  document.getElementById('logout')?.addEventListener('click',()=>{
    signOut(auth)
    .then(()=>{

     Swal.fire({
       icon: "success",          // success, error, warning, info
       title: "Logout Successfully",
         text: "Welcome!",
           theme: 'light'
    
        });
       setTimeout(()=>{
        window.location.href = "index.html";
        }, 1200);
    })
     .catch((error)=>{
     alert(error.message)
    })
})
// Continue with Google
document.getElementById('google-btn')?.addEventListener('click', ()=>{
  signInWithPopup(auth, provider)
  .then(()=>{
     Swal.fire({
       icon: "success",          // success, error, warning, info
       title: "Login Successfully",
         text: "Welcome!",
           theme: 'light'
        });
    setTimeout(()=>{
        window.location.href = "user.html";
        }, 1500);
  })
  .catch((error)=>{
  window.Swal.fire({
  icon: "error",
  title: "Login Failed",
   theme: 'light',
  text: error.message
});

})

})


//Reset code

document.getElementById("reset-password-link")
  ?.addEventListener("click", (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Reset Password",
      text: "Please enter your email address:",
      input: "email",
      inputPlaceholder: "you@example.com",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const email = result.value;

        sendPasswordResetEmail(auth, email)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Email Sent!",
              text: "Check your inbox for password reset instructions.",
                theme: 'light'
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
                theme: 'light',
              text: error.message,
            });
          });

      } else if (!result.value) {
        Swal.fire({
          icon: "warning",
          title: "No Email Entered",
          text: "Please enter a valid email address.",
            theme: 'light'
        });
      }
    });
  });

  onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.includes("user.html")) {
    document.getElementById("user-email").textContent = user.email;
  } else if (!user && window.location.pathname.includes("user.html")) {
    window.location.href = "index.html";
  }
});



document.getElementById('user-btn')?.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();

if (username === "") {
    window.Swal.fire({
  icon: "warning",
  title: "Missing Field",
  text: "Please enter a username",
  them :"light"
});

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

// 📌 Simple Time Setup
const now = new Date();
const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

push(ref(db, "messages"), {
  name: username,
  text: message,
  time: time // ✅ Save Time
});


  document.getElementById('message').value = "";
  
}; 


// ✅ Enter Key to Send Message
document.getElementById("message")?.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Stop new line
    sendMessage();      // Call your send function
  }
});


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

  // 🕒 Time Label
const timeLabel = document.createElement("span");
timeLabel.className = "message-time";
timeLabel.textContent = data.time || ""; 
wrapper.appendChild(timeLabel);


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
  Swal.fire({
    title: "Are you sure?",
    text: "This message will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,         // shows Cancel button
    confirmButtonText: "Delete",    // text for confirm
    cancelButtonText: "Cancel",     // text for cancel
    reverseButtons: true            // optional, swaps buttons order
  }).then((result) => {
    if (result.isConfirmed) {       // only proceed if Delete clicked
      deleteMsg(id);
    }
  });
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
    textP.textContent = `${data.text}`;
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
    .then(() => {
      window.Swal.fire({ icon: "success", title: "Deleted!", text: "Message removed successfully.", theme: 'light'});
    })
    .catch(err => {
      window.Swal.fire({ icon: "error", title: "Update Error", theme: 'light' , text: err.message });
    });
}


function editMsg(id, oldText) {
  Swal.fire({
    title: "Edit Message",
    input: "text",
    inputValue: oldText,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (!result.isConfirmed) return; // user clicked Cancel

    const newText = result.value?.trim();
    if (!newText) {
      Swal.fire({ icon: "warning", title: "Empty Message", text: "Message cannot be empty." });
      return;
    }

    // Confirmation before saving
    Swal.fire({
      icon: "question",
      title: "Confirm Edit?",
      text: "Do you want to save changes?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then((confirmEdit) => {
      if (!confirmEdit.isConfirmed) return;

      update(ref(db, "messages/" + id), { text: newText })
        .then(() => {
          Swal.fire({ icon: "success", title: "Updated!", text: "Message updated successfully." });
        })
        .catch(err => {
          Swal.fire({ icon: "error", title: "Update Error", text: err.message });
        });
    });
  });
}
