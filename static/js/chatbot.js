const context = [];

function handleConversation() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.toLowerCase() === 'exit') {
        return;
    }

    // Add user input to context
    context.push(`User: ${userInput}`);
    
    // Update chat box with user message
    updateChatBox(userInput, null);

    // Prepare payload for API call
    const payload = {
        context: context.join("\n"),
        question: userInput
    };

    // Clear user input
    document.getElementById('user-input').value = '';

    // Call the local model API
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        const aiResponse = data.answer;

        // Add AI response to context
        context.push(`AI: ${aiResponse}`);
        
        // Update chat box with AI response
        updateChatBox(null, aiResponse);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateChatBox(userInput, aiResponse) {
    const chatBox = document.getElementById('chat-box');

    if (userInput !== null) {
        // Create user message element
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'text-right', 'mb-2', 'p-2', 'bg-blue-200', 'rounded');
        userMessage.textContent = `You: ${userInput}`;
        chatBox.appendChild(userMessage);

        // Create waiting message element
        const waitingMessage = document.createElement('div');
        waitingMessage.id = 'waiting-message';
        waitingMessage.classList.add('message', 'text-left', 'mb-2', 'p-2', 'bg-gray-200', 'rounded');
        waitingMessage.textContent = 'Bot: Waiting for response...';
        chatBox.appendChild(waitingMessage);
    }

    if (aiResponse !== null) {
        // Remove waiting message
        const waitingMessage = document.getElementById('waiting-message');
        if (waitingMessage) {
            chatBox.removeChild(waitingMessage);
        }

        // Create AI message element
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('message', 'text-left', 'mb-2', 'p-2', 'bg-green-200', 'rounded');
        aiMessage.textContent = `Bot: ${aiResponse}`;
        chatBox.appendChild(aiMessage);
    }

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleConversation();
        }
    });
});
