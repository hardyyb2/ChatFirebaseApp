$(document).ready(() => {

    const signinForm = $(`#signinform`);
    const loginForm = $(`#loginform`);
    const logout = $(`#logout-button`);

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log(`user logged in`)
            
            $(`.landing-page`).hide();
            $(`.chat-body`).show();
            $(`.logged-out`).hide();
            $(`.logged-in`).show();
            setupChat(2);

            db.collection(`users`).doc(user.uid).get().then(doc => {
                $(`#account-user-name`).text(doc.data().name);
                $(`#account-user-bio`).html(`<i class="fas fa-quote-left"></i> `+ doc.data().bio)
            })

        } else {
            $(`.landing-page`).css("display","flex");
            $(`.chat-body`).hide(); 
            console.log(`user logged out`)
            $(`.logged-out`).show();
            $(`.logged-in`).hide();
            setupChat([])
        }
    })

    loginForm.on(`submit`, (e) => {
        e.preventDefault();
        const email = $(`#login-email`).val()
        let password = $(`#login-password`).val()
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            loginForm.trigger(`reset`)
            $(`#login-modal`).modal(`hide`)

        }).catch(err => {
            $(`#login-password`).addClass(`invalid`);
         console.log(`failed to sign in  ` + err.message)
        })
    })


    signinForm.on(`submit`, (e) => {
        e.preventDefault();
        const email = $(`#signin-email`).val();
        const password = $(`#signin-password`).val();
        const signinModal = $(`#signin-modal`)
        auth.createUserWithEmailAndPassword(email, password).then((cred) => {
            console.log(`user created`);
            signinModal.trigger(`reset`);
            signinModal.modal(`hide`);
            db.collection(`users`).doc(cred.user.uid).set({
                email: email,
                name:$(`#signin-user-name`).val(),
                bio: $(`#user-bio`).val()
            })

        }).catch(err => {
            $(`#signin-email`).addClass(`invalid`)
            console.log(`failed to create new user ` + err.message)
        })
    })


    logout.click((e) => {
        e.preventDefault();
        auth.signOut().then(() => {}).catch(err => {
            console.log(`failed to logout ` + err.message)
        });
    })

})