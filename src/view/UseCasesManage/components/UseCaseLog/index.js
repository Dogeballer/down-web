import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ExecuteLog" */
  './UseCaseLog'))

export default LoadableComponent
