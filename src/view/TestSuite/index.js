import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "TestSuite" */
  './TestSuite'))

export default LoadableComponent
