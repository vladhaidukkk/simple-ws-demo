let ws = null;

function connectToSocket() {
  ws = new WebSocket("ws://127.0.0.1:8000/ws");

  ws.addEventListener("message", (event) => {
    const messageList = document.getElementById("messageList");
    const messageItem = document.createElement("li");
    const messageText = document.createTextNode(event.data);

    messageItem.appendChild(messageText);
    messageList.appendChild(messageItem);
  });
}

function setUsername(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("usernameInput");
  const usernameButton = document.getElementById("usernameButton");
  const messageButton = document.getElementById("messageButton");

  document.cookie = `username=${usernameInput.value}`;
  usernameInput.disabled = true;
  usernameButton.disabled = true;
  messageButton.disabled = false;
  connectToSocket();
}

function sendMessage(event) {
  event.preventDefault();

  const messageInput = document.getElementById("messageInput");
  ws.send(messageInput.value);
  messageInput.value = "";
}

function setupApp() {
  let username = null;
  document.cookie.split(";").forEach((cookie) => {
    if (cookie.startsWith("username")) {
      username = cookie.split("=")[1];
    }
  });

  const usernameInput = document.getElementById("usernameInput");
  const usernameButton = document.getElementById("usernameButton");
  const messageButton = document.getElementById("messageButton");

  if (username) {
    usernameInput.value = username;
    usernameInput.disabled = true;
    usernameButton.disabled = true;
    messageButton.disabled = false;
    connectToSocket();
  }
}

setupApp();
