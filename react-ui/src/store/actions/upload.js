import * as actionTypes from './actionTypes';

export const uploadStart = (job) => {
    console.log('start');
    console.log(job);
    return {
        type: actionTypes.UPLOAD_START,
        job: job
    };
};

export const uploadProgress = (token, userId) => {
    console.log('progress');

    return {
        type: actionTypes.UPLOAD_PROGRESS
    };
};

export const uploadSuccess = (token, userId) => {
    console.log('success');
    return {
        type: actionTypes.UPLOAD_SUCCESS
    };
};

export const uploadFail = (error) => {
    return {
        type: actionTypes.UPLOAD_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const upload = (job) => {
    // console.log(job);
    return dispatch => {
        dispatch(uploadStart(job));
        dispatch(uploadProgress());
        // setTimeout(() => dispatch(uploadSuccess()), 10000);

        // function fetchItemToServer(formattedItem) {
        //     // console.log(formattedItem);
        //     // const url = `https://jsonplaceholder.typicode.com/photos/${id}`;
        //     return Axios.post('db/users', formattedItem);
        //   }
        
        //   function all(items, fn) {
        //     const promises = items.map((item) => fn(item));
        //     return Promise.all(promises);
        //   }
        
        //   // all();
        
        //   function series(items, fn) {
        //     let result = [];
        //     return items
        //       .reduce((acc, item, index) => {
        //         acc = acc.then(() => {
        //           return fn(item).then((res) => {
        //             // setFileUplaodProgress(Math.round((index / items.length) * 100));
        //             result.push(res);
        //           });
        //         });
        //         return acc;
        //       }, Promise.resolve())
        //       .then(() => result);
        //   }
        
        //   function splitToChunks(items, chunkSize = 50) {
        //     const result = [];
        //     for (let i = 0; i < items.length; i += chunkSize) {
        //       result.push(items.slice(i, i + chunkSize));
        //     }
        //     return result;
        //   }
        
        //   function chunks(items, fn, chunkSize = 100) {
        //     let result = [];
        //     const chunks = splitToChunks(items, chunkSize);
        //     return series(chunks, (chunk) => {
        //       return all(chunk, fn).then((res) => (result = result.concat(res)));
        //     }).then(() => result);
        //   }
        // chunks(job.items, fetchItemToServer);
        // setInterval(() => console.log(1), 3);
        // const authData = {
        //     email: email,
        //     password: password,
        //     returnSecureToken: true
        // };
        // let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDbMS8I4RjzhXU5pDBanXiwKliwF2aQpV4';
        // if (!isSignup) {
        //     url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDbMS8I4RjzhXU5pDBanXiwKliwF2aQpV4';
        // }
        // axios.post(url, authData)
        //     .then(response => {
        //         const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        //         localStorage.setItem('token', response.data.idToken);
        //         localStorage.setItem('expirationDate', expirationDate);
        //         localStorage.setItem('userId', response.data.localId);
        //         dispatch(authSuccess(response.data.idToken, response.data.localId));
        //         dispatch(checkAuthTimeout(response.data.expiresIn));
        //     })
        //     .catch(err => {
        //         dispatch(authFail(err.response.data.error));
        //     });
    };
};



export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

// export const authCheckState = () => {
//     return dispatch => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             dispatch(logout());
//         } else {
//             const expirationDate = new Date(localStorage.getItem('expirationDate'));
//             if (expirationDate <= new Date()) {
//                 dispatch(logout());
//             } else {
//                 const userId = localStorage.getItem('userId');
//                 dispatch(authSuccess(token, userId));
//                 dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
//             }   
//         }
//     };
// };