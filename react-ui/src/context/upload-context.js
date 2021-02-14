import React, { useState } from 'react';
import Axios from "axios";

export const UploadContext = React.createContext({
  waitingJobs: [],
  isUploading: false,
  setJob: () => {},
});

const UploadContextProvider = (props) => {
  const [targetURL, setTargetURL] = useState('');
  const [waitingJobs, setWaitingJobs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const jobHandler = (job) => {
    setIsUploading(true);
    setTargetURL(job.postURL);
    chunks(job.items, fetchItemToServer).then(() => setIsUploading(false));
  };

  function fetchItemToServer(formattedItem) {
    // console.log(formattedItem);
    // const url = `https://jsonplaceholder.typicode.com/photos/${id}`;
    return Axios.post(targetURL, formattedItem);
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

  return (
    <UploadContext.Provider
      value={{
        setJob: jobHandler,
        waitingJobs: waitingJobs,
        isUploading: isUploading,
      }}
    >
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadContextProvider;
