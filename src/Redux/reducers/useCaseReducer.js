import { USECASE } from "../actionType";

const initialState = {
  useCase: null,
};

const useCaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case USECASE:
      return {
        ...state,
        useCase: action.payload,
      };
    default:
      return state;
  }
};

export default useCaseReducer;
