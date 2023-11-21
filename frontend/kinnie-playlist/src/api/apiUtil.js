export async function apiJson(path, method='GET', body=null)
{
    var payload = {
        headers: {
            "Content-Type": "application/json"
        },
        method: method
    }

    if (body !== null)
    {
        payload.body = body;
    }

    const response = await fetch(path, payload);
    const json = await response.json();
    if (response.status != 200)
    {
        console.log(json.message);
        return {
            "status": response.status
        };
    }

    return {
        "status": 200,
        "response": json
    };
}

export async function spotifyRefreshToken(refreshToken, setToken)
{
    const refresh_response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID
        }),
    });
    const refresh_json = await refresh_response.json();
    if (refresh_response != 200)
    {
        console.log(refresh_response.statusText);
        return {
            "status": refresh_response.status
        };
    }

    localStorage.setItem('access_token', refresh_json.access_token);
    localStorage.setItem('refresh_token', refresh_json.refresh_token);

    setToken(refresh_json.access_token);

    return {
        "status": 200,
        "token": refresh_json.access_token
    };
}

export async function spotifyApiJson(path, token, setToken, refreshToken, method='GET', body=null, refresh_if_failure=true) 
{
    var payload = {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: method
    }

    if (body !== null)
    {
        payload.body = body;
    }

    const spotify_response = await fetch('https://api.spotify.com/v1/' + path, payload);

    const spotify_json = await spotify_response.json();

    if (spotify_response.status == 400 && refresh_if_failure)
    {
        const refreshData = await spotifyRefreshToken(refreshToken, setToken)
        if (refreshData.status != 200)
        {
            return refreshData;
        }
        return spotifyApiJson(path, refreshData.token, setToken, refreshToken, method, body, refresh_if_failure=false);
    }
    else if (spotify_response.status != 200)
    {
        console.log(spotify_response.statusText);
        return {
            "status": spotify_response.status
        };
    }

    return {
        "status": 200,
        "response": spotify_json
    };
}


export async function spotifyApi(path, token, setToken, refreshToken, method='GET', body=null, refresh_if_failure=true) 
{
    var payload = {
        headers: {
            "Authorization": "Bearer " + token,
        },
        method: method
    }

    if (body !== null)
    {
        payload.body = body;
    }

    const spotify_response = await fetch('https://api.spotify.com/v1/' + path, payload);

    if (spotify_response.status == 400 && refresh_if_failure)
    {
        const refreshData = await spotifyRefreshToken(refreshToken, setToken)
        if (refreshData.status != 200)
        {
            return refreshData;
        }
        return spotifyApi(path, refreshData.token, setToken, refreshToken, method, body, refresh_if_failure=false);
    }
    else if (spotify_response.status != 200)
    {
        console.log(spotify_response.statusText);
        return {
            "status": spotify_response.status
        };
    }

    return {
        "status": 200
    };
}



