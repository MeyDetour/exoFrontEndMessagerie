let token = null
let content = document.querySelector('.contenuDePage')
let baseUrl = 'https://b1messenger.imatrythis.com/'
let listeMessage = null
let user = null
let navbar = document.querySelector('.navbar')

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
    listeMessage.forEach(message => {
        allMessages += renderMessage(message)

    })
    let fil = `
         <div class="filDeDiscussion">
         ${allMessages}
        </div>
        <div class="postMessageContainer">
            <textarea name="postmessage" placeholder="Write text..." id="postmessage" ></textarea>
            <div class="postmessageBtn"><i class="bi bi-send"></i></div>
            <div onclick="run()"><i class="bi bi-arrow-clockwise"></i></div>
        </div>
    `
    render(fil)
    let messages = document.querySelectorAll('.message')
    messages.forEach(message => {
        message.style.innerHeight += message.querySelector('#messageContenu').scrollHeight + 'px'
    })


}

function renderMessage(message) {
    let param = {
        classe : 'message',
        container : 'messageContainer',
        option : `
                 <div class="messageIc">
           
                   <i class="bi bi-chat-left-heart"></i>
                  <i class="bi bi-chat"></i>
                </div>
    `,
        dpn : message.author.displayName
    }

    if (!message.author.displayName) {
        param.dpn = message.author.username
    }

    if (user.id === message.author.id) {
        param.container = 'messageContainer1',
        param.option = `
                <div class="messageIc" ">
                     <i id="${message.id}" class="bi bi-pencil"></i>
                 <i id="${message.id}" class="bi bi-trash3"></i>
                </div>
    `
        param.dpn = 'Vous : ' + param.dpn
        param.classe = 'messageReverse'
    }

    let template =
        `
<div class="${param.container}">
     <div class="${param.classe}" id="message${message.id}">
     <div class="d-flex flex-column align-items-center justify-content-center gap-2">
         <img src="${user.imageUrl}" alt="Image de profil" class="messageImage">

      ${param.option}
</div>
       <div class="w-100 h-100">
          <h2 class="messageAuteur">${param.dpn}</h2> 
      <div class="w-100 d-flex flex-row align-items-top">
               <textarea readonly class="" name="messageContenu" id="messageContenu" >${message.content}</textarea>
            <button type="submit" class="d-none boutonForm editmessageSubmit${message.id}"> Modifier </button>
            </div>
</div>
     
</div>  
</div>
 
           
`
    return template
}

function renderInterface(){
    navbar.innerHTML = `
    
    `
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
            const textarea = document.querySelector(`#message${crayon.id} > div>  textarea`)
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

`
Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'Window':
 Request with GET/HEAD method cannot have body.`