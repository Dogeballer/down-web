import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "EnvironmentManage" */
  './EnvironmentManage'))

export default LoadableComponent
