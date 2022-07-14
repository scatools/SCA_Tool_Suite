import axios from "axios";
import {mutipleSavedWeights} from "./action";

export const getWeightsThunk = async (dispatch, getState) => {
    const user = getState().user
    if(user.loggedIn == true){
        const verification = await axios.post(
            'http://localhost:5000/getMeasures',
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
            'http://localhost:5000/updateMeasures',
            {username: user.username, weights:JSON.stringify(weights)}
        );
        console.log(sendWeight)
    }
}

