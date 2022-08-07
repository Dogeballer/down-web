import Emitter from 'tiny-emitter'

const emmiter = new Emitter()

const GET_ROUTE = 'GET_ROUTE'

export const emitterGetRoute = () => emmiter.emit(GET_ROUTE)
export const onGetRoute = cb => emmiter.on(GET_ROUTE, cb)

export default emmiter
