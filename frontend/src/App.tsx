import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
    const [backendData, setBackendData] = useState<{ text: string }[]>([]);
    const [user1Input, setUser1Input] = useState<string>('');
    const [user2Input, setUser2Input] = useState<string>('');
    const [user1_2, setUser1_2] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/test');
                setBackendData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleUser1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser1Input(e.target.value);
    };

    const handleUser2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser2Input(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, user: string) => {
        e.preventDefault();
        try {
            let newData = {
                text: user === 'user1' ? `유저1: ${user1Input}` : `유저2: ${user2Input}`,
            };
            const redirect = await axios.post('http://localhost:8080/test', newData);
            setBackendData((prevData) => [...prevData, ...redirect.data.data]);

            if (user === 'user1') {
                setUser1_2([...user1_2, `유저1: ${user1Input}`]);
                setUser1Input('');
            }
            if (user === 'user2') {
                setUser1_2([...user1_2, `유저2: ${user2Input}`]);
                setUser2Input('');
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ position: 'relative' }}>
                <h1>Frontend Data:</h1>
                <div style={{ minWidth: '40%', maxHeight: '630px', maxWidth: '50%', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    {user1_2.map((data, index) => (
                        <>
                            <span key={index}>{data}</span>
                            <br />
                        </>
                    ))}
                </div>

                <div style={{ position: 'fixed', top: '750px' }}>
                    <form onSubmit={(e) => handleSubmit(e, 'user1')}>
                        <input type="text" value={user1Input} onChange={handleUser1Change} />
                        <button type="submit">유저 1 버튼</button>
                    </form>
                    <br />
                    <form onSubmit={(e) => handleSubmit(e, 'user2')}>
                        <input type="text" value={user2Input} onChange={handleUser2Change} />
                        <button type="submit">유저 2 버튼</button>
                    </form>
                </div>
            </div>
            <div>
                <h1>Backend Data:</h1>
                <div style={{ minWidth: '40%', maxHeight: '630px', maxWidth: '50%', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    {backendData.map((value, index) => (
                        <>
                            <span key={index}>{value.text}</span>
                            <br />
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
