import axios from 'axios';
import { Alert } from 'rsuite';

Alert.config({ top: 50 });

const showError = (content) => Alert.error(content);

const defaultInstance = axios.create();
// defaultInstance.defaults.baseURL = 'http://localhost:6000'
defaultInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    showError('Bir hata oluştu');
    Promise.reject(err.response ? err.response.data.message : err);
  }
);

export default defaultInstance;
