let token = null
let content = document.querySelector('.contenuDePage')
let baseUrl = 'https://b1messenger.imatrythis.com/'
let listeMessage = null
let user = null

run()

function run() {
    if (!token) {
        renderForm()
        addEvent()
    } else {
        identifier().then(response => {
                getMessage().then(response => {
                    renderMessages()
                    scrollY()
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
    document.querySelector('#loginFormSubmit').addEventListener('click', () => {
        getToken(document.querySelector('#loginFormUsername'), document.querySelector('#loginFormPassword'))
    })
    document.querySelector('#signupFormSubmit').addEventListener('click', () => {
        register(document.querySelector('#SignupFormUsername'), document.querySelector('#SignupFormPassword'))

    })
}

function renderMessages() {
    let allMessages = ''
    listeMessage.forEach(message => {
        allMessages += renderMessage(message)

    })
    let fil = `
         <div class="filDeDiscussion">
         ${allMessages}
        </div>
        <div class="postMessageContainer">
            <textarea name="postmessage" placeholder="Write text..." id="postmessage" ></textarea>
            <div onclick="sendMessage()"><i class="bi bi-send"></i></div>
        </div>
    `
    render(fil)
    let messages = document.querySelectorAll('.message')
    messages.forEach(message => {
        message.style.innerHeight += message.querySelector('#messageContenu').scrollHeight + 'px'
    })


}

function renderMessage(message) {
    let option = `
                 <div class="messageIc">
                   <i class="bi bi-chat-left-heart"></i>
                  <i class="bi bi-chat"></i>
                </div>
    `
    let dpn = message.author.displayName
    if (!message.author.displayName) {
        dpn = message.author.username
    }


    if (user.username === message.author.username) {
        option = `
                 <div class="messageIc">
                    <i class="bi bi-pencil"></i>
                    <i class="bi bi-trash3"></i>
                </div>
    `
        dpn = 'Vous : ' + dpn
    }

    let template =
        `
      <div class="message">
      <img src="${user.imageUrl}" alt="Image de profil" class="messageImage">
      <div>
           <h2 class="messageAuteur">${dpn}</h2>
                <textarea readonly name="messageContenu" id="messageContenu" >${message.content}</textarea>
                ${option}

            </div>
</div>
           
`
    return template
}

//==============================

function addEvent() {

    let loginform = document.querySelector('.loginform')
    let signupform = document.querySelector('.signupform')
    console.log(loginform, signupform)
    document.querySelector('#loginFormToSignUp').addEventListener('click', () => {
        switchElt(loginform, signupform)
    })
    document.querySelector('#signUpToLogin').addEventListener('click', () => {
        switchElt(loginform, signupform)
    })

}

function switchElt(elt1, elt2) {
    elt1.classList.toggle('d-none')
    elt2.classList.toggle('d-none')
}

function scrollY() {
    document.querySelector('.filDeDiscussion').scrollTo(0, document.querySelector('.filDeDiscussion').scrollHeight)
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
            console.log(listeMessage)
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
            console.log(data)
            user = data
        })

}