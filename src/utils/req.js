import axios from "axios";

let serveip = window.localStorage.getItem("serveip");

if(!serveip){
		serveip = "localhost";
}

let baseURL = '//'+serveip+':3000';

const axiosInstance = axios.create({
	headers: {
	  // "X-Requested-With": "XMLHttpRequest",
	//   'content-type': 'application/x-www-form-urlencoded',
	//   "token": "1529029300212"
	},
	baseURL: baseURL,//process.env.VUE_APP_Api_Base_Url, // 设置 baseURL
	timeout: 15000 // 请求超时时间
});


// 添加请求拦截器
axiosInstance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axiosInstance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

  
class Req{
	constructor(){}

	static req(url, params, data){
		// console.log(data)
		return axiosInstance({
			method: "post",
			url: url,
			params: params,
			data: data
		});
	}
}

export default Req;