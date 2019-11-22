const socket = io.connect(`/`)


const chatBody = $(`.chat-body`)

const setupChat = async function (data) {
    if (data.length == 0) {} else {
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
        if (data.message.trim().length === 0) {} else {
            output[0].innerHTML += `<p class="message-dialog-box"><strong class="message-user-header"><a id="#chat-person" data-toggle="modal" data-target="#chat-person-modal" onClick=showDetails(this)>` + $(`#account-user-name`).text() + `</a></strong><br>${data.message}</p>`;
            let scroll = $(`.message-dialog-box:last-child`).offset().top + $(`.message-dialog-box:last-child`).height() + 100
            console.log(scroll, $(window).height())
            if (scroll >= $(window).height()) {
                if (scroll > 800) {} else {
                    $(`#chat-window`).animate({
                        scrollTop: output[0].scrollHeight
                    }, 'fast');
                }
            }
        }
    })
    socket.on(`typing`, (data) => {
        feedback.html(`<p><em>${data}</em> is typing</p>`);

    })

}

function showDetails(e) {
    db.collection(`users`).where("name", "==", e.innerHTML.toString().trim())
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                
                $(`#account-user-name1`).text(doc.data().name);
                $(`#account-user-bio1`).html(`<i class="fas fa-quote-left"></i> ` + doc.data().bio)
                if (!doc.data().url) {} else {
                    $(`.avatar-upload1 .avatar-preview1 >div`).css(`background-image`, `url(${doc.data().url})`)
                }
            })
        })

}