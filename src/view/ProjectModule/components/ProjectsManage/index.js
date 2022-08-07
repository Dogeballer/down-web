import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ProjectsManage" */
  './ProjectsManage'))

export default LoadableComponent
