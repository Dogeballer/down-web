import Home from '../view/home'
import AppAssetAcct from '../view/statistics/AppAssetAcct'
import AppAssetDetail from '../view/statistics/AppAssetDetail'
import DataAssetDetail from '../view/statistics/DataAssetDetail'
import DataAssetAcct from '../view/statistics/DataAssetAcct'
import DataGradeManage from '../view/manage/DataGradeManage'
import ClassifyGradeMark from '../view/manage/ClassifyGradeMark'

export default [
  {
    exact: true,
    path: '/home',
    isChild: true, // 叶子路由
    component: Home,
    meta: {
      name: '首页',
      icon: 'home',
      className: 'home'
    }
  },
  {
    path: '/manage',
    component: null,
    meta: {
      name: '数据资产管理',
      icon: 'home'
    },
    routes: [
      {
        exact: true,
        path: '/manage/grade',
        isChild: true,
        component: DataGradeManage,
        meta: {
          name: '数据分级管理',
          icon: 'home'
        }
      },
      {
        exact: true,
        path: '/manage/classify',
        isChild: true,
        component: ClassifyGradeMark,
        meta: {
          name: '分级分类标注',
          icon: 'home'
        }
      }
    ]
  },
  {
    path: '/statistics',
    component: null,
    meta: {
      name: '数据资产统计',
      icon: 'home'
    },
    routes: [
      {
        exact: true,
        path: '/statistics/data/detail',
        isChild: true,
        component: DataAssetDetail,
        meta: {
          name: '数据资产详情'
        }
      },
      {
        exact: true,
        path: '/statistics/data/account',
        isChild: true,
        component: DataAssetAcct,
        meta: {
          name: '数据资产账号'
        }
      },
      {
        exact: true,
        path: '/statistics/app/detail',
        isChild: true,
        component: AppAssetDetail,
        meta: {
          name: '应用资产详情'
        }
      },
      {
        exact: true,
        path: '/statistics/app/account',
        isChild: true,
        component: AppAssetAcct,
        meta: {
          name: '应用资产账号'
        }
      }
    ]
  }
]
