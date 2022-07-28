import {MULTIPLE_SAVED_WEIGHTS, MULTIPLE_SAVED_WEIGHTS_UPDATE, MULTIPLE_SAVED_WEIGHTS_DELETE, MULTIPLE_SAVED_WEIGHTS_RESET} from '../actionType'

const Init_State = {names:[{ title: 'No Saved Measures', weight: {
    "hab": {
        "selected": null,
        "weight": 0
    },
    "wq": {
        "selected": null,
        "weight": 0
    },
    "lcmr": {
        "selected": null,
        "weight": 0
    },
    "cl": {
        "selected": null,
        "weight": 0
    },
    "eco": {
        "selected": null,
        "weight": 0
    }
} }]}


const multipleWeightReducer = (state=Init_State, action) =>{
    switch (action.type){
        case MULTIPLE_SAVED_WEIGHTS:
            let data = action.data
            return {
                ...state,
                names: [...state.names, data]
            }
        case  MULTIPLE_SAVED_WEIGHTS_UPDATE:
            let info = action.data.info
            let ind = action.data.index

            return{
                ...state,
                names: Object.assign([], state.names, {[ind]: info})
            }
        case MULTIPLE_SAVED_WEIGHTS_DELETE:
            let del_index = action.data
            return {
                ...state,
                names: state.names.filter((val, ind) => ind !== del_index)
            } 
        case MULTIPLE_SAVED_WEIGHTS_RESET:
            return{
                ...Init_State
            }
        default:
            return state;
    }
}


export default multipleWeightReducer;
