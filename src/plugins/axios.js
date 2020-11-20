'use strict';

import Vue from 'vue';
import axios from 'axios';
import { Message } from 'view-design';

let config = {
  baseURL: 'http://47.100.35.158:11000/',
  timeout: 30 * 1000, // Timeout
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    const data = response.data;

    if (data.errorCode && data.errorCode !== 0) {
      // store.commit('SET_ERROR', { errorMsg: data.message, errorSnackbar: true });
      Message.error(data.errorMessage);
      // Message.error(data.message);
      throw {
        data,
      };
    } else {
      return data;
    }
  },
  function(error) {
    return Promise.reject(error);
  },
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
