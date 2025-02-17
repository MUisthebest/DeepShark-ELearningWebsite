window.onload = function() {
    var pageName = window.location.pathname; 

    if (pageName === "/" || pageName === "/home") {
        var newChatButton = document.querySelector('.new-chat-btn');
        if (newChatButton) {
            newChatButton.style.display = 'none';
        }
    } else if (pageName === "/chat") {
        var newChatButton = document.querySelector('.new-chat-btn');
        if (newChatButton) {
            newChatButton.style.display = 'inline-block';
        }
    }
};
