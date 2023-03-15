class ChatManager {
    constructor() {
        this.chat = $("#chat");
        this.chatField = $("#chat-field");
        this.flag = false;
        this.messages = [];

        this.options = {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
    }

    sendMessage() {
        const text = this.chatField.val();
        if (text === "") {
            return;
        }
        roomSocket.send(
            JSON.stringify({
                event: "SEND_CHAT_MESSAGE",
                message: "New message incomming.",
                chat_message: text,
            })
        );
        this.chatField.val("");
    }

    updateMessages(newMessages) {
        this.messages = newMessages;
        this.render();
        // Scroll to the bottom of the chat block
        this.chat.scrollTop(this.chat[0].scrollHeight);
    }

    render() {
        this.chat.text("");
        if (this.messages.length === 0) {
            this.chat.text("No messages :(");
        }
        this.messages.forEach((newMessage) => {
            let date = new Date(newMessage.timestamp).toLocaleDateString("en-US", this.options);

            let message = $(`
        <div class="message">
            <div class="message__sender">${newMessage.username}</div>
            <div class="message__content">${newMessage.message}</div>
            <div class="message__time">${date}</div>
        </div>`);
            this.chat.append(message);
        });
    }
}

const chat = new ChatManager();
