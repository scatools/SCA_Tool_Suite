import {SAVED_WEIGHTS} from '../actionType'

const Init_State = { value: 'No Saved Measures', label: 'No Saved Measures' }


const currentWeightReducer = (state=Init_State, action) =>{
    switch (action.type){
        case SAVED_WEIGHTS:
            return {
                ...state,
                value:action.data,
                label:action.data
            }
        default:
            return state;
    }
}


export default currentWeightReducer;