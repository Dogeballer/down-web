import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "InterfaceContent" */
  './InterfaceList'))

export default LoadableComponent
