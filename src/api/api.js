import axios from 'axios';

// let base = 'http://localhost:80';
let base = 'http://47.100.60.194:8090';


//用户管理API
export const regUser = params => { return axios.post(`${base}/user/add`, params ).then(res => res.data); };
// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
export const requestLogin =    params => { return axios.post(`${base}/user/login`, params).then(res => res.data); };
export const editUser = params => { return axios.put(`${base}/user/update`, params).then(res => res.data); };
export const getUserListPage = params => { return  axios.get(`${base}/user/list/1`,params).then(res => res.data); };
export const getUserListPageByID = params => { return  axios.get(`${base}/user/`+params.username,params).then(res => res.data); };
export const getUserBynamelist = params => { return  axios.get(`${base}/user/`+params.username+'/',params).then(res => res.data); };
export const removeUser = params => { return axios.delete(`${base}/user/`+params.id,params.id).then(res=>res.data); };
export const batchRemoveUser = params => { return axios.post(`${base}/user/batchremove`,params).then(res => res.data); };
//教室管理API
export const getClassRoomlistPage = params => { return axios.get(`${base}/study_room/list`,params).then(res => res.data); };
export const getClassRoomlistPageByname = params => { return axios.get(`${base}/study_room/list/`+params.roomName,params).then(res => res.data); };
export const getseatlistPageByRoomName = params => { return axios.get(`${base}/seat/studyroom/`+params.roomName,params).then(res => res.data); };
//预定教室
export const scheduleClassRoom = params => { return axios.post(`${base}/history/`, params).then(res => res.data); };
//取消预定
export const cancelClassRoom = params => { return axios.post(`${base}/classroom/cancelClassRoom/`+params.id).then(res=>res.data); };
//房间签到 getSignInRoomlistPage
export const getSignInRoomlistPage = params => { return axios.get(`${base}/history/`+params.userid,params).then(res => res.data); };
//查询签到记录数 findRecordsListPage
export const findRecordsListPage = params => { return axios.patch(`${base}/signIn/recordsListpage`,params).then(res => res.data); };
//判断是否已经打过卡
export const hasRecordsByUseridAndRoomId = params => { return axios.patch(`${base}/signIn/hasRecordsByUseridAndRoomId`,params).then(res => res.data); };
//新增教室
export const addRoom = params => { return axios.post(`${base}//study_room`, params ).then(res => res.data); };
//编辑教室
export const editRoom = params => { return axios.post(`${base}/classroom/editRoom`, params ).then(res => res.data); };
//删除教室
export const removeRoom = params => { return axios.get(`${base}/study_room/list`,params ).then(res => res.data); };
