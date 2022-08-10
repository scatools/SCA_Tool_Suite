import axios from "axios";
import { auth, signOut } from "../Auth/firebase";
import {
	currentWeightReset,
	loadUser,
	logInUser,
	mutipleSavedWeights,
	mutipleSavedWeightsReset,
	resetUser
} from "./action";

export const getWeightsThunk = async (dispatch, getState) => {
	const user = getState().user;
	if(user.loggedIn == true){
		const verification = await axios.post(
			'https://sca-cpt-backend.herokuapp.com/getMeasures',
			{username: user.username}
		);
		verification.data.names.map((val,indx) => {
			if(indx > 0){
					dispatch(mutipleSavedWeights(val));
			};
		});
	};
};

export const updateMeasuresThunk = async (dispatch, getState) => {
	const user = getState().user;
	const weights = getState().multipleWeights;
	if(user.loggedIn == true){
		const sendWeight = await axios.post(
			'https://sca-cpt-backend.herokuapp.com/updateMeasures',
			{username: user.username, weights:JSON.stringify(weights)}
		);
	};
};

export const loginUserThunk = async (dispatch, getState) => {
	try {
		const idToken = await auth.currentUser.getIdToken(true);
		const result = await axios.post(
			'https://sca-cpt-backend.herokuapp.com/getUser',
			{
				idToken: idToken,
			}
		);
		if(result.data.status === "success"){
			const loggedIn = getState().user.loggedIn;
			if(loggedIn !== true){
				let user_details = result.data.info;
				dispatch(logInUser(true, user_details.username));
				user_details['is_admin'] = false;
				dispatch(loadUser(user_details));
			};
		}
		else{
			dispatch(resetUser());
		};
	} catch (error) {
		dispatch(resetUser());
	};
};

export const logoutUserThunk = async (dispatch) => {
	try {
		await signOut(auth);
		dispatch(resetUser());
		dispatch(mutipleSavedWeightsReset());
		dispatch(currentWeightReset());
	} catch (error) {
		dispatch(resetUser());
		dispatch(mutipleSavedWeightsReset());
		dispatch(currentWeightReset());
	};
};

export const getToken = async () => {
	const idToken = await auth.currentUser.getIdToken(true);
	return idToken;
};