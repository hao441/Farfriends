//react r
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

//images
import yoda from '../assets/profile-pictures/yoda3.png';
import lisa from '../assets/profile-pictures/lisa2.png';
import stitch from '../assets/profile-pictures/stitch2.png';

//css
import './css/welcome.css';

const Welcome = () => {

    const [farfriend, setFarfriend] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    return (
    <div className="App">

        <header className="background grid-container">
        <div className="grid-item-1">
            <h1 className="title">Farfriends</h1>
        </div>
        <div className="grid-item-2">
            <div className="flex-row">
                <div className="">
                    <div>
                        <img className={farfriend === "yoda" ? "btn-clicked" : "welcome-img"} src={yoda} alt="Yoda" width="10%" height="50%" onClick={() => setFarfriend('yoda')}/>
                        <h4 style={farfriend === "yoda" ? {color:"gold"} : {color:""}} className="yoda">Yoda</h4>
                    </div>
                </div>
                <div className="flex-column">
                    <div>
                        <img className={farfriend === "lisa" ? "btn-clicked" : "welcome-img"} src={lisa} alt="Lisa Simpson" width="10%" height="50%" onClick={() => setFarfriend('lisa')}/>
                        <h4 style={farfriend === "lisa" ? {color:"gold"} : {color:""}} className="lisa">Lisa</h4>
                    </div>
                </div>
                <div className="flex-column">
                    <div>
                        <img className={farfriend === "stitch" ? "btn-clicked" : "welcome-img"} src={stitch} alt="Stitch" width="10%" height="50%" onClick={() => setFarfriend('stitch')}/>
                        <h4 style={farfriend === "stitch" ? {color:"gold"} : {color:""}} className="stitch">Stitch</h4>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid-item-3">
            <button className="start-button" onClick={() => {farfriend !== '' ? navigate(`/${farfriend}`) : setMessage("Please select a farfriend")}}>Start</button>
            <h4>{message}</h4>
        </div>
        </header>
    </div>
    )
}

export default Welcome;