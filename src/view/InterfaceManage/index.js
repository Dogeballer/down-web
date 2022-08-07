import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "InterfaceManage" */
  './InterfaceManage'))

export default LoadableComponent