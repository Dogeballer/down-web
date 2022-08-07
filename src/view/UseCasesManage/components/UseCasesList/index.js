import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "InterfaceContent" */
  './UseCasesList'))

export default LoadableComponent
