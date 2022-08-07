import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ModulesManage" */
  './InterfaceClassManage'))

export default LoadableComponent
