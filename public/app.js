$(document).ready(() => {
    
    const signinForm = $(`#signinform`);
    const loginForm = $(`#loginform`);
    const logout = $(`#logout-button`);

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log(`user logged in`)

            $(`.logged-out`).hide();
            $(`.logged-in`).show();
            setupChat(2);

            const textdiv = $(`#account-modal .modal-body`);
           db.collection(`users`).doc(user.uid).get().then(doc => {
                textdiv.html(`<h5>You are signed in as ${user.email}</h5>
                <h5>${doc.data().bio}</h5>
                `)
            })

        } else {
            console.log(`user logged out`)
            $(`.logged-out`).show();
            $(`.logged-in`).hide();
            setupChat([])
        }
    })

    loginForm.on(`submit`, (e) => {
        e.preventDefault();
        const email = $(`#login-email`).val()
        const password = $(`#login-password`).val()
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            loginForm.trigger(`reset`)
            $(`#login-modal`).modal(`hide`)
     
        }).catch(err => {
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
                bio:$(`#user-bio`).val()
            })

        }).catch(err => {
            console.log(`failed to create new user ` + err.message)
        })
    })


    logout.click((e) => {
        e.preventDefault();
        auth.signOut().then(() => {
        }).catch(err => {
            console.log(`failed to logout ` + err.message)
        });
    })

})