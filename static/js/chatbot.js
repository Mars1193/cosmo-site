// static/js/chatbot.js
// Cohere Chatbot Frontend Logic

document.addEventListener('DOMContentLoaded', function() {
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatButton = document.getElementById('chat-submit');
  const chatToggle = document.getElementById('chat-toggle');
  let isChatOpen = false;

  // Toggle chat window
  chatToggle.addEventListener('click', function() {
    isChatOpen = !isChatOpen;
    chatbotContainer.classList.toggle('active', isChatOpen);
    chatToggle.textContent = isChatOpen ? 'Close Chat' : 'Chat with Us';
    if (isChatOpen) {
      chatInput.focus();
    }
  });

  // Handle message submission
  async function handleSubmit() {
    const message = chatInput.value.trim();
    if (!message) return;
    addMessage('user', message);
    chatInput.value = '';
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    try {
      // Make request to your backend which will call Cohere API
      const response = await fetch('https://your-backend-api.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      chatMessages.removeChild(typingIndicator);
      addMessage('bot', data.response);
    } catch (error) {
      console.error('Error:', error);
      chatMessages.removeChild(typingIndicator);
      addMessage('bot', 'Sorry, I encountered an error. Please try again later.');
    }
  }

  // Add message to chat
  function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}-message`;
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Event listeners
  chatButton.addEventListener('click', handleSubmit);
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSubmit();
  });

  // Add initial greeting
  setTimeout(() => {
    addMessage('bot', 'Hello! How can I help you today?');
  }, 1000);
});
