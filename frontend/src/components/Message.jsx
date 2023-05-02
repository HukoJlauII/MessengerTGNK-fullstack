import React from "react";
import {avatarPicture} from "../App";
import dayjs from "dayjs";

export const Message = (props) => {
    if (!props.isSender) {
        return (<div key={props.message.id} id={props.message.id}
                     className="d-flex flex-row justify-content-start rounded-3 mt-3 mb-3"><img
            className="rounded-circle" src={avatarPicture(props.message.sender)} alt="avatar 1"
            style={{width: '45px', height: '45px'}} data-bs-toggle="tooltip" data-bs-placement="bottom"
            title={props.message.sender.username}/>
            <div>
                <p className="small p-2 ms-3 mb-1 rounded-3"
                   style={{backgroundColor: '#f5f6f7'}}>{props.message.content}</p>
                <p className="small ms-3 mb-3 rounded-3 text-muted float-start">{dayjs(props.message.sendTime).format('HH:mm')}</p>
            </div>
        </div>);
    } else {
        return (<div key={props.message.id} id={props.message.id}
                     className="d-flex flex-row justify-content-end rounded-3 mt-3 mb-3" onClick={props.onClick}>
            <div>
                <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">{props.message.content}</p>
                <p className="small rounded-3 me-3 text-muted float-end">{dayjs(props.message.sendTime).format('HH:mm')}</p>
            </div>
            <img
                className="rounded-circle" src={avatarPicture(props.message.sender)} alt="avatar 1"
                style={{width: '45px', height: '45px'}} data-bs-toggle="tooltip" data-bs-placement="bottom"
                title={props.message.receiver.username}/>
        </div>)
    }
};