const context = [];

function handleConversation() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.toLowerCase() === 'exit') {
        return;
    }
    
    // Add user input to context
    context.push(`User: ${userInput}`);
    
    // Prepare payload for API call
    const payload = {
        context: context.join("\n"),
        question: userInput
    };

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
        
        // Update chat box
        updateChatBox(userInput, aiResponse);
        
        // Clear user input
        document.getElementById('user-input').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateChatBox(userInput, aiResponse) {
    const chatBox = document.getElementById('chat-box');
    
    // Create user message element
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'text-right', 'mb-2');
    userMessage.textContent = `You: ${userInput}`;
    chatBox.appendChild(userMessage);
    
    // Create AI message element
    const aiMessage = document.createElement('div');
    aiMessage.classList.add('message', 'text-left', 'mb-2');
    aiMessage.textContent = `Bot: ${aiResponse}`;
    chatBox.appendChild(aiMessage);
    
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
