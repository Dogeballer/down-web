import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "EnvironmentManage" */
  './AuthEnvironmentManage'))

export default LoadableComponent
