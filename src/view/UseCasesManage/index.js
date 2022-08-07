import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "UseCasesManage" */
  './UseCasesManage'))

export default LoadableComponent