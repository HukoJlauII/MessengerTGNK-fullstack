let chatRoomList = document.querySelector('.list-unstyled')
let modal = document.querySelector('.modal-content')
let createButton = modal.querySelector('.btn-primary')
let cancelButton = modal.querySelector('.btn-secondary')
let chatArea = document.querySelector('#chatRoom')
let chatInputArea = document.querySelector('#chatInputArea')
let editInputArea = document.querySelector('#editInputArea')
let noChatArea = document.querySelector('#noChat')
let topChatArea = document.querySelector('#topChat')
let editChatArea = document.querySelector('#editChat')
const sendButton = document.querySelector('#sendButton')
const editSendButton = document.querySelector('#sendEditButton')
let searchBar = document.querySelector('#searchBar')
let searchButton = searchBar.querySelector('.fa-search')
let lastResponse
let roomInfo = document.querySelector('#largeModal')
let usersInRoom = roomInfo.querySelector('.modal-body')
searchButton.addEventListener('click', function () {
    let searchInput = searchBar.querySelector('input').value.trim()
    if (searchInput === "") {
        return
    }
    var settings = {
        "url": "http://localhost:8080/rooms/search/findWithSearch?roomName=" + searchInput,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        createAllRooms(response._embedded.rooms)
    });
})
let currentRoom

createButton.addEventListener('click', createNewRoom)

function createNewRoom() {
    let input = modal.querySelector('.form-control').value
    if (input === "") {

        return
    }
    const chatRoom = {
        roomName: input,
        owner: user
    }

    var settings = {
        "url": "http://localhost:8080/chat/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(chatRoom),
    };

    $.ajax(settings).done(function (response) {
        cancelButton.click()
        console.log(response);
        createRoom(response.rooms[response.rooms.length - 1])
    });

}


loadRooms()

function loadRooms() {

    var settings = {
        "url": "http://localhost:8080/users/" + user.id + "/rooms",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        createAllRooms(response._embedded.rooms)
    });
}


function createAllRooms(response) {
    chatRoomList.innerHTML = ''
    for (let i = 0; i < response.length; i++) {
        createRoom(response[i])
    }
}


function createRoom(response) {
    console.log(response)
    let src
    let owner = response.owner ? response.owner : user
    owner.avatar === null ? src = 'https://bootdey.com/img/Content/avatar/avatar6.png' : src = '\\image\\' + owner.avatar.id
    const room = document.createElement('li')
    room.classList.add("p-2", "border-bottom")
    room.innerHTML = "<a href=\"#!\" class=\"d-flex justify-content-between\">\n" +
        "        <div class=\"d-flex flex-row\">\n" +
        "            <div>\n" +
        "                <img\n" +
        "                    src=\"" + src + "\"" +
        "                    alt=\"avatar\" class=\"rounded-circle d-flex align-self-center me-3\" width=\"60\">\n" +
        "                    <span class=\"badge bg-success badge-dot\"></span>\n" +
        "            </div>\n" +
        "            <div class=\"pt-1\">\n" +
        "                <p class=\"fw-bold mb-0\">" + response.roomName + "</p>\n" +
        "                <p class=\"small text-muted\">Move to this chat</p>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"pt-1\">\n" +
        "            <p class=\"small text-muted mb-1\">Just now</p>\n" +
        "        </div>\n" +
        "    </a>"
    room.addEventListener('click', function () {
        showChat(response)
    })
    chatRoomList.appendChild(room)
}


function showChat(response) {
    var settings_1 = {
        "url": "http://localhost:8080/chat/check?id=" + response.id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings_1).done(function (response) {

    });

    var settings_2 = {
        "url": "http://localhost:8080/messages/search/messagesInChat?id=" + response.id + "&page=0&size=10&sort=sendTime,asc",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };


    if (currentRoom && stompClient) {
        stompClient.unsubscribe('/topic/' + currentRoom.id)
    }
    currentRoom = response

    $.ajax(settings_2).done(function (response) {

        connect()
        topChatArea.style.display = 'block'
        chatArea.style.display = 'block'
        chatInputArea.style.display = 'block'
        chatInputArea.classList.add('d-flex')
        noChatArea.style.display = 'none'
        chatArea.innerHTML = ''
        lastResponse = response
        console.log(lastResponse)
        customizeChatArea()
        showAllMessages(response._embedded.messages)
        chatArea.scrollTop = chatArea.scrollHeight

    });
}

function showAllMessages(response) {
    for (let i = 0; i < response.length; i++) {
        fetchMessages(response[i])
    }

}


function createMessage(response) {
    console.log(response)
    let src
    response.sender.avatar === null ? src = 'https://bootdey.com/img/Content/avatar/avatar6.png' : src = '\\image\\' + response.sender.avatar.id
    const message = document.createElement('div')
    message.id = "message-" + response.id
    const date = new Date(response.sendTime).toLocaleTimeString([], {timeStyle: 'short'});
    console.log(date)

    // const hour = date.getHours();
    // const minutes = date.getMinutes();
    //
    // const dateString = `${hour}:${minutes}`;
    if (response.sender.username !== user.username) {
        message.classList.add("d-flex", "flex-row", "justify-content-start", "rounded-3", "mt-3", "mb-3")
        message.innerHTML = "    <img class=\"rounded-circle\" src=\"" + src + "\"\n" +
            "         alt=\"avatar 1\" style=\"width: 45px; height: 45px;\"  data-bs-toggle=\"tooltip\" data-bs-placement=\"bottom\" title=\"" + response.sender.name + " " + response.sender.surname + "\">\n" +
            "        <div>\n" +
            "            <p class=\"small p-2 ms-3 mb-1 rounded-3\" style=\"background-color: #f5f6f7;\">" + response.content + " </p>\n" +
            "            <p class=\"small ms-3 mb-3 rounded-3 text-muted float-start\">" + date + "</p>\n" +
            "        </div>"
    } else {

        message.classList.add("d-flex", "flex-row", "justify-content-end", "rounded-3", "mt-3", "mb-3")
        message.innerHTML = "<div>\n" +
            "        <p class=\"small p-2 me-3 mb-1 text-white rounded-3 bg-primary\">" + response.content + "</p>\n" +
            "        <span class=\"small me-3  rounded-3 text-muted float-end\">" + date + "</span>\n" +
            "    </div>\n" +
            "    <img class=\"rounded-circle\" src=\"" + src + "\"\n" +
            "         alt=\"avatar 1\" style=\"width: 45px; height: 45px;\">"
        message.addEventListener('click', function () {
            message.classList.toggle('active-message')
            if (topChatArea.style.display === 'block' || activeMessagesCount() > 0) {
                topChatArea.style.display = 'none'
                editChatArea.style.display = 'block'

            } else {
                topChatArea.style.display = 'block'
                editChatArea.style.display = 'none'
            }
            if (activeMessagesCount() > 1) {
                editChatArea.querySelector('.btn').style.display = 'none'
            } else {
                editChatArea.querySelector('.btn').style.display = 'block'
            }
            let editBtn = editChatArea.querySelector('.bi-pencil')
            editBtn.addEventListener('click', function () {
                message.classList.toggle('active-message')
                editInputArea.classList.add('d-flex')
                chatInputArea.classList.remove('d-flex')
                chatInputArea.style.display = 'none'
                editInputArea.querySelector('input').value = response.content
                editInputArea.querySelector('.bi-x-lg').addEventListener('click', function () {
                    backFromEdit()
                })
                editSendButton.addEventListener('click', function () {
                        editMessage(response)
                    }
                )
                document.querySelector('#exampleFormControlInput').addEventListener("keydown", function (event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        editMessage(response)
                    }
                });
            })
            let deleteBtn = editChatArea.querySelector('.bi-trash')
            deleteBtn.addEventListener('click', function () {
                let selectedMessages = document.querySelectorAll('.active-message')
                for (let i = 0; i < selectedMessages.length; i++) {
                    let id = selectedMessages[i].id.split('-')[1]
                    var settings = {
                        "url": "http://localhost:8080/messages/" + id,
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                    };

                    $.ajax(settings).done(function (response) {

                    });
                    selectedMessages[i].parentNode.removeChild(selectedMessages[i])
                }
                topChatArea.style.display = 'block'
                editChatArea.style.display = 'none'
            })
            editChatArea.querySelector('h5').innerHTML = activeMessagesCount() + " сообщение(-ий)"

        })
    }

    return message


}

function fetchMessages(message) {
    chatArea.insertBefore(createMessage(message), chatArea.firstChild)
}


function connect() {
    if (currentRoom) {
        const socket = new SockJS('/chat')
        stompClient = Stomp.over(socket)
        stompClient.connect({}, onConnected, onError)
    }
}

const onConnected = () => {

    stompClient.subscribe('/topic/' + currentRoom.id, onMessageReceived, {id: '/topic/' + currentRoom.id})

}

const onError = (error) => {
    console.log(error)
}

const sendMessage = () => {
    const messageInput = document.querySelector('#exampleFormControlInput2')
    const messageContent = messageInput.value.trim();
    if (messageContent === '') {
        return
    }
    const chatMessage = {
        content: messageContent,
        sender: user,
        sendTime: new Date(),
        chatRoom: currentRoom

    }
    if (messageContent && stompClient)

        stompClient.send("/chat.send/" + currentRoom.id, {}, JSON.stringify(chatMessage))
    messageInput.value = ''

}


const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body)
    chatArea.appendChild(createMessage(message))
    chatArea.scrollTop = chatArea.scrollHeight
}

sendButton.addEventListener('click', sendMessage)
document.querySelector('#exampleFormControlInput2').addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

function backFromEdit() {
    chatInputArea.classList.add('d-flex')
    editInputArea.classList.remove('d-flex')
    editInputArea.style.display = 'none'
    chatInputArea.style.display = 'block'
    topChatArea.style.display = 'block'
    editChatArea.style.display = 'none'
}

function editMessage(response) {
    editedData = document.querySelector('#exampleFormControlInput').value.trim()
    if (editedData === '') {
        backFromEdit()
        return
    }
    response.content = editedData
    var settings = {
        "url": "http://localhost:8080/messages/" + response.id,
        "method": "PATCH",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(response)
    };

    $.ajax(settings).done(function (response) {
        let message = document.querySelector('#message-' + response.id)
        message.querySelector('p').innerHTML = response.content
        backFromEdit()
    });
}


function customizeChatArea() {
    console.log(currentRoom.roomName)

    let roomName = topChatArea.querySelector('.card-title')
    let cancelButton = topChatArea.querySelector('.btn-secondary')
    cancelButton.addEventListener('click', backToMenu)
    console.log(roomName)
    let infoButton = document.querySelector('.btn-white')
    roomName.addEventListener('click', showInfoAboutRoom)
    roomName.innerHTML = currentRoom.roomName


}

function showInfoAboutRoom() {
    var settings = {
        "url": "http://localhost:8080/users/search/showInfo?id=" + currentRoom.id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };
    $.ajax(settings).done(function (response) {
        usersInRoom.innerHTML = ''
        let allUsers = response._embedded.users
        for (let i = 0; i < allUsers.length; i++) {
            createUser(allUsers[i])
        }
    });
}

function backToMenu() {
    if (currentRoom && stompClient) {
        stompClient.unsubscribe('/topic/' + currentRoom.id)
    }
    currentRoom = null
    topChatArea.style.display = 'none'
    chatArea.style.display = 'none'
    chatInputArea.style.display = 'none'
    chatInputArea.classList.remove('d-flex')
    noChatArea.style.display = 'block'

}


function createUser(response) {
    let src
    response.avatar === null ? src = 'https://bootdey.com/img/Content/avatar/avatar6.png' : src = '\\image\\' + response.avatar.id
    let user = document.createElement('li')
    user.classList.add("p-2", "border-bottom")
    user.innerHTML = " <a href=\"#!\" class=\"d-flex justify-content-between\">   <div class=\"d-flex align-items-center flex-row\">\n" +
        "        <div>\n" +
        "            <img src=\" " + src + " \" alt=\"avatar\"\n" +
        "                 class=\"d-flex align-self-center me-3 rounded-circle\" style='width: 45px; height: 45px;'>\n" +
        "        </div>\n" +
        "        <div class=\"pt-1\">\n" +
        "            <p class=\"fw-bold mb-0\">" + response.name + " " + response.surname + "</p>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</a>"
    usersInRoom.appendChild(user)
}


$(chatArea).scroll(function () {
    console.log(lastResponse)
    // console.log(   chatArea.getBoundingClientRect().y - chatArea.firstChild.getBoundingClientRect().y)
    if (lastResponse._links.next) {
        if (chatArea.getBoundingClientRect().y - chatArea.firstChild.getBoundingClientRect().y === -32 && lastResponse._links.self.href !== lastResponse._links.last.href) {
            let lastScrollHeight = chatArea.scrollHeight
            var settings = {
                "url": lastResponse._links.next.href,
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
            };
            $.ajax(settings).done(function (response) {
                console.log(response)
                lastResponse = response
                showAllMessages(response._embedded.messages)
                let scrollDif = chatArea.scrollHeight - lastScrollHeight
                chatArea.scrollTop += scrollDif
            });
        }
    }
})

function activeMessagesCount() {
    return document.querySelectorAll('.active-message').length
}

