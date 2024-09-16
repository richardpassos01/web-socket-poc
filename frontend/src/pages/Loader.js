import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';

function Loader() {
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:3001');
        let timeoutId;

        websocket.onmessage = (event) => {
            console.log('Received WebSocket message:', event.data);

            if (event.data === 'WEBSOCKET_SUCESS') {
                setRedirect('/newpage');
            } else if (event.data === 'WEBSOCKET_TIMEOUT') {
                setRedirect('/timeout');
            }
        };

        websocket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        timeoutId = setTimeout(() => {
            setRedirect('/timeout');
        }, 30000);

        return () => {
            clearTimeout(timeoutId);
            if (websocket) {
                websocket.close();
            }
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/start');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('Fetch successful');
            } catch (error) {
                console.error('Fetch Error:', error);
            }
        };

        fetchData();
    }, []);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DNA
                visible={true}
                height="180"
                width="180"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    );
}

export default Loader;
