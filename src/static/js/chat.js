document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');

    async function sendMessage() {
        const userMessage = inputField.value.trim();
        const messageId = document.getElementById('message_id').value;

        if (userMessage === "") return;
        inputField.value = '';
        inputField.focus();
        
        // Hiển thị tin nhắn người dùng
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('chat-message', 'user-message');
        userMessageDiv.textContent = userMessage;
        document.querySelector('.chat-messages').appendChild(userMessageDiv);

        // Tạo placeholder cho bot
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('chat-message', 'bot-message');
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        botMessageDiv.appendChild(typingIndicator);
        document.querySelector('.chat-messages').appendChild(botMessageDiv);
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;

        try {
            // Gửi request
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
            
            // Xóa indicator
            botMessageDiv.removeChild(typingIndicator);
            
            // Hiển thị tin nhắn với hiệu ứng typing cải tiến
            const messageContent = data.prediction || "Sorry, I didn't understand that.";
            await improvedTypeMessage(botMessageDiv, messageContent);
            
            // Cuộn xuống
            document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            botMessageDiv.removeChild(typingIndicator);
            botMessageDiv.textContent = "An error occurred while processing your message.";
        }
    }

    async function improvedTypeMessage(element, message) {
        const parsedMessage = marked.parse(message);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsedMessage;
        
        // Xử lý từng node
        const processNode = async (parentNode, node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Xử lý text node - typing từng ký tự
                const text = node.textContent;
                let displayText = '';
                for (let i = 0; i < text.length; i++) {
                    displayText += text[i];
                    const textNode = document.createTextNode(displayText);
                    
                    // Tạm thời thay thế nội dung
                    if (parentNode.lastChild?.nodeType === Node.TEXT_NODE) {
                        parentNode.lastChild.nodeValue = displayText;
                    } else {
                        parentNode.appendChild(textNode);
                    }
                    
                    // Tốc độ typing nhanh hơn (10-30ms)
                    await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
                    document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Xử lý element node
                const clone = node.cloneNode(false);
                parentNode.appendChild(clone);
                
                // Nếu là thẻ code hoặc pre
                if (node.tagName === 'PRE' || node.tagName === 'CODE') {
                    // Lưu lại nội dung gốc
                    const originalContent = node.innerHTML;
                    const originalClass = node.className;
                    
                    // Áp dụng style typing (nền đen chữ trắng)
                    clone.style.backgroundColor = '#1a1a1a';
                    clone.style.color = '#ffffff';
                    clone.style.padding = '10px';
                    clone.style.borderRadius = '4px';
                    clone.style.fontFamily = 'monospace';
                    clone.style.whiteSpace = 'pre-wrap';
                    
                    // Tạo bản sao để typing
                    const typingNode = document.createElement('span');
                    clone.appendChild(typingNode);
                    
                    // Typing nội dung
                    const text = node.textContent;
                    let displayText = '';
                    for (let i = 0; i < text.length; i++) {
                        displayText += text[i];
                        typingNode.textContent = displayText;
                        await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
                        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
                    }
                    
                    // Sau khi typing xong, thay thế bằng nội dung gốc và xóa style tạm
                    clone.innerHTML = originalContent;
                    clone.className = originalClass;
                    clone.removeAttribute('style');
                    hljs.highlightElement(clone);
                } else {
                    // Xử lý các node con
                    for (let child of node.childNodes) {
                        await processNode(clone, child);
                    }
                }
            }
        };
        
        // Bắt đầu xử lý từng node
        element.innerHTML = '';
        for (let child of tempDiv.childNodes) {
            await processNode(element, child);
        }
    }

    // Sự kiện
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

window.onload = function () {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages.lastElementChild) {
        chatMessages.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
};