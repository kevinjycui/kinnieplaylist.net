import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Error from './404'

import './Character.css'

function Character() {
    const { character } = useParams();
    const [data, setData] = useState([]);
    const [code, setCode] = useState();
  
    useEffect(() => {
  
      async function getData() {
        const response = await fetch('/api/characters/' + character);
        const json = await response.json();

        setData(json);
        setCode(response.status)
      }
  
      getData();
  
    }, []);

    console.log(data)

    return <>
        {
            code == 404 ? <Error /> : <>
                <div className='Character-name'>{data.name}</div>
                <div className='Character-media'>{data.media}</div>
                <img className='Character-image' src={'../media/' + data.img_file}
                    onError={(image) => {
                        // image.target.onerror = null;
                        // image.target.src='default.png';
                    }}
                />
            </>   
        }
    </>
}

export default Character