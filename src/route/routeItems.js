import ProjectModule from '../view/ProjectModule/ProjectModule'
import EmptyRoute from './EmptyRoute'
import DataSourceManage from "../view/DataSourceManage/DataSourceManage";
import TestSuiteClass from "../view/TestSuiteClass/TestSuiteClass";
import InterfaceManage from "../view/InterfaceManage/InterfaceManage";
import UseCasesManage from "../view/UseCasesManage/UseCasesManage";
import TestSuite from "../view/TestSuite/TestSuite";
import TaskLog from "../view/TaskLog/TaskLog";
import UdfManage from "../view/UdfManage/UdfManage";
import InterfaceClassManage from "../view/ProjectModule/components/InterfaceClassManage/InterfaceClassManage";
import MqttClientManage from "../view/MqttClientManage/MqttClientManage";

export default [
  {
    path: '/pro/ProjectManage',
    meta: {
      name: '项目配置',
      icon: 'data'
    },
    component: ProjectModule,
  },
  {
    path: '/at',
    meta: {
      name: '自动化测试',
      icon: 'icon-shujujiekou'
    },
    component: EmptyRoute,
    routes: [
      {
        path: '/at/InterfaceManage',
        isChild: true,
        component: InterfaceManage,
        meta: {
          name: '接口管理'
        }
      }, {
        path: '/at/UseCasesManage',
        isChild: true,
        component: UseCasesManage,
        meta: {
          name: '用例管理'
        }
      }, {
        path: '/at/TestSuite',
        isChild: true,
        meta: {
          name: '测试套件'
        },
        component: TestSuite
      }
    ]
  }, {
    path: '/logs',
    meta: {
      name: '日志',
      icon: 'icon-rizhi'
    },
    component: EmptyRoute,
    routes: [
      {
        path: '/logs/TaskLog',
        isChild: true,
        component: TaskLog,
        meta: {
          name: '任务日志'
        }
      }
    ]
  },
  {
    path: '/sys',
    meta: {
      name: '系统配置',
      icon: 'data'
    },
    component: EmptyRoute,
    routes: [
      {
        path: '/sys/InterfaceClass',
        isChild: true,
        meta: {
          name: '接口分类管理'
        },
        component: InterfaceClassManage
      },
      {
        path: '/sys/TestSuiteClass',
        isChild: true,
        meta: {
          name: '套件分类管理'
        },
        component: TestSuiteClass
      },
      {
        path: '/sys/MqttManage',
        isChild: true,
        meta: {
          name: 'Mqtt管理'
        },
        component: MqttClientManage
      },
      {
        path: '/sys/DataSourceManage',
        isChild: true,
        meta: {
          name: '元数据管理'
        },
        component: DataSourceManage
      }, {
        path: '/sys/UdfManage',
        isChild: true,
        meta: {
          name: 'UDF函数管理'
        },
        component: UdfManage
      }
    ]
  }
]
