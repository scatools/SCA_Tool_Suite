import {SAVED_WEIGHTS,SAVED_WEIGHTS_RESET} from '../actionType'

const Init_State = { value: 'No Saved Measures', label: 'No Saved Measures' }


const currentWeightReducer = (state=Init_State, action) =>{
    switch (action.type){
        case SAVED_WEIGHTS:
            return {
                ...state,
                value:action.data,
                label:action.data
            }
        case SAVED_WEIGHTS_RESET:
            return{
                ...Init_State
            }
        default:
            return state;
    }
}


export default currentWeightReducer;