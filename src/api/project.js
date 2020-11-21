const baseURL = '';

export function getProjectList(params) {
  return window.axios({
    url: `${baseURL}/project/list`,
    method: 'get',
    params,
  });
}
export function postProject(data) {
  return window.axios({
    url: `${baseURL}/project`,
    method: 'post',
    data,
  });
}
export function putProject(data) {
  return window.axios({
    url: `${baseURL}/project`,
    method: 'put',
    data,
  });
}
