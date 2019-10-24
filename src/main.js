import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Http from './assets/js/axios'
import Tool from './assets/js/tool'
import './assets/css/reset.css';
import './assets/css/border.css';
import 'vant/lib/index.css';
import 'swiper/dist/css/swiper.css'
import '@babel/polyfill'
import Es6Promise from 'es6-promise'
import { Popup , Stepper , Dialog , Toast ,  DatetimePicker , Area , Loading , List , Swipe, SwipeItem , Lazyload ,ImagePreview ,DropdownMenu ,DropdownItem } from 'vant';

import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper,)

Es6Promise.polyfill()

Vue.config.productionTip = false
Vue.use(Popup).use(Stepper).use(Dialog).use(Toast).use(DatetimePicker).use(Area).use(Loading).use(List).use(Swipe).use(SwipeItem).use(Lazyload).use(ImagePreview).use(DropdownMenu).use(DropdownItem);

Vue.prototype.$http = Http
Vue.prototype.$tool = Tool

import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)

router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title
	}
	if(false){
		let url = window.location.href;
		if(to.name=="removeSession"||to.name=="alipay"){
			next()
		} else if (!Tool.getStore('loginStatus') || Tool.getStore('loginStatus') == 0||Tool.getStore('loginStatus')==1&&!Tool.getUrlStringId("code")) {
			//微信未授权登录跳转到授权登录页面
			Tool.setStore('loginStatus', 1);
			Tool.setSession("windowUrl",url);
			setTimeout(()=>{
				window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe6e4e4f4cd0b25a2&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`)
			},300)
		}else if(Tool.getStore('loginStatus')==1){
			Vue.prototype.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			Http.post('/Wxsite/index/WxLogin',{
				"code":Tool.getUrlStringId("code")
			}).then(res => {
				Vue.prototype.$toast.clear();
	        	if(res.code===1){
	        		let rd=res.data;
	        		Tool.setStore("headImg",res.data.head_img);
	    			Tool.setStore("token",res.data.token);
	    			Tool.setStore("loginStatus",2);
	    			//有手机去登录没手机去绑定
	    			if(rd.mobile==""||!rd.mobile){
	    				router.replace({ name: "bindPhone"})
	    			}else{
	    				Tool.setSession("isBinding","true");
	    				window.location.href=Tool.getSession("windowUrl")
	    			}
	        	}else{
	        		alert("WxLogin:"+res.msg);
	        	}
	  		});
		}else{
			if(Tool.getSession("isBinding")!="true"&&to.name!="bindPhone"){
				Vue.prototype.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				Http.post('/Wxsite/Site/api',{
					api_name:"isBinding",
					token:Tool.getStore("token")
				}).then(res => {
					Vue.prototype.$toast.clear();
		        	if(res.code===1){
		        		Tool.setSession("isBinding","true");
		        		next()
		        	}else{
		        		router.replace({ name: "bindPhone"})
		        		//alert("isBinding:"+res.msg+"token:"+Tool.getStore("token"));
		        	}
		  		});
			}else{
				next()
			}
		}
	}else{
		Tool.setSession("isBinding","true");
		//3.商城接口没出来暂时用hsh测试
		//Tool.setStore("openid","oJkkE06DyqRPxjvlW4nVo9KZ3ReU");
		//Tool.setStore("user_id","223");

		if(Tool.getSession("isBinding")!="true"&&to.name!="bindPhone"){
			Vue.prototype.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			Http.post('/Wxsite/Site/api',{
				api_name:"isBinding",
				token:Tool.getStore("token")
			}).then(res => {
				Vue.prototype.$toast.clear();
	        	if(res.code===1){
	        		let rd=res.data;
	        		if(rd.isMobile==1){
	        			Tool.setSession("isBinding","true");
	        			next()
	        		}else{
	        			next('bindPhone')
		        	}
	        	}else{
	        		alert(res.msg);
	        	}
	  		});
		}else{
			//oXB7K5hqnwy595RDN98HIMf8xqGs
			//oXB7K5ujJ4dOcdF7mabFWcOF2Fec
			Tool.setStore("token","oXB7K5hqnwy595RDN98HIMf8xqGs");
			next()
		}
	}
	
	
})

new Vue({
	router,
	store,
  render: h => h(App),
}).$mount('#app')
