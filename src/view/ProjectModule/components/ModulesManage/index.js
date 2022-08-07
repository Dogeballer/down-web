import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ModulesManage" */
  './ModulesManage'))

export default LoadableComponent
