
    const groupPin = `Hardikisthebest69`;
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
            $(`#send-chat`).attr('disabled',true);
         
            db.collection(`users`).doc(user.uid).get().then(doc => {
                
                $(`#account-user-name`).text(doc.data().name);
                $(`#send-chat`).attr('disabled',false);
                $(`#account-user-bio`).html(`<i class="fas fa-quote-left"></i> ` + doc.data().bio)
                if (!doc.data().url) {} else {
                    $(`.avatar-upload .avatar-preview >div`).css(`background-image`, `url(${doc.data().url})`)
                }
            })

            $(`#imageUpload`).on(`change`, e => {
                console.log(`image updates`)
                const image = e.target.files[0]
                const fileName = image.name;
                const storageRef = storage.ref(`/profileImages/` + fileName);
                const uploadTask = storageRef.put(image);

                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // let progressPercent = progress.toFixed(2)
                    // console.log('Upload is ' + progress + '% done');
                    $(`#imagePreview div:first-child`).addClass(`lds-ring`)
                    $(`#imagePreview #lds-text`).text(`Uploading..`)  
                    // switch (snapshot.state) {
                    //     case firebase.storage.TaskState.PAUSED: // or 'paused'
                    //         console.log('Upload is paused');
                    //         break;
                    //     case firebase.storage.TaskState.RUNNING: // or 'running'
                    //         console.log('Upload is running');
                    //         break;
                    // }
                }, function (error) {
                    console.log(`Image could not be uploaded` + error.message)
                }, function () {

                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    // $(`#imagePreview`).html(``);
                    $(`#imagePreview div:first-child`).removeClass(`lds-ring`)
                    $(`#imagePreview #lds-text`).text(``)
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        db.collection(`users`).doc(user.uid).set({
                            url: downloadURL
                        }, {
                            merge: true
                        }).then(() => {
                            console.log(`done`)
                        }).catch(err => {
                            console.log(`db not updated` + err.message)
                        })
                    });

                });
            })
            
            function readURL(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                        $('#imagePreview').hide();
                        $('#imagePreview').fadeIn(650);
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
            $("#imageUpload").change(function () {
                readURL(this);
            });
            $(function () {
                $('tooltip-main').tooltip();
            })

        } else {
            $(`.landing-page`).css("display", "flex");
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
        let button = $(`#login-button`);
        button.addClass(`clicked`).text(`Please Wait ...`)
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            loginForm.trigger(`reset`)
            $(`#login-modal`).modal(`hide`)
            button.removeClass(`clicked`).text(`Log In`)
        }).catch(err => {
            $(`#login-password`).addClass(`invalid`);
            console.log(`failed to sign in  ` + err.message)
        })
    })


    signinForm.on(`submit`, (e) => {
        e.preventDefault();
        if ($(`#user-group-pin`).val().toString().trim() == groupPin.toString().trim()) {
            const email = $(`#signin-email`).val();
            const password = $(`#signin-password`).val();
            const signinModal = $(`#signin-modal`)
            const button = $(`#signin-button`)
            button.addClass(`clicked`).text(`Please Wait...`)
            auth.createUserWithEmailAndPassword(email, password).then((cred) => {
                console.log(`user created`);
                
                signinForm.trigger(`reset`);
                button.removeClass(`clicked`).text(`CREATE MY ACCOUNT`)
                signinModal.modal(`hide`);
                db.collection(`users`).doc(cred.user.uid).set({
                    email: email,
                    name: $(`#signin-user-name`).val(),
                    bio: $(`#user-bio`).val()
                })

            }).catch(err => {
                $(`#signin-email`).addClass(`invalid`)
                console.log(`failed to create new user ` + err.message)
            })

        } else {
            $(`#user-group-pin`).addClass(`invalid`);
        }
    })


    logout.click((e) => {
        e.preventDefault();
        auth.signOut().then(() => {}).catch(err => {
            console.log(`failed to logout ` + err.message)
        });
    })
