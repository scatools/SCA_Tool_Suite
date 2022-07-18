import axios from "axios";
import {mutipleSavedWeights} from "./action";

export const getWeightsThunk = async (dispatch, getState) => {
    const user = getState().user
    if(user.loggedIn == true){
        const verification = await axios.post(
            'https://sca-cpt-backend.herokuapp.com/getMeasures',
            {username: user.username}
        );
        verification.data.names.map((val,indx) => {
            if(indx > 0){
                dispatch(mutipleSavedWeights(val))
            }
        })
    }
}


export const updateMeasuresThunk = async (dispatch, getState) => {
    const user = getState().user
    const weights = getState().multipleWeights
    if(user.loggedIn == true){
        const sendWeight = await axios.post(
            'https://sca-cpt-backend.herokuapp.com/updateMeasures',
            {username: user.username, weights:JSON.stringify(weights)}
        );
        console.log(sendWeight)
    }
}

