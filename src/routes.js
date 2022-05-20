import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Index from './views/Index.vue'
import User from './views/user/User.vue'
import Reg from './views/reg/Reg.vue'
import ClassRoom from './views/classroom/ClassRoom.vue'
import SingInRoom from './views/singin/RoomSiginIn.vue'
import ClassRoomDic from './views/classroom/ClassRoomDic.vue'
import Lc from './views/Lc.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/reg',
        component: Reg,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        hidden: true,
        children: [
            { path: '/index', component: Index, name: '主页' }
        ]
    },
 {
        path: '/',
        component: Home,
        name: '学生管理',
        iconCls: 'el-icon-s-grid',//图标样式class
        children: [
            { path: '/user', component: User, name: '学生列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '座位管理',
        iconCls: 'el-icon-s-home',//图标样式class
        children: [
            { path: '/classroomDic', component: ClassRoomDic, name: '自习室查看' },
            { path: '/classroom', component: ClassRoom, name: '座位预约' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '签到管理',
        iconCls: 'el-icon-message-solid',//图标样式class
        children: [
            { path: '/singInRoom', component: SingInRoom, name: '学生签到' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

let routesadmin = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/reg',
        component: Reg,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        hidden: true,
        children: [
            { path: '/index', component: Index, name: '主页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '学生管理',
        iconCls: 'el-icon-s-grid',//图标样式class
        children: [
            { path: '/user', component: User, name: '学生列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '座位管理',
        iconCls: 'el-icon-s-home',//图标样式class
        children: [
            { path: '/classroomDic', component: ClassRoomDic, name: '自习室查看' }


        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];
// export default routesadmin;
export default routes;
