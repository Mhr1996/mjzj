import Vue from 'vue'
import Router from 'vue-router'
import AddressAlias from '@/pages/address/address'
import AddressEdit from '@/pages/address/address_edit'
import About from '@/pages/about/about'
import AboutUs from '@/pages/aboutUs/aboutUs'
import AgentDetail from '@/pages/agent/agentDetail'
import AgentBill from '@/pages/agentBill/agentBill'
import AgentBillDetails from '@/pages/agentBillDetails/agentBillDetails'
import AgentManage from '@/pages/agent/agentManage'
import AddBank from '@/pages/addBank/addBank'
import AgentUpgrade from '@/pages/agentUpgrade/agentUpgrade'
import BindPhone from '@/pages/bindPhone/bindPhone'
import BankCar from '@/pages/bankCar/bankCar'
import Choice from '@/pages/choice/choice'
import ConfirmOrder from '@/pages/confirmOrder/confirmOrder'
import CorporateCulture from '@/pages/corporateCulture/corporateCulture'
import CourseMaterials from '@/pages/courseMaterials/courseMaterials'
import DiscountPackage from '@/pages/discountPackage/discountPackage'
import Faq from '@/pages/faq/faq'
import Feedback from '@/pages/feedback/feedback'
import Follow from '@/pages/follow/follow'
import FundDetails from '@/pages/fundManagement/fundDetails'
import FundManagement from '@/pages/fundManagement/fundManagement'
import Nearby from '@/pages/nearby/nearby'
import MemberOrder from '@/pages/memberOrder/memberOrder'
import MyCard from '@/pages/myCard/myCard'
import MyCollection from '@/pages/myCollection/myCollection'
import MySpace from '@/pages/mySpace/mySpace'
import MyTeam from '@/pages/myTeam/myTeam'
import onState from '@/pages/onState/onState'
import Order from '@/pages/order/order'
import OrderDetails from '@/pages/orderDetails/orderDetails'
import OrderStatu from '@/pages/orderStatu/orderStatu'
import PersonalData from '@/pages/personalData/personalData'
import RechargeList from '@/pages/rechargeList/rechargeList'
import Record from '@/pages/record/record'
import RegisterAgent from '@/pages/registerAgent/registerAgent'
import RemoveSession from '@/pages/t/removeSession'
import Success from '@/pages/success/success'
import Tips from '@/pages/tips/tips'
import Unbinding from '@/pages/personalData/unbinding'
import Warrant from '@/pages/warrant/warrant'
import NearbyProxyList from '@/pages/nearbyProxyList/nearbyProxyList'
import ReservationService from '@/pages/reservationService/reservationService'
import StoreInformation from '@/pages/storeInformation/storeInformation'
import DeviceCodeOpen from '@/pages/deviceCodeOpen/deviceCodeOpen'
import Commodity from '@/pages/commodity/commodity'
import CommodityDetails from '@/pages/commodityDetails/commodityDetails'
import ShoppingCar from '@/pages/shoppingCar/shoppingCar'
import FinalOrder from '@/pages/finalOrder/finalOrder'
import Alipay from '@/pages/alipay/alipay'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/', //绑定手机 MJZJ
      name: 'bindPhone',
      component: BindPhone,
      meta: {
        title: '绑定手机'
      }
    },
    {
      path: '/personalData', //个人资料 MJZJ
      name: 'personalData',
      component: PersonalData,
      meta: {
        title: '个人资料'
      }
    },
    {
      path: '/unbinding', //个人资料-解绑 MJZJ
      name: 'unbinding',
      component: Unbinding,
      meta: {
        title: '个人资料'
      }
    },
    {
      path: '/faq', //常见问题 MJZJ
      name: 'faq',
      component: Faq,
      meta: {
        title: '常见问题'
      }
    },
    {
      path: '/courseMaterials', //课程素材 MJZJ
      name: 'courseMaterials',
      component: CourseMaterials,
      meta: {
        title: '课程素材'
      }
    },
    {
      path: '/choice', //选择套餐 MJZJ
      name: 'choice',
      component: Choice,
      meta: {
        title: '选择套餐'
      }
    },
    {
      path: '/confirmOrder', //确认订单 MJZJ
      name: 'confirmOrder',
      component: ConfirmOrder,
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/onState', //开机状态 MJZJ
      name: 'onState',
      component: onState,
      meta: {
        title: '开机状态'
      }
    },
    {
      path: '/myCard', //我的卡项-店铺 MJZJ
      name: 'myCard',
      component: MyCard,
      meta: {
        title: '我的卡项'
      }
    },
    {
      path: '/DiscountPackage', //优惠套餐-店铺 MJZJ
      name: 'discountPackage',
      component: DiscountPackage,
      meta: {
        title: '优惠套餐'
      }
    },
    {
      path: '/rechargeList', //充值列表 MJZJ
      name: 'rechargeList',
      component: RechargeList,
      meta: {
        title: '充值列表'
      }
    },
    {
      path: '/MySpace', //我的空间 MJZJ
      name: 'mySpace',
      component: MySpace,
      meta: {
        title: '我的空间'
      }
    },
    {
      path: '/fundManagement', //流动资金 MJZJ
      name: 'fundManagement',
      component: FundManagement,
      meta: {
        title: '流动资金'
      }
    },
    {
      path: '/follow', //关注公众号 MJZJ
      name: 'follow',
      component: Follow,
      meta: {
        title: '关注公众号'
      }
    },
    {
      path: '/order', //我的订单
      name: 'order',
      component: Order,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/orderStatu', //订单状态
      name: 'orderStatu',
      component: OrderStatu,
      meta: {
        title: '订单状态'
      }
    },
    {
      path: '/record', //使用记录
      name: 'record',
      component: Record,
      meta: {
        title: '使用记录'
      }
    },
    {
      path: '/myCollection', //我的收藏
      name: 'myCollection',
      component: MyCollection,
      meta: {
        title: '我的收藏'
      }
    },
    {
      path: '/memberOrder', //会员订单
      name: 'memberOrder',
      component: MemberOrder,
      meta: {
        title: '会员订单'
      }
    },
    {
      path: '/orderDetails', //订单详情
      name: 'orderDetails',
      component: OrderDetails,
      meta: {
          title: '订单详情'
      }
    },

    {
      path: '/registerAgent', //申请代理 MJZJ
      name: 'registerAgent',
      component: RegisterAgent,
      meta: {
        title: '申请代理'
      }
    },
    {
      path: '/agentManage', //代理管理 MJZJ
      name: 'agentManage',
      component: AgentManage,
      meta: {
        title: '代理管理'
      }
    },
    {
      path: '/agentDetail', //代理管理详情 MJZJ
      name: 'agentDetail',
      component: AgentDetail,
      meta: {
        title: '代理管理'
      }
    },
    {
      path: '/warrant', //我的授权证书  MJZJ
      name: 'warrant',
      component: Warrant,
      meta: {
        title: '我的授权证书'
      }
    },
    {
      path: '/myTeam', //我的团队
      name: 'myTeam',
      component: MyTeam,
      meta: {
        title: '我的团队'
      }
    },
    {
      path: '/feedback', //意见反馈  MJZJ
      name: 'feedback',
      component: Feedback,
      meta: {
        title: '意见反馈'
      }
    },
    {
      path: '/tips', //提示
      name: 'tips',
      component: Tips,
      meta: {
        title: '提示'
      }
    },
    {
      path: '/about', //关于我们 MJZJ
      name: 'about',
      component: About,
      meta: {
        title: '关于我们'
      }
    },
    {
      path: '/success', //提交成功 MJZJ
      name: 'success',
      component:Success,
      meta: {
        title: '提交成功'
      }
    },
    {
      path: '/corporateCulture', //企业文化  MJZJ
      name: 'corporateCulture',
      component: CorporateCulture,
      meta: {
        title: '企业文化'
      }
    },
    {
      path: '/aboutUs', //关于公司 MJZJ
      name: 'aboutUs',
      component: AboutUs,
      meta: {
        title: '关于公司'
      }
    },
    {
      path: '/fundDetails', //钱包明细 MJZJ
      name: 'fundDetails',
      component: FundDetails,
      meta: {
        title: '钱包明细'
      }
    },
    {
      path: '/removeSession', //删除session MJZJ
      name: 'removeSession',
      component: RemoveSession,
      meta: {
        title: '删除session'
      }
    },
    {
      path: '/bankCar', //银行卡列表  MJZJ
      name: 'bankCar',
      component: BankCar,
      meta: {
        title: '银行卡管理'
      }
    },
    {
      path: '/addBank', //添加银行卡  MJZJ
      name: 'addBank',
      component: AddBank,
      meta: {
        title: '添加银行卡'
      }
    },
    {
      path: '/nearby', //附近店铺  MJZJ
      name: 'nearby',
      component: Nearby,
      meta: {
        title: '附近店铺'
      }
    },
    {
      path: '/nearbyProxyList', //附近代理列表  MJZJ
      name: 'nearbyProxyList',
      component: NearbyProxyList,
      meta: {
        title: '附近代理列表'
      }
    },
    {
      path: '/agentUpgrade', //代理升级  MJZJ
      name: 'agentUpgrade',
      component: AgentUpgrade,
      meta: {
        title: '代理升级'
      }
    },
    {
      path: '/reservationService', //预约服务  MJZJ
      name: 'reservationService',
      component: ReservationService,
      meta: {
        title: '预约服务'
      }
    },
    {
      path: '/storeInformation', //店铺信息  MJZJ
      name: 'storeInformation',
      component: StoreInformation,
      meta: {
        title: '店铺信息'
      }
    },
    {
      path: '/deviceCodeOpen', //设备编码开锁  MJZJ
      name: 'deviceCodeOpen',
      component: DeviceCodeOpen,
      meta: {
        title: '设备编码开锁'
      }
    },
    {
      path: '/commodity', //商城列表  MJZJ
      name: 'commodity',
      component: Commodity,
      meta: {
        title: '商城列表'
      }
    },
    {
      path: '/commodityDetails', //商城详情  MJZJ
      name: 'commodityDetails',
      component: CommodityDetails,
      meta: {
        title: '商城详情'
      }
    },
    {
      path: '/shoppingCar', //购物车  MJZJ
      name: 'shoppingCar',
      component: ShoppingCar,
      meta: {
        title: '购物车'
      }
    },
    {
      path: '/finalOrder', //订单结算  MJZJ
      name: 'finalOrder',
      component: FinalOrder,
      meta: {
        title: '订单结算'
      }
    },
    {
      path: '/addressAlias', //地址列表
      name: 'addressAlias',
      component: AddressAlias,
      meta: {
        title: '地址列表'
      }
    },
    {
      path: '/address_edit', //地址详情
      name: 'address_edit',
      component: AddressEdit,
      meta: {
        title: '地址详情'
      }
    },
    {
      path: '/agentBill', //代理订单
      name: 'agentBill',
      component: AgentBill,
      meta: {
        title: '代理订单'
      }
    },
    {
      path: '/agentBillDetails', //代理订单详情
      name: 'agentBillDetails',
      component: AgentBillDetails,
      meta: {
        title: '代理订单详情'
      }
    },
    {
      path: '/alipay', //支付宝
      name: 'alipay',
      component: Alipay,
      meta: {
        title: '支付宝'
      }
    }
  ]
})
