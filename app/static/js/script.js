const ws = new WebSocket("ws://127.0.0.1:8000/ws");

ws.addEventListener("message", (event) => {
  const messageList = document.getElementById("messageList");
  const messageItem = document.createElement("li");
  const messageText = document.createTextNode(event.data);
  messageItem.appendChild(messageText);
  messageList.appendChild(messageItem);
});

function setUsername(event) {
  event.preventDefault();
  const usernameInput = document.getElementById("usernameInput");
  const usernameButton = document.getElementById("usernameButton");
  document.cookie = `username=${usernameInput.value}`;
  usernameInput.disabled = true;
  usernameButton.disabled = true;
}

function sendMessage(event) {
  event.preventDefault();
  const messageInput = document.getElementById("messageInput");
  ws.send(messageInput.value);
  messageInput.value = "";
}
