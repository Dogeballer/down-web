import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ModulesManage" */
  './DataSourceManage'))

export default LoadableComponent
