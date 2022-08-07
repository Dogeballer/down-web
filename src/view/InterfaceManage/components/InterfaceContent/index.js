import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "InterfaceContent" */
  './InterfaceContent'))

export default LoadableComponent
