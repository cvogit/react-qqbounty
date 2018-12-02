import axios from 'axios';
import { snackbarTypes } from './Snackbar.actions';

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
export let jwtToken;

function setJwtToken(){
  jwtToken = localStorage.getItem('JWT');
}
export const userTypes = {
  USER_LOGIN:   'USER_LOGIN',
  USER_LOGOUT:  'USER_LOGOUT',
  USER_REGISTER:'USER_REGISTER',
  USER_BALANCE_CHANGE:'USER_BALANCE_CHANGE',
  SET_USER_INFO:      'SET_USER_INFO'
}

export const login = (pUsername, pPassword) => (dispatch) => {
  axios.post(SERVER_ADDRESS+'/users/login', {
    username: pUsername,
    password: pPassword
  })
  .then(response => {
    localStorage.setItem('JWT', response.data.result.jwt);

    setJwtToken();
    console.log(response)

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.result.jwt;
    axios.get(SERVER_ADDRESS+'/users/info')
    .then(response => {
      dispatch({
        type: userTypes.SET_USER_INFO,
        payload: {
          user: response.data.result.user
        }
      });
    })
    .catch(error => {
      
    });

    dispatch({
      type: userTypes.USER_LOGIN,
      payload: {
        login: true
      }
    });
    dispatch({
      type: snackbarTypes.SNACKBAR_ADD,
      payload: {
        message: response.data.result.message
      }
    });
  })
  .catch(error => {
    dispatch({
      type: userTypes.USER_LOGIN,
      payload: {
        login: true
      }
    });
  });
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('JWT');
  dispatch({
    type: userTypes.USER_LOGOUT,
    payload: {
      login: false
    }
  });
  dispatch({
    type: snackbarTypes.SNACKBAR_ADD,
    payload: {
      message: "Logged out"
    }
  });
}

export const register = (pUsername, pPassword, pEmail) => (dispatch) => {
  axios.post(SERVER_ADDRESS+'/users', {
    username: pUsername,
    password: pPassword,
    email: pEmail
  })
  .then(response => {
    dispatch({
      type: userTypes.USER_LOGIN,
      payload: {
        login: true
      }
    });
    dispatch({
      type: snackbarTypes.SNACKBAR_ADD,
      payload: {
        message: response.data.result.message
      }
    });
  })
  .catch(error => {
    dispatch({
      type: userTypes.USER_LOGIN,
      payload: {
        login: false
      }
    });
    console.log(error);

  });
}

export const balanceChange = (pBalance) => (dispatch) => {
  dispatch({
    type: userTypes.USER_BALANCE_CHANGE,
    payload: {
      balance: pBalance
    }
  });
}