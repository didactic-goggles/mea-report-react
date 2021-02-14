import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = {
  jobs: [],
  posts: [],
  status: 'idle',
  error: null,
};

export const addNewJob = createAsyncThunk(
  'jobs/addNewJob',
  async (job, ThunkAPI) => {
    function fetchItemToServer(item) {
    //     console.log(job)
    //   setTimeout(() => {
    //     // const state1 = ThunkAPI.getState();
    //     ThunkAPI.dispatch(
    //       updateJob({
    //         id: job.id,
    //       })
    //     );
    //   }, 100);
    //   return 1;
      return client.post(job.url, item).then(() => {
          ThunkAPI.dispatch(updateJob({
              id: job.id
          }))
      });
    }

    await chunks(job.items, fetchItemToServer);
    return {
      threadSize: job.items.length,
      completedThreadSize: job.items.length,
      id: job.id,
      url: job.url,
      name: job.name,
    };
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    updateJob(state, action) {
      const { id } = action.payload;
      const existingJob = state.jobs.find((post) => post.id === id);
      if (existingJob) {
        existingJob.completedThreadSize++;
      }
    },
  },
  extraReducers: {
    [addNewJob.pending]: (state, action) => {
      state.jobs.push({
        id: action.meta.arg.id,
        threadSize: action.meta.arg.items.length,
        completedThreadSize: 0,
        url: action.meta.arg.url,
        name: action.meta.arg.name,
        fileType: action.meta.arg.fileType,
        fileTypeTR: action.meta.arg.fileTypeTR,
        status: 'pending',
      });
    },
    [addNewJob.fulfilled]: (state, action) => {
      const { id } = action.payload;
      const existingJob = state.jobs.find((post) => post.id === id);
      if (existingJob) {
        existingJob.status = 'fulfilled';
      }
    },
    [addNewJob.rejected]: (state, action) => {
      console.log(action.payload);
      // state.status = 'failed';
      // state.error = action.payload;
    },
  },
});

export const {
  updateJob
} = jobsSlice.actions;

export default jobsSlice.reducer;

export const selectAllJobs = (state) => state.upload.jobs;

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);

function all(items, fn) {
  const promises = items.map((item) => fn(item));
  return Promise.all(promises);
}

function series(items, fn) {
  let result = [];
  return items
    .reduce((acc, item, index) => {
      acc = acc.then(() => {
        return fn(item).then((res) => {
          result.push(res);
        });
      });
      return acc;
    }, Promise.resolve())
    .then(() => result);
}

function splitToChunks(items, chunkSize = 25) {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
}

function chunks(items, fn, chunkSize = 50) {
  let result = [];
  const chunks = splitToChunks(items, chunkSize);
  return series(chunks, (chunk) => {
    return all(chunk, fn).then((res) => (result = result.concat(res)));
  }).then(() => result);
}
