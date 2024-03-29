let token = null
let content = document.querySelector('.contenuDePage')
let baseUrl = 'https://b1messenger.imatrythis.com/'
let listeMessage = null

let listeMessageGroup = []
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
                    scrollY(document.querySelector('.filDeDiscussion'))
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
        regroupeMessage()
        listeMessageGroup.forEach(messageGroup => {
            allMessages += renderMessage(messageGroup)
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
             <div class=" repondreMessageBtn d-none"><span>Repondre</span><i class="bi bi-send"></i></div>
            <div class="postmessageBtn" onclick="run()"><i class="bi bi-arrow-clockwise"></i></div>
            <div class="answeringMessage">
                <div>
                   <i class="bi bi-eye"></i>
                   <i onclick="run()" class="bi bi-x-lg"></i>
                 </div>
                <span></span>
            </div>
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

function renderMessage(messageGroup) {

    let param = {
        container: 'messageContainer',
        classes: 'message',
align :'align-items-start',
        dpn: personalUsername(messageGroup[0].author)

    }
    if (user.id === messageGroup[0].author.id) {
        param.container = 'messageContainer1',
            param.classes = 'messageReverse'
        param.align='align-items-end'
    }




    let classeMessage = ''
    let messagesRegrouper = ''
    for (let k = 0; k < messageGroup.length; k++) {
        let message = messageGroup[k]
        let id = message.id
        param['responseTo'] = ''
        param['dateMessage'] = formaterDate(messageGroup[k].createdAt)
        param['option'] = `
                 <div class="messageIc">    
                   <i id="${id} "class="bi bi-chat-left-heart"></i>
                   <i onclick="renderRepondre(${id},'${param.dpn}')" class="bi bi-chat bi-chat${id}"></i>
                </div>
    `

        if (user.id === messageGroup[0].author.id) {
            param.option = `
                <div class="messageIc" ">
                      <i onclick="modifyMessage(${id},${this})" class="bi bi-pencil bi-pencil${id}"></i>
                      <i onclick="supprimer(${id})" class="bi bi-trash3"></i>
                </div>
    `

        }


            if (messageGroup.length === 1) {
                classeMessage = ''
            } else if (k === 0) {
                classeMessage = ' messageStart'
            } else if (messageGroup.length - 1 === k) {
                classeMessage = ' messageEnd'
            } else {
                classeMessage = ' messageMiddle'
            }

        if (message.hasOwnProperty('responseTo')) {
            param.responseTo = responseTo(message.responseTo)
            param.option = ''
            classeMessage += ' messageReponseContainer'
        }

        let template = `
                         <div class="${param.classes} ${classeMessage}" id="message${id}">
                            ${param.option}
                            <div class="dateMessage">
                             <span>
                                ${param.dateMessage.jour}
                             </span>  
                             <span class="jour">
                             ${param.dateMessage.heure}
                             </span>  
                            </div>
                            ${param.responseTo}
                            <div class="">
                                <div class=" d-flex flex-row align-items-top">
                                    <textarea readonly class="messageContenu${id}" name="messageContenu" id="messageContenu" >${message.content}</textarea>
                                    <button type="submit" class="d-none boutonForm editmessageSubmit${id}"> Modifier </button>
                                </div>
                              </div>
                          </div>  
                    
    `
        messagesRegrouper += template
    }

    let templateCntainer = `
        <div class="${param.container}">
            <img src="${personalImage(messageGroup[0].author.image)}" alt="Image de profil" class="messageImage">
            <div class="messageAuteurOption">
                 <span class="messageAuteur">${param.dpn}</span>    
               
            </div> 
            <div class="d-flex flex-column ${param.align}">
               ${messagesRegrouper}
            </div>      
        </div>
`

    return templateCntainer


}

function renderInterface() {
    navbar.innerHTML = `

      <div class="navbarListePV">
            <div class="pvBanner">
            <span>Chats</span>
              <div onclick="renderPopover()" class= " centered">
                    <img src="${personalImage(user.image)}" alt="" class="navbarParamImage">
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

function renderPopover() {
    switchElt(document.querySelector('.paramContainer'), document.querySelector('.separation'))
}

function renderRepondre(id, dpn) {
    document.querySelector(`.bi-chat${id}`).classList.toggle('d-none')
    let answeringMessage = document.querySelector('.answeringMessage')
    switchElt(document.querySelector('.repondreMessageBtn'), document.querySelector('.postmessageBtn'))
    answeringMessage.style.height = '60%'
    answeringMessage.style.top = '-60%'
    answeringMessage.style.padding = '10px 40px'

    answeringMessage.querySelector('.bi-x-lg').style.fontSize = '1.5em'
    answeringMessage.querySelector('span').innerHTML = `
     Repondre a <b>${dpn}</b>
    `


    document.querySelector('.repondreMessageBtn').addEventListener('click', () => {
        let contenumessage = document.querySelector('#postmessage').value
        if (!isEmpty(contenumessage)) {
            sendResponse(id, contenumessage)
        }
    })
}

//==============================
function isEmpty(elt) {
    return elt === ''
}

function modifyMessage(id, crayon) {

    document.querySelector(`.bi-pencil${id}`).classList.toggle('d-none')
    const textarea = document.querySelector(`.messageContenu${id}`)
    const bouton = document.querySelector(`.editmessageSubmit${id}`)
    console.log(textarea, bouton)

    textarea.readOnly = false
    textarea.classList.add('borderEdit')


    bouton.classList.toggle('d-none')
    bouton.addEventListener('click', () => {
        editMessage(id, textarea.value)

    })
}

function addEvent() {

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

    document.querySelectorAll('#messageContenu').forEach(message=>{
        textAreaAdjust(message)
    })

}

function textAreaAdjust(element) {
    let tempElement = document.createElement('div');
    tempElement.style.whiteSpace = 'pre-wrap';
    tempElement.style.width = 'fit-content';
    tempElement.textContent = element.value;

    document.body.appendChild(tempElement);
    let width = tempElement.clientWidth;
    document.body.removeChild(tempElement);

    element.style.width = 40 + width + 'px';


}

function switchElt(elt1, elt2) {
    elt1.classList.toggle('d-none')
    elt2.classList.toggle('d-none')
}

function scrollY(elt) {
    elt.scrollTo(0, document.querySelector('.filDeDiscussion').scrollHeight)
}

function sortByDate(liste) {
    return liste.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB;
    });

}

function responseTo(id) {
    let template = ''
        listeMessage.forEach(message => {
        if (id === message.id) {

           template = `
             <div class=" messageReponse d-flex flex-column align-items-start p-2">
            <span>${message.author.username} says :</span>
      
            <p>${message.content}</p>
            </div>
            `

        }

    })
    return template

}

function regroupeMessage() {
    let listeSortedDate = []
    listeMessage.forEach(message => {
        listeSortedDate.push(message)
        let reponses = message.responses
        if (reponses.length !== 0) {
            reponses.forEach(messageReponse => {
                messageReponse['responseTo'] = message.id
                listeSortedDate.push(messageReponse)
            })
        }

    })
    sortByDate(listeSortedDate)

    listeMessageGroup = []
    let groupSameAuthor = [listeSortedDate[0]]
    for (let k = 1; k < listeSortedDate.length; k++) {
        let id_current_mess = listeSortedDate[k].author.id
        if (listeSortedDate[k - 1].author.id === id_current_mess) {
            groupSameAuthor.push(listeSortedDate[k])
        } else {
            listeMessageGroup.push(groupSameAuthor)
            groupSameAuthor = [listeSortedDate[k]]
        }
    }
    listeMessageGroup.push(groupSameAuthor)
    console.log(listeMessageGroup)
}


function personalImage(image) {

    if (!image) {
        return 'images/defaultimg.png'
    }
    return `https://b1messenger.imatrythis.com/media/cache/avatar/images/profilepics/${image.imageName}`

}

function formaterDate(inputDate) {
    const date = new Date(inputDate)

    // Obtenir le jour du mois
    const jour = date.getDate()

    // Tableau des noms des mois
    const moisNoms = [
        "janv.",
        "févr.",
        "mars",
        "avr.",
        "mai",
        "juin",
        "juil.",
        "août",
        "sept.",
        "oct.",
        "nov.",
        "déc."
    ]

    // Obtenir le mois sous forme de texte abrégé
    const mois = moisNoms[date.getMonth()]

    // Obtenir l'année
    const annee = date.getFullYear()

    // Obtenir l'heure
    const heures = ('0' + date.getHours()).slice(-2)

    // Obtenir les minutes
    const minutes = ('0' + date.getMinutes()).slice(-2)

    // Construire les variables jour et heure
    const jourFormate = `${jour} ${mois} ${annee}`
    const heureFormatee = `${heures}h${minutes}`

    return {jour: jourFormate, heure: heureFormatee}
}

function personalUsername(profil) {
    if (!profil.displayName) {
        return profil.username
    }
    return profil.displayName
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

async function sendResponse(contenu) {
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

async function sendResponse(id, contenu) {
    const params = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            content: contenu
        })
    }
    await fetch(`${baseUrl}api/responses/${id}/new`, params)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            run()
        })
}

