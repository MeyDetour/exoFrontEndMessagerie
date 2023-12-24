let token = null
let content = document.querySelector('.contenuDePage')
let baseUrl = 'https://b1messenger.imatrythis.com/'
let listeMessage = null
let user = null
let navbar = document.querySelector('.navbar')
let page = document.querySelector('body')
run()

function run() {
    if (!token) {
        renderForm()

    } else {
        identifier().then(response => {
                getMessage().then(response => {
                    renderMessages()
                    scrollY()
                    addEvent()
                })
            }
        )

    }

}

//==============================RENDER


function render(contenu) {
    content.innerHTML = ''
    content.innerHTML = contenu
}

function renderForm() {
    let template = `
    <div class="h-100 d-flex flex-column">
           <div class="loginform">
               <h1>login form</h1>
               <input type="text" name="loginFormUsername" id="loginFormUsername" placeholder="Username">
               <input type="password" name="loginFormPassword" id="loginFormPassword" placeholder="Password">
               <button class="btn boutonForm" id="loginFormSubmit">Se connecter</button>
               <button id="loginFormToSignUp">Signup</button>
           </div>
           <div class="signupform d-none">
               <h1>signup form</h1>
               <input type="text" name="SignupFormUsername" id="SignupFormUsername" placeholder="Username">
               <input type="password" name="SignupFormPassword" id="SignupFormPassword" placeholder="Password">
               <button class="btn boutonForm"  id="signupFormSubmit">S'enregistrer</button>
               <button id="signUpToLogin">Login</button>
           </div>

       </div>`
    render(template)
    document.querySelector('#loginFormUsername').focus()
    document.querySelector('#loginFormSubmit').addEventListener('click', () => {
        getToken(document.querySelector('#loginFormUsername'), document.querySelector('#loginFormPassword'))
    })
    document.querySelector('#signupFormSubmit').addEventListener('click', () => {
        register(document.querySelector('#SignupFormUsername'), document.querySelector('#SignupFormPassword'))

    })

    let loginform = document.querySelector('.loginform')
    let signupform = document.querySelector('.signupform')

    document.querySelector('#loginFormToSignUp').addEventListener('click', () => {
        switchElt(loginform, signupform)
    })
    document.querySelector('#signUpToLogin').addEventListener('click', () => {
        switchElt(loginform, signupform)
    })
}

function renderMessages() {
    let allMessages = ''
    if (listeMessage.length !== 0) {
        listeMessage.forEach(message => {
            allMessages += renderMessage(message)
        })
    }


    let fil = `
         <div class="filDeDiscussion">
                <div class="banner">
                    <div class="bannerIc">
                        <i class="bi bi-x-lg"></i>
                    </div>
                    <h1 class="bannerTitle">Welcome to Nova</h1>
                    <p>
                        In this classroom chat, we design, improve, try, try again, try again again and have fun with our
                        app !
                        <br>Then if like us you like have some fun, come here and try it !
                        <br><br>
                        Made by the best developper Mey 😉
                    </p>
                </div>
         
         ${allMessages}
        </div>
        <div class="postMessageContainer">
            <textarea name="postmessage" placeholder="Write text..." id="postmessage" ></textarea>
            <div class="postmessageBtn"><span>Envoyer</span><i class="bi bi-send"></i></div>
            <div class="postmessageBtn" onclick="run()"><i class="bi bi-arrow-clockwise"></i></div>
        </div>
    `
    render(fil)
    let messages = document.querySelectorAll('.message')
    messages.forEach(message => {
        message.style.innerHeight += message.querySelector('#messageContenu').scrollHeight + 'px'
    })
    let postmessage = document.querySelector('#postmessage');
    postmessage.focus()
    renderInterface()

}

function renderMessage(message) {
    let id = message.id
    let classes = messagePosition(message)

    let param = {
        classe: `message ${classes}`,
        container: 'messageContainer',
        option: `
                 <div class="messageIc">    
                   <i  id="${id} "class="bi bi-chat-left-heart"></i>
                   <i  id="${id}" class="bi bi-chat"></i>
                </div>
    `,
        dpn: message.author.displayName
    }

    if (!message.author.displayName) {
        param.dpn = message.author.username
    }

    if (user.id === message.author.id) {
        param.container = 'messageContainer1',
            param.option = `
                <div class="messageIc" ">
                     <i id="${id}" class="bi bi-pencil"></i>
                 <i id="${id}" class="bi bi-trash3"></i>
                </div>
    `
        param.dpn = 'Vous : ' + param.dpn
        param.classe = `messageReverse  ${classes}`
    }

    let template = `
        <div class="${param.container}">
           <img src="${user.imageUrl}" alt="Image de profil" class="messageImage">
            <div class="messageAuteurOption">
                 <span class="messageAuteur">${param.dpn}</span>    
                  ${param.option}
            </div> 
                
             <div class="${param.classe}" id="message${id}">
                        <div class="w-100 h-100">
                           
                            <div class="w-100 d-flex flex-row align-items-top">
                                <textarea readonly class="" name="messageContenu" id="messageContenu" >${message.content}</textarea>
                                <button type="submit" class="d-none boutonForm editmessageSubmit${id}"> Modifier </button>
                            </div>
                   </div>
             
             </div>  
            
         
        </div>
 
           
`
    return template


}

function renderInterface() {
    navbar.innerHTML = `

      <div class="navbarListePV">
            <div class="pvBanner">
            <span>Chats</span>
              <div onclick="toggleParam()" class= " centered">
                    <img src="images/defaultimg.png" alt="" class="navbarParamImage">
               </div>
            </div>
            <button class="pvContact">
            <img src="images/defaultimg.png" class="convPvImg" alt="">
            <div class="pvContactData ">
             <h6>contact</h6>
              <span>Dernier message envoy2xxxxxxxxxxxxxxxxxxxx</span>
            </div>
           
            </button>
         
        </div>
  
    `
}

function toggleParam() {
    document.querySelector('.paramContainer').classList.toggle('d-none')
}

//==============================
function isEmpty(elt) {
    return elt === ''
}

function addEvent() {

    console.log(document.querySelectorAll('.bi-trash3'))
    document.querySelectorAll('.bi-trash3').forEach((poubelle) => {
        poubelle.addEventListener('click', () => {
            supprimer(poubelle.id)
        })

    })
    document.querySelectorAll('.bi-pencil').forEach((crayon => {
        crayon.addEventListener('click', () => {
            const textarea = document.querySelector(`#message${crayon.id} > div> div>  textarea`)
            textarea.readOnly = false
            console.log(textarea)
            textarea.classList.add('borderEdit')
            document.querySelector(`.editmessageSubmit${crayon.id}`).classList.toggle('d-none')
            document.querySelector(`.editmessageSubmit${crayon.id}`).addEventListener('click', () => {
                editMessage(crayon.id, textarea.value)
            })

        })
    }))
    document.querySelector('.postmessageBtn').addEventListener('click', () => {
            if (!isEmpty(document.querySelector('#postmessage').value)) {
                postmessage(document.querySelector('#postmessage').value)
                    .then(response => {
                        document.querySelector('#postmessage').value = ''
                    })

            }
        }
    )
    document.querySelectorAll('.bi-chat-left-heart').forEach(icone => {
        icone.addEventListener('click', () => {
            document.querySelector(`.message${icone.id} > div > div> textarea`)

        })
    })


}

function switchElt(elt1, elt2) {
    elt1.classList.toggle('d-none')
    elt2.classList.toggle('d-none')
}

function scrollY() {
    document.querySelector('.filDeDiscussion').scrollTo(0, document.querySelector('.filDeDiscussion').scrollHeight)
}

function messagePosition(message) {
    let id = message.id
    'messageStart messageMiddle messageEnd '
    for (let k = 0; k < listeMessage.length; k++) {

        let id_current_mess = listeMessage[k].author.id

        //Select message in the message list
        if (id_current_mess === id) {
            {
                //is the only message
                if (k === 0 && k + 1 === listeMessage.length) {
                    return ' messageMiddle'
                }
                //is the first message
                else if (k === 0) {

                    if (id_current_mess === listeMessage[k + 1].author.id) {
                        return ' messageStart'
                    }
                    return ' messageMiddle'
                }
                //is the last message
                else if (k + 1 === listeMessage.length){
                    if(listeMessage[k-1].author.id === id_current_mess){
                        return ' messageEnd'
                    }
                    return ' messageMiddle'
                }
                else {
                    //if precedent and next message is yours
                    if(listeMessage[k-1].author.id === id_current_mess && id_current_mess === listeMessage[k + 1].author.id){
                        return ' messageMiddle'
                    }
                    //if precendent is yours but not the next
                    else if(listeMessage[k-1].author.id === id_current_mess){
                        return ' messageEnd'
                    }
                    //if next is yours but not the precedent
                    else if(listeMessage[k+1].author.id === id_current_mess){
                        return ' messageStart'
                    }
                    return ' messageMiddle'
                }

            }
        }


    }

}

//============================== FETCH


async function getToken(nom, mdp) {
    const body = {
        'username': nom.value,
        'password': mdp.value
    }
    const param = {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(body)
    }
    await fetch(`${baseUrl}login`, param)
        .then(response => response.json())
        .then(data => {
            token = data.token
            run()
        })


}

async function register(nom, mdp) {
    const body = {
        'username': nom.value,
        'password': mdp.value
    }
    const param = {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(body)
    }
    await fetch(`${baseUrl}register`, param)
        .then(response => response.json())
        .then(data => {
            run()
        })
}

async function getMessage() {
    const param = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        }
    }
    await fetch(`${baseUrl}api/messages`, param)
        .then(response => response.json())
        .then(data => {
            listeMessage = data

        })
}

async function sendReact(contenu) {
    let param = {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            content: contenu
        })
    }
    await fetch(`${baseUrl}api/response/${id}/new`, param)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

async function identifier() {
    const param = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        }
    }
    await fetch(`${baseUrl}api/whoami`, param)
        .then(response => response.json())
        .then(data => {

            user = data
        })
}

async function supprimer(id) {
    const param = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        }
    }
    console.log(id)
    await fetch(`${baseUrl}api/messages/delete/${id}`, param)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            run()
        })

}

async function postmessage(contenu) {
    const param = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            content: contenu
        })
    }
    await fetch(`${baseUrl}api/messages/new`, param)
        .then(response => response.json())
        .then(data => {
            run()
        })
}

async function editMessage(id, contenu) {
    const param = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            content: contenu
        })
    }
    await fetch(`${baseUrl}api/messages/${id}/edit`, param)
        .then(response => response.json())
        .then(data => {
            run()
        })
}


