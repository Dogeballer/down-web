import React, { Component, Fragment } from 'react'
import { Router as HashRouter, Route, Redirect } from 'react-router-dom'
import { history, Layout, emitter } from '@cecdataFE/bui'
import NoMatch from '../view/404'
import Login from '../view/login'
import getRoutes from './getRoutes'
import pkg from '../../package.json'
import { isLogin, getUserData } from '../lib/storage'
import { ReactComponent as ProIcon } from '../assets/images/frame/pro-icon.svg'
import CacheRoute, { CacheSwitch, dropByCacheKey, clearCache, getCachingKeys, refreshByCacheKey } from 'react-router-cache-route'
import menuBg from '../assets/images/frame/menu.png'
import sysImg from '../assets/images/frame/sysImg.svg'
import Toolbar from '../view/toolbar'

const aliveControl = {
  dropByCacheKey,
  clearCache,
  refreshByCacheKey,
  getCachingKeys
}

const {
  onGetRoute
} = emitter
const ADMIN_ROLE = 'admin'
class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: getRoutes()
    }
  }
  async componentDidMount () {
    if (!isLogin()) {
      history.push('/login')
    } else {
      this.refreshRoutes()
    }
    onGetRoute(() => {
      this.refreshRoutes()
    })
  }

  refreshRoutes = () => {
    let routes = getRoutes()
    const userData = getUserData()
    if (userData?.role !== ADMIN_ROLE) {
      routes = routes.filter(v => v.path !== '/statistics')
    }
    this.setState({ routes })
  }

  renderRoute = (routes) => {
    let renderRouters = []
    const loopRoutes = (routes) => {
      routes.forEach(route => {
        if (route.routes?.length) loopRoutes(route.routes)
        if (route.component === Fragment || !route.component) return
        renderRouters.push(
          <CacheRoute
            exact
            multiple
            when={() => 'cache' in route ? route.cache : true} // 是否要缓存
            className='ka-wrapper'
            key={route.path}
            path={route.path}
            cacheKey={({location: {pathname, search}}) => (pathname + search)}
            render={props => (<route.component {...props} />)}
          />
        )
      })
    }
    loopRoutes(routes)
    return renderRouters
  }

  getInitRoute = (routes) => {
    if (routes[0].routes.length) return this.getInitRoute(routes[0].routes)
    return routes[0].path
  }

  render () {
    const { routes } = this.state
    const defaultRoute = this.getInitRoute(routes)
    const redirectTo = defaultRoute || '/login'

    return (
      <HashRouter history={history}>
        <CacheSwitch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/404' component={NoMatch} />
          <Route exact path='/'>
            <Redirect to={redirectTo} />
          </Route>
          <Layout
            proKey={'smp'}
            showBreadcrumb
            menuBg={menuBg}
            routes={routes}
            defaultRoute={defaultRoute}
            proNameImg={sysImg}
            proIcon={<ProIcon width={24} height={24} fill={'#FFFFFF'} />}
            proName={pkg.projectName}
            version={pkg.version}
            aliveControl={aliveControl}
            toolbar={<Toolbar />}
          >
            {this.renderRoute(routes)}
          </Layout>
        </CacheSwitch>
      </HashRouter>
    )
  }
}

export default Router
