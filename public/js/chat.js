const socket = io.connect(`/`)

const chatBody = $(`.chat-body`)

//chat setup function

const setupChat = async function(data) {
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
    //once body is setup, call messaging
    setupMessaging(chatForm)
  }
}

//message box setup function
const setupMessaging = chatForm => {
  const output = $(`#output`)
  const feedback = $(`#feedback`)

  //send button event
  chatForm.on(`submit`, e => {
    console.log(`form submitted`)
    e.preventDefault()
    const message = $(`#chat-message`)
    socket.emit(`chat`, {
      message: message.val()
    })
    message.val(``)
  })

  socket.on(`assignright`, (data, pos) => {
    setMessgae(data, pos)
  })

  //chat received event

  socket.on(`chat`, data => {
    feedback.html(``)
    //no change if no message
    if (data.message.trim().length === 0) {
    } else {
      setMessgae(data, { position: false })
    }
  })

  const setMessgae = (data, pos) => {
    if (pos.position == true) {
      console.log('was true')
      output[0].innerHTML +=
        `<p class="message-dialog-box align-right"><strong class="message-user-header"><a id="#chat-person" data-toggle="modal" data-target="#chat-person-modal" onClick=showDetails(this)>` +
        $(`#account-user-name`).text() +
        `</a></strong><br>${data.message}</p>`
    } else {
      output[0].innerHTML +=
        `<p class="message-dialog-box"><strong class="message-user-header "><a id="#chat-person" data-toggle="modal" data-target="#chat-person-modal" onClick=showDetails(this)>` +
        $(`#account-user-name`).text() +
        `</a></strong><br>${data.message}</p>`
    }
    let scroll
    //fixed , message-last-child issue
    if ($(`.message-dialog-box:last-child`).length == 0) scroll = 100
    else
      scroll =
        $(`.message-dialog-box:last-child`).offset().top +
        $(`.message-dialog-box:last-child`).height() +
        100
    //scroll to current message
    if (scroll >= $(window).height()) {
      if (scroll > 800) {
      } else {
        $(`#chat-window`).animate(
          {
            scrollTop: output[0].scrollHeight
          },
          'fast'
        )
      }
    }
  }

  //broadcast typing message
  socket.on(`typing`, data => {
    feedback.html(`<p><em>${data}</em> is typing</p>`)
  })
}

//account info
function showDetails(e) {
  //call required data on basis of 'name'
  db.collection(`users`)
    .where('name', '==', e.innerHTML.toString().trim())
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        //setup modal
        $(`#account-user-name1`).text(doc.data().name)
        $(`#account-user-bio1`).html(
          `<i class="fas fa-quote-left"></i> ` + doc.data().bio
        )
        if (!doc.data().url) {
        } else {
          $(`.avatar-upload1 .avatar-preview1 >div`).css(
            `background-image`,
            `url(${doc.data().url})`
          )
        }
      })
    })
}
