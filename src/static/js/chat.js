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
        const chatMessagesContainer = document.querySelector('.chat-messages');
        const parsedMessage = marked.parse(message);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsedMessage;
    
        // Hàm typing sử dụng requestAnimationFrame
        const typeText = async (node, text) => {
            return new Promise(resolve => {
                let i = 0;
                const type = () => {
                    if (i < text.length) {
                        node.textContent = text.substring(0, i + 1);
                        i++;
                        requestAnimationFrame(type);
                    } else {
                        resolve();
                    }
                };
                requestAnimationFrame(type);
            });
        };
    
        // Hàm kiểm tra scroll
        function checkScroll() {
            const threshold = 100;
            const isNearBottom = chatMessagesContainer.scrollTop + chatMessagesContainer.clientHeight >= 
                               chatMessagesContainer.scrollHeight - threshold;
            if (isNearBottom) {
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }
        }
    
        // Xử lý từng node
        const processNode = async (parentNode, node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const textNode = document.createTextNode('');
                parentNode.appendChild(textNode);
                await typeText(textNode, node.textContent);
                checkScroll();
                
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                parentNode.appendChild(clone);
    
                if (node.tagName === 'PRE' || node.tagName === 'CODE') {
                    // Clone và giữ nguyên cấu trúc
                    const placeholder = document.createElement('div');
                    Object.assign(placeholder.style, {
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        padding: '10px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap'
                    });
                    
                    clone.appendChild(placeholder);
                    await typeText(placeholder, node.textContent);
                    checkScroll();
                    
                    // Thay thế bằng nội dung thật
                    clone.innerHTML = node.innerHTML;
                    clone.className = node.className;
                    if (window.hljs) {
                        hljs.highlightElement(clone);
                    }
                } else {
                    for (let child of node.childNodes) {
                        await processNode(clone, child);
                    }
                }
            }
        };
    
        element.innerHTML = '';
        for (let child of tempDiv.childNodes) {
            await processNode(element, child);
        }
        if (window.MathJax) {
            await MathJax.typesetPromise([element]);
        }
        // Sau khi hoàn thành, scroll xuống nếu đang ở gần cuối
        if (isNearBottom()) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
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