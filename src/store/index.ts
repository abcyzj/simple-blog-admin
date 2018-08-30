import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import {State} from './types';
import {getToken, setToken, removeToken} from '@/utils/token';
import axios from 'axios';

Vue.use(Vuex);

const store: StoreOptions<State> = {
  state: {
    token: getToken(),
    username: null,
    role: null,
  },

  mutations: {
    SET_TOKEN: (state, token: string) => {
      state.token = token;
    },
    SET_USERNAME: (state, username: string) => {
      state.username = username;
    },
    SET_ROLE: (state, role: string) => {
      state.role = role;
    },
  },

  actions: {
    login: async ({commit}, userInfo: any) => {
      const res = await axios.post('/api/login', userInfo);
      if (res.status !== 200 && res.status !== 401) {
        throw new Error();
      }

      if (res.data.success) {
        setToken(res.data.token);
        commit('SET_TOKEN', res.data.token);
        return true;
      } else {
        return false;
      }
    },
    getUserInfo: async ({commit, state}) => {
      const res = await axios.get('/api/userInfo');
      if (res.status !== 200 && res.status !== 401) {
        throw new Error();
      }

      commit('SET_USERNAME', res.data.username);
      commit('SET_ROLE', res.data.role);
    },
    logout: async ({commit, state}) => {
      if (!state.token) {
        return;
      }

      removeToken();
      commit('SET_TOKEN', null);
      removeToken();
    },
  },
};

export default new Vuex.Store(store);
