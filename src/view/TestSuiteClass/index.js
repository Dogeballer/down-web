import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "TestSuiteClass" */
  './TestSuiteClass'))

export default LoadableComponent
