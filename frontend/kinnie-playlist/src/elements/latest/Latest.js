import { useState, useEffect } from 'react';

import { apiJson } from '../../api/apiUtil';

import Header from '../Header';
import Vote from './Vote';

import './Latest.css';

function Latest() {
    const [latest, setLatest] = useState([]);
    const [date, setDate] = useState('');

    useEffect(() => {
        async function getData() {
            const data = await apiJson('/api/votes/latest');
            if (data.status === 200) {
                setLatest(data.response.votes.map((data) => JSON.parse(data)));
            }
        }

        getData();

        const now = new Date();
        setDate(now.toDateString() + " " + now.toTimeString());

        return () => {
            setLatest([]);
            setDate('');
        }

    }, []);

    return (
        <>
            <div className="Latest">
                <h3>Current time: {date}</h3>
                {latest.length > 0 ? latest.map((vote, index) =>
                    <Vote key={index} data={vote} />
                ) : <></>}
            </div>
            <div className="buffer"></div>
        </>
    );
}

export default Latest