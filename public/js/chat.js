const socket = io.connect(`/`)


const chatBody = $(`.chat-body`)

const setupChat = async function (data) {
    if (data.length == 0) {  
    } else {
        console.log(`logged in funciton`)
        await chatBody.html(` 
        <div id="chat-dialog">
            <div id="chat-window">
                <div id="output"></div>
                <div id="feedback"></div>
            </div>
            <form id="chat-form" class="md-form">
                <input id="chat-message" class="form-control" type="text" autocomplete="off" placeholder="Message.." required />
                <button id="send-chat" class="btn btn-lg btn-black" type="submit">Send</button>
            </form>
        </div>
            `)
        let chatForm = $(`#chat-form`)

        setupMessaging(chatForm)
    }
}

const setupMessaging = (chatForm) => {

    const output = $(`#output`)
    const feedback = $(`#feedback`)
    chatForm.on(`submit`, (e) => {
        console.log(`form submitted`)
        e.preventDefault();
        const message = $(`#chat-message`);

        socket.emit(`chat`, {
            message: message.val()
        })
        message.val(``)
    })

    socket.on(`chat`, (data) => {
        feedback.html(``)
        if (data.message.trim().length === 0) {} else
            output[0].innerHTML += `<p class="message-dialog-box"><strong class="message-user-header">${data.handle}</strong><br>${data.message}</p>`;
    })
    socket.on(`typing`, (data) => {
        feedback.html(`<p><em>${data}</em> is typing</p>`);

    })

}