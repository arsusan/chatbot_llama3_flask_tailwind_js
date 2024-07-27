# AI ChatBot Setup Guide

## Overview

This guide provides step-by-step instructions to set up and run a chatbot application using Flask for the backend, Tailwind CSS for styling, and vanilla JavaScript for client-side interactivity. The chatbot utilizes the Ollama Llama3 model. For generating responses for this model to work you need to insall ollama llama3 model in your machine.

## Prerequisites

- Python 3.8 or later
- Node.js and npm
- Ollama Llama3 model installed locally

### Step 1: Set Up the Flask Backend

> Create a Project Directory

    `mkdir ai-chatbot`

    `cd ai-chatbot`

> Create and Activate a Virtual Environment

    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

> Install Required Python Packages

    pip install flask langchain_ollama langchain_core
    Create app.py

> Create a file named app.py in the project root directory with the following content:

    from flask import Flask, request, jsonify, render_template
    from langchain_ollama import OllamaLLM
    from langchain_core.prompts import ChatPromptTemplate

    app = Flask(__name__)

    template = """
    Answer the question below.

    Here is the conversation history: {context}

    Question: {question}

    Answer:
    """
    model = OllamaLLM(model="llama3")
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | model

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/api/chat', methods=['POST'])
    def chat():
        data = request.json
        context = data.get('context', '')
        question = data.get('question', '')
        result = chain.invoke({"context": context, "question": question})
        return jsonify({"answer": result})

    if __name__ == '__main__':
        app.run(host='0.0.0.0', port=5000)

> Run the Flask Application

    python app.py

### Step 2: Set Up Tailwind CSS

Initialize Tailwind CSS

Install Tailwind CSS and initialize the configuration:

    npm init -y
    npm install tailwindcss
    npx tailwindcss init

Configure Tailwind CSS

> Update tailwind.config.js to include your HTML and JavaScript files:

    module.exports = {
    content: [
        './templates/**/*.{html,js}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    }

Create Tailwind CSS Input File

Create a file named static/css/tailwind.css:

    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    Build Tailwind CSS

Compile the Tailwind CSS into a single file:

    npx tailwindcss -i ./static/css/tailwind.css -o ./static/css/style.css --watch

### Step 3: Create the HTML File

Create HTML File

Create a file named index.html in the templates directory with the following content:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI ChatBot</title>
        <link href="{{ url_for('static', filename='css/style.css') }}" rel="stylesheet">
        <style>
            .chat-box {
                height: 60vh;
            }
        </style>
    </head>
    <body class="bg-gray-100 font-sans leading-normal tracking-normal">
        <div class="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <div class="chat-box overflow-y-scroll p-3 border border-gray-300 rounded-lg mb-4" id="chat-box"></div>
            <div class="input-box flex">
                <input type="text" id="user-input" class="flex-grow p-3 border border-gray-300 rounded-lg" placeholder="Type a message">
                <button onclick="handleConversation()" class="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Send</button>
            </div>
        </div>
        <script src="{{ url_for('static', filename='js/chatbot.js') }}"></script>
    </body>
    </html>

### Step 4: Create the JavaScript File

Create JavaScript File

Create a file named chatbot.js in the static/js directory with the following content:

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

Running the Application
Start the Flask Server

    python app.py

Open Your Browser

Navigate to http://localhost:5000 to access your chatbot application.

### Notes

> Error Handling: Ensure you handle any errors that may occur during API calls or while loading resources.

> Local Model: The chatbot uses a local Ollama Llama3 model. Ensure it's properly set up and running on your machine.
