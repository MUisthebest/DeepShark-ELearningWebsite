document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');

    async function sendMessage() {
        const userMessage = inputField.value.trim();
        const messageId = document.getElementById('message_id').value;

        if (userMessage === "") return;
        inputField.value = '';
        inputField.focus();
        // Hiển thị tin nhắn người dùng lên UI
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('chat-message', 'user-message');
        userMessageDiv.textContent = userMessage;
        document.querySelector('.chat-messages').appendChild(userMessageDiv);

        // Gửi đến Flask backend
        const response = await fetch('/api/ai_models/handle_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input_data: userMessage,
                message_id: messageId
            })
        });

        const data = await response.json();

        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('chat-message', 'bot-message');
        botMessageDiv.innerHTML = marked.parse(data.prediction || "Sorry, I didn't understand that.");
        document.querySelector('.chat-messages').appendChild(botMessageDiv);

        hljs.highlightAll();
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
    }

    sendButton.addEventListener('click', function () {
        const chatMessages = document.querySelector('.chat-messages');
        const lastMessage = chatMessages.lastElementChild;
        
        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        sendMessage();
    });

    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const chatMessages = document.querySelector('.chat-messages');
            const lastMessage = chatMessages.lastElementChild;
        
            if (lastMessage) {
                lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
            sendMessage();
        }
    });
});

window.onload = function () {
    const chatMessages = document.querySelector('.chat-messages');
    const lastMessage = chatMessages.lastElementChild;

    if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
};
