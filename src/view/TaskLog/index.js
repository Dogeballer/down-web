import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "TaskLog" */
  './TaskLog'))

export default LoadableComponent
