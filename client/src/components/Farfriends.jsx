    import React, { useState, useEffect } from "react";
    import Chat from "./Chat.jsx";
    import Loading from "./Loading";

    import './css/farfriends.css'

    const Farfriends = () => {

    const [model, setModel] = useState(null)

    const startModel = async () => {
        console.log('started')
        const response = await fetch('https://farfriends.herokuapp.com:58972/trainmodel', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
        })
        const responseJSON = await response.json();
        console.log(responseJSON)
        setModel(responseJSON)

        // const ffModel = await trainModel()
        // setModel(ffModel)
        console.log('finished')
    }

    useEffect(() => {
        startModel();
    }, [])

        return (
            <div className="farfriends-container ff-background">
                {model === null ? <Loading /> : <Chat model={model} />}
            </div>
        )
    }

    export default Farfriends;
