import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import BeatLoader from "react-spinners/BeatLoader";

import yoda from '../assets/profile-pictures/yoda3.png';
import lisa from '../assets/profile-pictures/lisa2.png';
import stitch from '../assets/profile-pictures/stitch2.png';
import you from '../assets/profile-pictures/you.png';

const Chat = ({ model }) => {

    const chatMessagesRef = useRef(null);
    const navigate = useNavigate();
    const { farfriend } = useParams();

    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([])
    const [processing, setProcessing] = useState(false);



    const sendMessage = async (e) => {
        e.preventDefault();
        if (processing) return setMessage('')
        setProcessing(true)
        setChatLog([...chatLog, { sender: "user", text: message }, { sender: {farfriend}, text: messageLoading}])
        setMessage('')
        const ffResponse = await fetch('http://localhost:9000/predictresponse', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({"message": message, "model": model, "character": farfriend})
        })
        const friendMessage = await ffResponse.json();

        
        
        setChatLog([...chatLog, { sender: "user", text: message }, { sender: `${farfriend}`, text: friendMessage}])
        return setProcessing(false)
    }

    useEffect(() => {
        chatMessagesRef.current.scrollTo(0, chatMessagesRef.current.scrollHeight);
    }, [chatLog]);

    const messageLoading = <BeatLoader size={10} color={"#000"} loading={true} aria-label="Loading Spinner" data-testid="loader" />

    return (
        <div className="farfriends-container ff-background">
            <div className="chat-title-container">
            <button className="form-btn-back" onClick={() => navigate('/')}>BACK</button>
                <div className="flex-row">
                    <img className="farfriend-img" src={farfriend === "lisa" ? lisa : farfriend === "yoda" ? yoda : stitch} alt={farfriend}></img>
                    <h2>{farfriend[0].toUpperCase() + farfriend.slice(1,)}</h2>
                </div>
            </div>
            <div className="chat-box-container">
                <div ref={chatMessagesRef} className="chat-messages">
                {chatLog.map((message, index) => (
                    <div key={index} className={`message ${message.sender === 'user' ? 'message-user' : 'message-yoda'}`}>
                    {message.sender !== "user" && <img src={farfriend === "yoda" ? yoda : farfriend === "lisa" ? lisa : stitch} alt={farfriend} className={'message-img'}/>}
                    <p className="message-text">{message.text}</p>
                    {message.sender === "user" && <img src={you} alt="user-img" className={'user-message-img'}/>}

                    </div>
                ))}
                </div>
            </div>
            <form className="chat-message-container">
                <div>
                    <input value={message} style={{"borderRadius": "20px", textAlign:"center", width: "220px", fontSize:"15px"}} type={"text"} onChange={(e) => setMessage(e.target.value)}></input>
                    <button className="form-btn-send" style={processing ? {color:"gray"} : {color:"white"}} onClick={(e) => sendMessage(e)} >SEND</button>
                    </div>
            </form>
        </div>
    )
}

export default Chat;
