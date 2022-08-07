import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ProjectModule" */
  './ProjectModule'))

export default LoadableComponent
