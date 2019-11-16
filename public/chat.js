const socket = io.connect(`/`)


const chatBody = $(`.chat-body`)

const setupChat = async function (data) {
    if (data.length == 0) {
        chatBody.html(`<h2>Please LogiIn to Enter the chat.</h2>`)
    } else {
        await chatBody.html(` 
        <div id="chat-dialog">
            <div id="chat-window">
                <div id="output"></div>
                <div id="feedback"></div>
            </div>
            <form id="chat-form">
              <div class="md-form">
                <input id="chat-message" class="form-control input-lg" type="text" autocomplete="off" placeholder="Message.." required />
                <button id="send-chat" class="btn btn-lg btn-primary" type="submit">Send</button>
              </div>
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
            output[0].innerHTML += `<p><strong>${data.handle}</strong>:  ${data.message}</p>`;
    })
    socket.on(`typing`, (data) => {
        feedback.html(`<p><em>${data}</em> is typing</p>`);
    })

}