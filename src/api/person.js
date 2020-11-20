const baseURL = '';

export function getPersonList(params) {
  return window.axios({
    url: `${baseURL}/person/list`,
    method: 'get',
    params,
  });
}
export function postPerson(data) {
  return window.axios({
    url: `${baseURL}/person`,
    method: 'post',
    data,
  });
}
export function putPerson(data) {
  return window.axios({
    url: `${baseURL}/person`,
    method: 'put',
    data,
  });
}
