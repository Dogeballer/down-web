import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ExecuteLog" */
  './ExecuteLog'))

export default LoadableComponent
