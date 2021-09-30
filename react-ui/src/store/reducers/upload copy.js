import Axios from 'axios';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/',
    job: null
};

const uploadStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true, job: action.job } );
};

const uploadSuccess = (state, action) => {
    return updateObject( state, { 
        // token: action.idToken,
        // userId: action.userId,
        // error: null,
        loading: false
     } );
};

const uploadProgress = (state, action) => {
    console.log(state);
    function fetchItemToServer(formattedItem) {
            // console.log(formattedItem);
            // const url = `https://jsonplaceholder.typicode.com/photos/${id}`;
            return Axios.post('db/users', formattedItem);
          }
        
          function all(items, fn) {
            const promises = items.map((item) => fn(item));
            return Promise.all(promises);
          }
        
          // all();
        
          function series(items, fn) {
            let result = [];
            return items
              .reduce((acc, item, index) => {
                acc = acc.then(() => {
                  return fn(item).then((res) => {
                    // setFileUplaodProgress(Math.round((index / items.length) * 100));
                    result.push(res);
                  });
                });
                return acc;
              }, Promise.resolve())
              .then(() => result);
          }
        
          function splitToChunks(items, chunkSize = 50) {
            const result = [];
            for (let i = 0; i < items.length; i += chunkSize) {
              result.push(items.slice(i, i + chunkSize));
            }
            return result;
          }
        
          function chunks(items, fn, chunkSize = 100) {
            let result = [];
            const chunks = splitToChunks(items, chunkSize);
            return series(chunks, (chunk) => {
              return all(chunk, fn).then((res) => (result = result.concat(res)));
            }).then(() => result);
          }
        chunks(state.job.items, fetchItemToServer);
    return updateObject( state, { 
        // token: action.idToken,
        // userId: action.userId,
        // error: null,
        loading: true
     } );
};

const uploadFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, { token: null, userId: null });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path })
}

const reducer = ( state = initialState, action ) => {
    console.log(action);
    switch ( action.type ) {
        case actionTypes.UPLOAD_START: return uploadStart(state, action);
        case actionTypes.UPLOAD_SUCCESS: return uploadSuccess(state, action);
        case actionTypes.UPLOAD_PROGRESS: return uploadProgress(state, action);
        case actionTypes.UPLOAD_FAIL: return uploadFail(state, action);
        // case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        // case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        default:
            return state;
    }
};

export default reducer;