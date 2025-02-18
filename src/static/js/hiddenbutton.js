window.onload = function() {
    var pageName = window.location.pathname;
    if (pageName === "/chat.html") {
        var newChatButton = document.querySelector('.new-chat-btn');
        if (newChatButton) {
            newChatButton.style.display = 'inline-block';  
        }
    } else {
        var newChatButton = document.querySelector('.new-chat-btn');
        if (newChatButton) {
            newChatButton.style.display = 'none'; 
        }
    }
};
