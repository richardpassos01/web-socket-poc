import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';

function Loader() {
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        const userId = 1234;
        const websocket = new WebSocket('ws://localhost:3001');
    
        websocket.onopen = () => {
            console.log('WebSocket connection opened');
            fetch('http://localhost:3001/start')
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    console.log('Fetch successful');
                })
                .catch(error => console.error('Fetch Error:', error));
        };
    
        websocket.onmessage = (event) => {
            console.log('Received WebSocket message:', event.data);
    
            if (event.data === `WEBSOCKET_SUCCESS:${userId}`) {
                setRedirect('/newpage');
            }
            
            if (event.data === `WEBSOCKET_TIMEOUT:${userId}`) {
                setRedirect('/timeout');
            }
        };
    
        websocket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    
        return () => websocket.close();
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
