import { useNavigate } from "react-router-dom";

import Header from '../Header';

import { apiJson } from '../../api/apiUtil';
import { useContext, useEffect } from "react";
import { TokenContext } from "../../AuthRoute";

function Random() {
    const navigate = useNavigate();

    const [token] = useContext(TokenContext);

    useEffect(() => {

        async function navigateToRandom() {
            if (token == '') {
                return;
            }
            const characterData = await apiJson("/api/characters/random");
            if (characterData.status === 200) {
                navigate("/character/" + characterData.response.character_id);
            }
        }

        navigateToRandom();

    }, [token]);


    return <Header />;
}

export default Random;