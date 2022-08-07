import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "UdfManage" */
  './UdfManage'))

export default LoadableComponent
