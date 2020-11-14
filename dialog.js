var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recidsaeved" + msg);
    var requestLine = document.createElement("div");
    requestLine.textContent = msg;
    document.getElementById("container").appendChild(requestLine);
});