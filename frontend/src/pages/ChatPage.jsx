import {Footer} from "../components/Footer";
import {NavLink} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {Header} from "../components/Header";
import {SideBar} from "../components/SideBar";
import {findUsers} from "../http/userAPI";
import {avatarPicture} from "../App";
import dayjs from "dayjs";
import {allMessagesInChat, allUserDialogs, doRequest, removeMessage, updateMessage} from "../http/messagesAPI";
import {Message} from "../components/Message";
import {stompClient} from "./Login";

require('dayjs/locale/es')
var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

export const ChatPage = () => {
    const {user} = useContext(Context)


    const [lastResponse, setLastResponse] = useState();
    const [searchLine, setSearchLine] = useState('');
    const [receiver, setReceiver] = useState()
    const [chatUsers, setChatUsers] = useState();
    const [searchUsersList, setSearchUsersList] = useState();
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState()
    const [selectedMessages, setSelectedMessages] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    let chatArea = document.querySelector('#chatRoom')
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadDialogs()
    }, []);

    const loadDialogs = () => {
        setTimeout(() => {
            allUserDialogs().then(data => {
                setChatUsers(data.data)
            }).catch()
                .finally(() => {
                    setLoading(false)
                })
        }, 200);
    }

    const searchUsers = async () => {
        if (searchLine !== '') {
            await findUsers(searchLine, 0).then(res => {
                setSearchUsersList(res.data._embedded.users)
            })
        }
    }

    const deleteMessages = () => {
        selectedMessages.forEach(async (selectedMessage) => {
            await removeMessage(selectedMessage.message).then(() => {
                    setMessages(prevState => prevState.filter((item) => item.id !== selectedMessage.message.id))
                    setSelectedMessages(prevState => prevState.filter((item) => item.message.id !== selectedMessage.message.id))
                }
            )

        })
        loadDialogs()

    }


    const selectMessage = (e, message) => {
        const messageDiv = e.target
        messageDiv.classList.toggle('active-message')
        if (messageDiv.classList.contains('active-message')) {
            setSelectedMessages(prevState => [{message: message, messageDiv: messageDiv}, ...prevState])
        } else {
            setSelectedMessages(prevState => prevState.filter((item) => item.messageDiv !== messageDiv))
        }
    }
    const backFromEdit = () => {
        setMessageText('')
        selectedMessages.at(0).messageDiv.classList.remove('active-message')
        setSelectedMessages([])
        setIsEdit(false)
    }
    const editMessage = async () => {
        if (messageText === '') {
            return
        }
        const chatMessage = {
            id: selectedMessages.at(0).message.id,
            content: messageText,
            sender: user.user,
            receiver: receiver,
            sendTime: selectedMessages.at(0).message.sendTime
        }
        await updateMessage(chatMessage).then((res) => {
            setMessages(prevState => {
                prevState[prevState.indexOf(prevState.find(item => item.receiver.id === res.data.receiver.id))] = res.data
                return prevState
            })
            backFromEdit()
        })


    }


    const updateMessages = async (e) => {
        if (lastResponse._links.next && e.target.getBoundingClientRect().y - e.target.lastChild.getBoundingClientRect().y === -32) {
            let lastEl = e.target.lastChild
            await doRequest(lastResponse._links.next.href).then(res => {
                setLastResponse(res.data)
                setMessages(prevState => (prevState.concat(res.data._embedded.messages)))
            }).finally(() => {
                setTimeout(() => {
                    let scrollDif = e.target.getBoundingClientRect().y - lastEl.getBoundingClientRect().y + 32
                    e.target.scrollTop += scrollDif
                },)
            })
        }

    }
    const onConnected = async (receiver) => {

        if (user.user.id < receiver.id) {
            stompClient.subscribe('/topic/' + user.user.username + '/' + receiver.username, onMessageReceived)
        } else {
            stompClient.subscribe('/topic/' + receiver.username + '/' + user.user.username, onMessageReceived)
        }
        await allMessagesInChat(user.user, receiver, 0).then(res => {
            setLastResponse(res.data)
            setMessages(res.data._embedded.messages)
        }).finally(() => {
            setTimeout(() => {
                chatArea.scrollTop = chatArea.scrollHeight
            },)
        })


    }
    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body)
        chatArea = document.querySelector('#chatRoom')
        setMessages(prevState => [message, ...prevState])
        // setChatUsers(prevState => {
        //     prevState[prevState.indexOf(prevState.find(item => item.receiver.id === message.receiver.id))] = message
        //     return prevState
        // })
        setTimeout(() => chatArea.scrollTop = chatArea.scrollHeight,)
        loadDialogs()
    }

    const chatHandler = (userToChat) => {
        if (userToChat === receiver) {
            return
        }

        if (!receiver) {
            setReceiver(userToChat)
            setTimeout(() => onConnected(userToChat), 200)
        } else {
            if (user.user.id < receiver.id) {
                stompClient.unsubscribe('/topic/' + user.user.username + '/' + receiver.username, onMessageReceived)
            } else {
                stompClient.unsubscribe('/topic/' + receiver.username + '/' + user.user.username, onMessageReceived)
            }
            setReceiver(userToChat)
            onConnected(userToChat)
        }
    }


    const sendMessage = () => {

        if (messageText === '') {
            return
        }
        const chatMessage = {
            content: messageText, sender: user.user, receiver: receiver, sendTime: new dayjs()
        }
        if (messageText && stompClient) {
            if (user.user.id < receiver.id) {
                stompClient.send('/chat.send/' + user.user.username + '/' + receiver.username, {}, JSON.stringify(chatMessage))
            } else {
                stompClient.send('/chat.send/' + receiver.username + '/' + user.user.username, {}, JSON.stringify(chatMessage))
            }
            setMessageText('')

        }
    }


    const checkTime = (time) => {
        if (time) {
            const lastOnline = dayjs(time)
            switch (lastOnline.diff(new Date(), 'day', false)) {
                case 0: {
                    return lastOnline.format('HH:mm')
                }
                case 6:
                case 5:
                case 4:
                case 3:
                case 2: {
                    return lastOnline.format('dd')
                }
                case 1: {
                    return lastOnline.format('Вчера')
                }
                default: {
                    return lastOnline.format('D MMM')
                }
            }

        } else {
            return 'Онлайн'
        }
    }
    const humanizeLastOnline = (time) => {
        if (time) {
            const lastOnline = dayjs(time)
            const now = dayjs()
            if (lastOnline.diff(now, 'minutes', false) < 60) {
                switch (lastOnline.diff(now, 'minutes', false)) {
                    case 0: {
                        return 'только что'
                    }
                    case 1: {
                        return lastOnline.fromNow()
                    }
                    default: {
                        return lastOnline.fromNow()
                    }
                }
            } else if (lastOnline.diff(now, 'days', false) < 2) {
                switch (lastOnline.diff(new Date(), 'day', false)) {
                    case 0: {
                        return lastOnline.fromNow()
                    }
                    case 6:
                    case 5:
                    case 4:
                    case 3:
                    case 2: {
                        return lastOnline.format('dd')
                    }
                    case 1: {
                        return lastOnline.format('вчера')
                    }
                    default: {
                        return lastOnline.format('D MMMM')
                    }
                }
            }
        }
    }
    return (<div>
        <Header/>

        <SideBar active={"Chat page"}/>

        <main id="main" className="main">

            <div className="pagetitle">
                <h1>Мои сообщения</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><NavLink to="/">Главная</NavLink></li>
                        <li className="breadcrumb-item active">Мои сообщения</li>
                    </ol>
                </nav>
            </div>


            <section className="section dashboard">
                <div className="row">


                    <div className="col-lg-12">
                        <div className="row">
                            <section style={{backgroundColor: '#CDC4F9'}}>
                                <div className="container py-5">

                                    <div className="row">
                                        <div className="col-md-12">

                                            <div className="card" id="chat3" style={{borderRadius: '15px'}}>
                                                <div className="card-body">

                                                    <div className="row">
                                                        <div
                                                            className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0 border-end"
                                                            style={{overflowY: 'auto'}}>

                                                            <div className="p-3">

                                                                <div id="searchBar"
                                                                     className="input-group rounded mb-3">
                                                                    <input type="search"
                                                                           className="form-control rounded"
                                                                           placeholder="Введите ник"
                                                                           aria-label="Search"
                                                                           aria-describedby="search-addon"
                                                                           onChange={e => {
                                                                               setSearchLine(e.target.value)
                                                                               if (e.target.value === '') {
                                                                                   setSearchUsersList()
                                                                               }
                                                                           }}
                                                                           onKeyDown={(event) => {
                                                                               if (event.key === 'Enter') {
                                                                                   event.preventDefault();
                                                                                   searchUsers();
                                                                               }
                                                                           }}/>
                                                                    <span className="input-group-text border-0"
                                                                          onClick={searchUsers}
                                                                          id="search-addon"><i
                                                                        className="fas fa-search"></i></span>
                                                                </div>
                                                                <div data-mdb-perfect-scrollbar="true"
                                                                     style={{
                                                                         position: 'relative',
                                                                         height: 'auto',
                                                                         overflowY: 'auto'
                                                                     }}>
                                                                    <ul className="list-unstyled border-right mb-0"
                                                                        style={{
                                                                            display: "flex",
                                                                            flexDirection: "column-reverse"
                                                                        }}>
                                                                        {!chatUsers && !searchUsersList && <div
                                                                            className=" row card-body align-items-center justify-content-around"
                                                                            style={{height: '600px'}}>
                                                                        <span
                                                                            className="text-center">Для начала общения найдите пользователя по нику</span>
                                                                        </div>}
                                                                        {searchUsersList && searchUsersList.map(searhUser => {
                                                                            return (
                                                                                <li className="p-2 border-bottom border-top"
                                                                                    key={searhUser.id}>
                                                                                    <NavLink
                                                                                        onClick={() => chatHandler(searhUser)}
                                                                                        to="#"
                                                                                        className="d-flex justify-content-between align-items-center">
                                                                                        <div
                                                                                            className="d-flex flex-row">
                                                                                            <div>
                                                                                                <img
                                                                                                    src={avatarPicture(searhUser)}
                                                                                                    style={{
                                                                                                        height: '60px',
                                                                                                        width: '60px'
                                                                                                    }}
                                                                                                    alt="Profile"
                                                                                                    className="rounded-circle d-flex align-self-center me-3"/>
                                                                                                <span
                                                                                                    className="badge bg-success badge-dot"></span>
                                                                                            </div>
                                                                                            <div
                                                                                                className="pt-1">
                                                                                                <p className="fw-bold mb-0">{searhUser.username}</p>
                                                                                                <p className="small text-muted">Перейти
                                                                                                    в диалог</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="pt-1">
                                                                                            <p className="small text-muted mb-1">{checkTime(searhUser.lastOnline)}</p>
                                                                                        </div>
                                                                                    </NavLink></li>)
                                                                        })}
                                                                        {searchUsersList?.length === 0 && <div
                                                                            className=" row card-body align-items-center justify-content-around"
                                                                            style={{height: '600px'}}>
                                                                        <span
                                                                            className="text-center">Пользователей ,содержащих в нике "{searchLine}" не найдено</span>
                                                                        </div>}
                                                                        {chatUsers && (!searchUsersList || searchLine === '') && chatUsers.map(message => {
                                                                            if (message.sender.id === user.user.id) {
                                                                                return (
                                                                                    <li className="p-2 border-top border-bottom">
                                                                                        <NavLink
                                                                                            onClick={() => chatHandler(message.receiver)}
                                                                                            to="#"
                                                                                            className="d-flex justify-content-between">
                                                                                            <div
                                                                                                className="d-flex flex-row">
                                                                                                <div>
                                                                                                    <img
                                                                                                        src={avatarPicture(message.receiver)}
                                                                                                        style={{
                                                                                                            height: '60px',
                                                                                                            width: '60px'
                                                                                                        }}
                                                                                                        alt="Profile"
                                                                                                        className="rounded-circle d-flex align-self-center me-3"/>
                                                                                                    <span
                                                                                                        className="badge bg-success badge-dot"></span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="pt-1">
                                                                                                    <p className="fw-bold mb-0">{message.receiver.username}</p>
                                                                                                    <p className="small text-muted">{message.content}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                className="pt-1">
                                                                                                <p className="small text-muted mb-1">{checkTime(message.sendTime)}</p>
                                                                                            </div>
                                                                                        </NavLink></li>)
                                                                            } else {
                                                                                return (
                                                                                    <li className="p-2 border-bottom">
                                                                                        <NavLink
                                                                                            onClick={() => {
                                                                                                setReceiver(message.sender)
                                                                                                setTimeout(() => onConnected(message.sender), 200)
                                                                                            }}
                                                                                            to="#"
                                                                                            className="d-flex justify-content-between">
                                                                                            <div
                                                                                                className="d-flex flex-row">
                                                                                                <div>
                                                                                                    <img
                                                                                                        src={avatarPicture(message.sender)}
                                                                                                        alt="avatar"
                                                                                                        className="rounded-circle d-flex align-self-center me-3"
                                                                                                        style={{
                                                                                                            height: '60px',
                                                                                                            width: '60px'
                                                                                                        }}/>
                                                                                                    <span
                                                                                                        className="badge bg-success badge-dot"></span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="pt-1">
                                                                                                    <p className="fw-bold mb-0">{message.sender.username}</p>
                                                                                                    <p className="small text-muted">{message.content}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                className="pt-1">
                                                                                                <p className="small text-muted mb-1">{checkTime(message.sendTime)}</p>
                                                                                            </div>
                                                                                        </NavLink></li>)
                                                                            }

                                                                        })}
                                                                    </ul>


                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div className="col-md-6 col-lg-7 col-xl-8">
                                                            {messages &&
                                                                <div id="topChat" className="col-xxl-0 col-xl-12">
                                                                    {selectedMessages.length === 0 ?
                                                                        <div className="border-bottom mb-1">

                                                                            <div
                                                                                className="card-header d-flex align-items-center justify-content-between">
                                                                                <img
                                                                                    src={avatarPicture(receiver)}
                                                                                    style={{
                                                                                        height: '50px',
                                                                                        width: '50px'
                                                                                    }} alt="Profile"
                                                                                    className="rounded-circle"/>
                                                                                <div className="row"><h5
                                                                                    className="card-title text-center pt-3 pb-0 mb-0"
                                                                                    data-bs-target="#smallModal"
                                                                                    data-bs-toggle="modal"
                                                                                    style={{cursor: 'pointer'}}>{receiver.username}</h5>
                                                                                    <h6 className="text-center">{receiver.lastOnline ? 'был(а) в сети ' + humanizeLastOnline(receiver.lastOnline) : 'в сети'} </h6>
                                                                                </div>

                                                                                <button
                                                                                    className="btn btn-white rounded-pill">
                                                                                    <i
                                                                                        className="bi bi-three-dots"></i>
                                                                                </button>
                                                                            </div>


                                                                        </div> :
                                                                        <div className="border-bottom mb-1">

                                                                            <div
                                                                                className="card-header d-flex align-items-center justify-content-between">
                                                                                <div className="row flex-fill"><h5
                                                                                    className="card-title"
                                                                                >Выбрано {selectedMessages.length} сообщение(-ий) </h5>
                                                                                </div>

                                                                                {selectedMessages.length === 1 &&
                                                                                    <button
                                                                                        className="btn btn-outline-secondary rounded-pill m-2"
                                                                                        onClick={() => {
                                                                                            setMessageText(selectedMessages.at(0).messageDiv.querySelector('p').innerHTML)
                                                                                            setIsEdit(true)
                                                                                        }}>
                                                                                        <i
                                                                                            className="bi bi-pencil"></i>
                                                                                    </button>}
                                                                                <button
                                                                                    className="btn btn-outline-danger rounded-pill m-2">
                                                                                    <i
                                                                                        className="bi bi-trash"
                                                                                        onClick={deleteMessages}></i>
                                                                                </button>
                                                                            </div>


                                                                        </div>
                                                                    }

                                                                </div>}
                                                            {<div id="chatRoom"
                                                                  className="pt-3 pe-3"
                                                                  data-mdb-perfect-scrollbar="true"
                                                                  style={{
                                                                      display: messages ? 'flex' : 'none',
                                                                      flexDirection: "column-reverse",
                                                                      position: 'relative',
                                                                      height: '500px',
                                                                      overflow: 'auto'
                                                                  }}
                                                                  onScroll={updateMessages}
                                                            >

                                                                {messages?.map((message) => {
                                                                    return <Message message={message}
                                                                                    isSender={message.sender.id === user.user.id}
                                                                                    onClick={(e) => selectMessage(e, message)}/>
                                                                })}
                                                            </div>}


                                                            {messages &&
                                                                <div id="chatInputArea"
                                                                     className="text-muted justify-content-start align-items-center pe-3 pt-3 mt-2 "
                                                                     style={{display: !isEdit ? 'flex' : 'none'}}>
                                                                    <img
                                                                        src={avatarPicture(user.user)}
                                                                        style={{
                                                                            height: '50px', width: '50px'
                                                                        }} alt="Profile"
                                                                        className="rounded-circle"/>
                                                                    <input type="text"
                                                                           value={messageText}
                                                                           className="form-control form-control-lg"
                                                                           id="exampleFormControlInput2"
                                                                           onChange={e => setMessageText(e.target.value)}
                                                                           onKeyDown={(event) => {
                                                                               if (event.key === 'Enter') {
                                                                                   event.preventDefault();
                                                                                   sendMessage();
                                                                               }
                                                                           }}
                                                                           placeholder="Введите сообщение"/>
                                                                    <label htmlFor="file"
                                                                           style={{cursor: 'pointer'}}>
                                                                        <i className="fa fa-paperclip"></i>
                                                                    </label>
                                                                    <input id="file" name="file" type="file"
                                                                           multiple hidden/>
                                                                    <NavLink id="sendButton" className="ms-3"
                                                                             onClick={sendMessage}
                                                                    ><i
                                                                        className="fas fa-paper-plane"></i></NavLink>
                                                                </div>}
                                                            {messages &&
                                                                <div id="editInputArea"
                                                                     className="text-muted justify-content-start align-items-center pe-3 pt-3 mt-2 "
                                                                     style={{display: isEdit ? 'flex' : 'none'}}>
                                                                    <img
                                                                        src={avatarPicture(user.user)}
                                                                        style={{
                                                                            height: '50px', width: '50px'
                                                                        }} alt="Profile"
                                                                        className="rounded-circle"/>
                                                                    <input type="text"
                                                                           value={messageText}
                                                                           className="form-control form-control-lg"
                                                                           id="exampleFormControlInput2"
                                                                           onChange={e => setMessageText(e.target.value)}
                                                                           onKeyDown={(event) => {
                                                                               if (event.key === 'Enter') {
                                                                                   event.preventDefault();
                                                                                   editMessage();
                                                                               }
                                                                           }}
                                                                           placeholder="Введите сообщение"/>
                                                                    <NavLink className="ms-1 text-muted"
                                                                             onClick={backFromEdit}><i
                                                                        className="bi bi-x-lg"></i></NavLink>
                                                                    <NavLink id="sendEditButton" className="ms-3"
                                                                             onClick={editMessage}><i
                                                                        className="fas fa-paper-plane"></i></NavLink>
                                                                </div>
                                                            }
                                                            {!messages && <div id="noChat"
                                                                               className="col-xxl-0 col-xl-12 h-50">

                                                                <div>


                                                                    <div className="card-body ">

                                                                        <div
                                                                            className=" row card-body align-items-center justify-content-around"
                                                                            style={{height: '600px'}}>
                                                                        <span
                                                                            className="text-center">Выберите диалог...</span>
                                                                        </div>

                                                                    </div>

                                                                </div>


                                                            </div>}
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>


                        </div>
                    </div>

                </div>
            </section>
            {messages &&
                <div className="modal fade" id="smallModal" tabIndex="-1" style={{display: 'none'}}
                     aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content d-flex  justify-content-between">
                            <div className="modal-header">

                                <h5 className="modal-title">Информация</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>

                            </div>
                            <div className="modal-body">
                                <div
                                    className=" d-flex align-items-center justify-content-between mb-3">
                                    <img
                                        src={avatarPicture(user.user)}
                                        style={{
                                            height: '50px', width: '50px'
                                        }} alt="Profile"
                                        className="rounded-circle"/>
                                    <div className="row">
                                        <h5
                                            className="card-title text-center pt-3 pb-0 mb-0"
                                            data-bs-target="#largeModal"
                                            data-bs-toggle="modal"
                                            style={{cursor: 'pointer'}}>{receiver.name} {receiver.surname}</h5>
                                        <h6 className="text-center">был(а) в
                                            сети {humanizeLastOnline(receiver.lastOnline)}</h6>
                                    </div>


                                </div>
                                <ul className="list-group">
                                    <li className="list-group-item"><i
                                        className="bi bi-info-circle me-2 text-primary"></i>
                                        <span>{receiver.username}</span>
                                    </li>
                                    <li className="list-group-item"><i
                                        className="bi bi-at me-2 text-primary"></i> {receiver.email}
                                    </li>
                                    <li className="list-group-item"><i
                                        className="bi bi-calendar-date me-2 text-primary"></i> {dayjs(receiver.registrationDate).format('DD MMMM YYYY')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}

        </main>
        <Footer/>
        {/*<BackToTop/>*/}
    </div>);
}