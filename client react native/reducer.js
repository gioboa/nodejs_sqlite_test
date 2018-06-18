export const CLIENT_LIST_SERVER = 'CLIENT_LIST_SERVER';
export const CLIENT_LIST = 'CLIENT_LIST';
export const ADD_CLIENT_SERVER = 'ADD_CLIENT_SERVER';
export const CLEAR_CLIENT_LIST = 'CLEAR_CLIENT_LIST';

// const server_address = 'http://192.168.150.244:8080';
const server_address = 'https://nodejssqlite.herokuapp.com';
const initialState = { clients: [] };

export default function reducer(state = initialState, action) {
  // console.log('action', action);
  switch (action.type) {
    case CLIENT_LIST:
      return { ...state, clients: [...action.payload] };
    case CLEAR_CLIENT_LIST:
      return { ...state, clients: [] };
    default:
      return state;
  }
}

export function clearClientList(data) {
  return {
    type: CLEAR_CLIENT_LIST
  };
}

export function getClients(data) {
  return {
    type: CLIENT_LIST_SERVER,
    meta: {
      offline: {
        effect: { url: `${server_address}/list`, method: 'GET', body: null },
        commit: { type: 'CLIENT_LIST', meta: { result: 'ok' } },
        rollback: { type: 'ROLLBACK', meta: { result: 'fail' } }
      }
    }
  };
}

export function addClient(data) {
  return {
    type: ADD_CLIENT_SERVER,
    meta: {
      offline: {
        effect: { url: `${server_address}/list`, method: 'POST', body: JSON.stringify({ name: data.name, surname: data.surname }) },
        commit: { type: 'ADD_CLIENT', meta: { result: 'ok' } },
        rollback: { type: 'ROLLBACK', meta: { result: 'fail' } }
      }
    }
  };
}
