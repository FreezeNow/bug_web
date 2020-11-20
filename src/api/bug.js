const baseURL = '';

export function getBugList(params) {
  return window.axios({
    url: `${baseURL}/bug/list`,
    method: 'get',
    params,
  });
}
export function postBug(data) {
  return window.axios({
    url: `${baseURL}/bug`,
    method: 'post',
    data,
  });
}
export function putBug(data) {
  return window.axios({
    url: `${baseURL}/bug`,
    method: 'put',
    data,
  });
}
