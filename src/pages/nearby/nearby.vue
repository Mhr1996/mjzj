<template>
  <div>
    <section id="Map" class="vh100"></section>
    <div class="bz topSearch flex">
        <input type="text" placeholder="请输入您要搜索的店铺名或店铺地址" class="w80" @input="inputFun" v-model="condition">
        <button class="flex1 cg relative submitAfter2" @click="searchShop">确定</button>
    </div>
    <div v-if="shopList.length!=0" class="searchRow">
        <div class="relative" v-for="(item,index) of shopList" :key="index">
            <div class="bz cgf commpanyInfoMap2 cca2 bbeb" @click="go(0,item)">
                <p class="ellipsis">{{item.shop_name}}</p>
                <p class="address c9 ellipsis">{{item.address}}<span class="r c3" v-if="item.distance!=0">距离：{{item.distance}}m</span></p>
            </div>
            <img src="@/assets/imgs/dh.png" class="dhImg" @click="navigation(item)" v-if="item.distance!=0">
        </div>
    </div>
    <div class="relative bz commpanyInfoMap" v-show="shopList.length==0">
        <div class="h100 cca2" @click="go(1)" >
            <p class="ellipsis">{{current_marker.name}}</p>
            <p class="address c9 ellipsis">{{current_marker.address}}<span class="r c3" v-if="current_marker.distance!=0">距离：{{current_marker.distance}}m</span></p>
        </div>
        <img src="@/assets/imgs/dh.png" class="dhImg" @click="navigation" v-if="current_marker.distance!=0">
    </div>
    <div class="100 center bz scan">
        <img src="@/assets/imgs/scan.png" style="width: 1.37rem;" @click="scanCode">
    </div>
     <div class="flex br" style="position:fixed;bottom: .3rem;width: 94%;left: 3%;z-index: 11;background-color: #fff;">
        <div style="width: 75%">
            <input type="text" name="" v-model="macnoSearch" placeholder="请输入设备编码" class="w100 center" style="height: .8rem;" Fv="0" FvInfo="设备编码不能为空">
        </div>
        <button class="flex1 cg relative submitAfter" @click="macnoVer">确定</button>
    </div>
  </div>
</template>

<script>
export default {
    name: "nearby",
    data(){
        return {
            condition:'',
            latitude:'',
            longitude:'',
            shopList:[],
            macnoSearch:'',
            current_marker:{
                distance:0,
                lat:'',
                lng:'',
                shop_id:'',
                name:'当前位置',
                address:''
            }
        }
    },
     mounted: function () {
        this.$nextTick(function () {
            let vis=this;
            this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
            this.$http.post('/wxsite/index/getTicket',{}).then(res => {
                if (res.code==1) {
                    vis.$toast.clear();
                    //获取ticket
                    let timestamp= (new Date().getTime() / 1000).toFixed(0)
                    ,nonceStr=res.nonceStr
                    ,ticket=this.$tool.wx_js(res.data.ticket,timestamp,nonceStr);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端//alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appid, // 必填，公众号的唯一标识
                        timestamp: timestamp, // 必填，生成签名的时间戳
                        nonceStr:  nonceStr, // 必填，生成签名的随机串
                        signature: ticket ,// 必填，签名，见附录1
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(()=>{
                        wx.getLocation({
                            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                // alert(JSON.stringify(res))
                                vis.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                vis.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                setTimeout(()=>{
                                    vis.getMarkerList();
                                },300)
                            }
                        }); 
                    })
                    //测试
                    // vis.getMarkerList();
                }else{
                    this.$toast(res.data.msg);
                }
            })
        })
    },
    created(){
        
    },
    beforeDestroy: function() {
        this.$toast.clear({
          clearAll:true
        });
    },
    methods:{
        inputFun(){
            if(this.condition==""){
                this.shopList=[];
            }
        },

        searchShop(){
            //测试
            // let vis = this , center = new qq.maps.LatLng(22.990714,113.704505);
            //正式
            let vis = this , center = new qq.maps.LatLng(vis.latitude,vis.longitude);// latitude,longitude
            if(vis.condition==""){
                this.$toast("请输入查询内容！");
                return;
            }
            vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
            vis.$http.post('/wxsite/shop/api',{
                api_name: "near_shop",
                lat: vis.latitude || '22.990753',
                lng: vis.longitude || '113.704591',
                shop_name: vis.condition
            }).then(res => {
                vis.$toast.clear();
                let rd=res.data;

                if(res.code==1){
                    for(let i=0;i<rd.length;i++){
                        let bmp=vis.bMapTransQQMap(rd[i].lng,rd[i].lat);
                        let marker_loc = new qq.maps.LatLng(bmp.lat,bmp.lng);
                        rd[i].distance=Math.floor(qq.maps.geometry.spherical.computeDistanceBetween(center, marker_loc));
                    }
                    vis.shopList=rd;
                }else{
                    vis.$toast(res.msg);
                }
            })
        },
        /*
            获取附近售药机经纬度
        */
        getMarkerList(){
            //测试
            // let vis=this,lat="22.990753",lng="113.704591";
            //正式
            let vis=this,lat=vis.latitude,lng=vis.longitude;
            this.$http.post('/wxsite/shop/api',{
                api_name:"near_shop",
                lat:lat,
                lng:lng,
                shop_name:''
            }).then(res => {
                if (res.code==1) {
                    vis.markers=res.data;
                    vis.initMap();
                }else{
                    vis.$toast(res.data.msg);
                    vis.$toast.clear();
                }
            })
        },
        /*
            页面点击扫码按钮
        */
        scanCode(){
            let vis=this;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (ret) {
                    window.location.href=ret.resultStr;
                },
                complete(){
                    if(this.scanner_onOff){
                        WeixinJSBridge.call('closeWindow');
                    }
                },
                error:function(err){
                    alert(JSON.stringify(err));
                },
            });
        },
        initMap() {
            let that = this;
            //测试
            // let center = new qq.maps.LatLng(22.990714,113.704505);// latitude,longitude
            //正式
            let center = new qq.maps.LatLng(that.latitude,that.longitude);// latitude,longitude
            var map = new qq.maps.Map(document.getElementById('Map'), {
                center: center,
                zoom: 14,
                zoomControl: false,
                disableDefaultUI: true,
                draggable: true,//手势控制, 用来设置地图是否能够鼠标拖拽，默认值为“可以”；
                scrollwheel: true,//用来配置地图是否能够通过鼠标滚轮操作进行放大，默认值为“可以”；
                disableDoubleClickZoom: false// 用来配置地图是否可以通过鼠标双击进行放大，默认值为“可以”。
            });

            //获取当前位置
            var geocoder=new qq.maps.Geocoder();
            geocoder.getAddress(center);

            geocoder.setComplete((rs)=>{//设置服务请求成功的回调函数
                var rsjson=JSON.parse(JSON.stringify(rs));

                that.current_marker = {
                    name:"当前位置",
                    address:rsjson.detail.address,
                    distance: 0
                };
            });

            //创建标记
            // var myLatLng = new qq.maps.Marker({
            //     position: center,
            //     map: map,
            //     zIndex: 0
            // });

            //自定义标注图标
            var anchor = new qq.maps.Point(13, 31),
            size = new qq.maps.Size(28, 32),
            origin = new qq.maps.Point(0, 0),
            scaleSize = new qq.maps.Size('100%'),
            markerIcon = new qq.maps.MarkerImage(
                require('@/assets/imgs/ms19.png'),
                size,
                origin,
                anchor,
                scaleSize 
            );

            //myLatLng.setIcon(markerIcon);
            var ret = that.markers;
            for (var i in ret) {
                let bmp=this.bMapTransQQMap(ret[i].lng,ret[i].lat);
                var marker_loc = new qq.maps.LatLng(bmp.lat, bmp.lng);

                //创建marker
                var marker = new qq.maps.Marker({
                    position: marker_loc,
                    map: map,
                    zIndex: 1
                });
                let marker_ico = require('@/assets/imgs/ms19.png');
                //自定义标注图标
                var anchor = new qq.maps.Point(27, 28),
                origin = new qq.maps.Point(0, 0),
                scaleSize = new qq.maps.Size('100%'),
                markerIcon = new qq.maps.MarkerImage(
                    marker_ico,
                    size,
                    origin,
                    anchor,
                    scaleSize
                );
                marker.setIcon(markerIcon);

                //设置属性
                marker.distance= Math.floor(qq.maps.geometry.spherical.computeDistanceBetween(center, marker_loc));
                marker.address = ret[i].address;
                marker.lat = bmp.lat;
                marker.lng = bmp.lng;
                marker.shop_id = ret[i].shop_id;
                marker.name = ret[i].shop_name;

                //获取标记的点击事件
                qq.maps.event.addListener(marker, 'click', function (e) {
                    console.log("click")
                    that.current_marker = {
                      lat:e.target.lat,
                      lng:e.target.lng,
                      shop_id:e.target.shop_id,
                      name:e.target.name,
                      address:e.target.address,
                      distance:e.target.distance
                    };
                });
            }
            that.$toast.clear({
              clearAll:true
            });
        },
        navigation(item){
            let cm=this.current_marker;
            if(item&&item.lng){
                let bmp=this.bMapTransQQMap(item.lng,item.lat);
                wx.openLocation({
                    latitude: bmp.lat*1, // 纬度，浮点数，范围为90 ~ -90
                    longitude: bmp.lng*1, // 经度，浮点数，范围为180 ~ -180。
                    name: item.shop_name, // 位置名
                    address: item.address, // 地址详情说明
                    scale: 14// 地图缩放级别,整形值,范围从1~28。默认为最大
                });
            }else{
                wx.openLocation({
                    latitude: cm.lat*1, // 纬度，浮点数，范围为90 ~ -90
                    longitude: cm.lng*1, // 经度，浮点数，范围为180 ~ -180。
                    name: cm.name, // 位置名
                    address: cm.address, // 地址详情说明
                    scale: 14// 地图缩放级别,整形值,范围从1~28。默认为最大
                });
            }
        },
        macnoVer(){
            let vis=this;
            if(this.$tool.formVerification()){
                vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
                vis.$http.post('/Wxsite/Site/api',{
                    api_name: "deviceCalculate",
                    manco:vis.macnoSearch
                }).then(res => {
                    vis.$toast.clear();
                    let rd=res.data;

                    if(res.code==1){
                        vis.$router.push({path:'choice',query:{ macno: vis.macnoSearch}})
                    }else{
                        vis.$toast(res.msg);
                    }
                })
            }
        },
        go(val , item) {
            if (val>0) {
                if(this.current_marker.shop_id){
                    this.$router.push({path: '/storeInformation',query:{ 
                        shop_id  : this.current_marker.shop_id  , 
                        distance : this.current_marker.distance ,
                        address  : this.current_marker.address  ,
                        lat      : this.current_marker.lat ,
                        lng      : this.current_marker.lng ,
                        name     : this.current_marker.name 
                    }})
                }
            }else{
                let bmp=this.bMapTransQQMap(item.lng,item.lat);
                this.$router.push({path: '/storeInformation',query:{ 
                    shop_id  :item.shop_id  , 
                    distance :item.distance ,
                    address  :item.address  ,
                    lat      :bmp.lat ,
                    lng      :bmp.lng ,
                    name     :item.name 
                }})                 
            }
        },
        bMapTransQQMap(lng,lat){ //百度转腾讯
            let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
            let x = lng - 0.0065;
            let y = lat - 0.006;
            let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
            let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            let lngs = z * Math.cos(theta);
            let lats = z * Math.sin(theta);
            return {
                lng: lngs,
                lat: lats
            }
        }
    }
}
</script>

<style lang='scss' scoped>
  @import '@/assets/css/common.scss';

  #Map{
    width: 100%;
    height: 100vh;
  }
  .topSearch{
    position:fixed;
    top: .3rem;
    width: 86%;
    left: 7%;
    z-index: 11;
    background-color: #fff;
    padding: 7px 10px;
     @include border-radius(.6rem);
  }
  .commpanyInfoMap{
    position:fixed;
    top: 1.1rem;
    width: 94%;
    left: 3%;
    z-index: 11;
    background-color: #fff;
    padding: 15px;
    height: 1.54rem;
    img{
        position: absolute;width: .41rem;height: .38rem;z-index: 11;
    }
  }
  .commpanyInfoMap2{
    position: relative;
    width: 94%;
    background-color: #fff;
    padding: 0 15px;
    height: 1.54rem;
    margin:0 auto;
  }
  .scan{
    position:fixed;bottom: .8rem;width: 94%;left: 3%;z-index: 11;padding: 15px;
  }
  .submitAfter:after{
    position: absolute;
    content: '';
    width: 0.02rem;
    height: .33rem;
    left: 0;
    top: .22rem;
    background-color: #4aa59a;
  }
  .submitAfter2{
        padding: 7px 0;
    z-index: 10;
    margin-top: -7px;
    margin-bottom: -7px;
  }
  .submitAfter2:after{
    position: absolute;
    content: '';
    width: 0.02rem;
    height: .33rem;
    left: 0;
    top: .12rem;
    background-color: #4aa59a;
  }
  .searchRow{
    position: fixed;
    top: 1.1rem;
    width: 94%;
    left: 3%;
    z-index: 12;
    box-sizing: border-box;
    height: 9rem;
    overflow-y: auto;
  }
  .dhImg{
    position:absolute;
    width: .41rem;
    height: .38rem;
    right: .2rem;
    padding: .23rem;
    top: 0;
  }
</style>
