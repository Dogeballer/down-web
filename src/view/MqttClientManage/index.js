import loadable from '@loadable/component'

const LoadableComponent = loadable(() => import(/* webpackChunkName: "ModulesManage" */
  './MqttClientManage'))

export default LoadableComponent
