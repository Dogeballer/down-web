import React, {Component, Fragment} from 'react'
import {Router as HashRouter, Route, Redirect} from 'react-router-dom'
import {history, Layout} from '@fishballer/bui'
import NoMatch from '../view/404'
import Login from '../view/login'
import getRoutes from './getRoutes'
import pkg from '../../package.json'
import {isLogin, getUserInfo} from '../lib/userLocalStorage'
// import {ReactComponent as ProIcon} from '../assets/images/frame/pro-icon.svg'
import {ReactComponent as ProIcon} from '../assets/images/frame/pro-icon.svg'
import CacheRoute, {
  CacheSwitch,
  dropByCacheKey,
  clearCache,
  getCachingKeys,
  refreshByCacheKey
} from 'react-router-cache-route'
import menuBg from '../assets/images/frame/menu.png'
// import sysImg from '../assets/images/frame/sysImg.svg'
import sysImg from '../assets/images/frame/sysImg.svg'
import Toolbar from '../components/Toolbar'
import Screen from '../screen'

const aliveControl = {
  dropByCacheKey,
  clearCache,
  refreshByCacheKey,
  getCachingKeys
}

const ADMIN_ROLE = 'admin'

class Router extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pathname: '',
      routes: getRoutes()
    }
  }

  async componentDidMount() {
    const hashPath = window.location.hash.slice(1)
    this.refreshRoutes(hashPath)
    history.listen(location => {
      const pathname = location.pathname
      this.refreshRoutes(pathname)
    })
  }

  refreshRoutes = (pathname) => {
    const paths = ['/screen', '/login']
    if (!paths.includes(pathname)) {
      if (!isLogin()) {
        history.push('/login')
      } else {
        let routes = getRoutes()
        const userData = getUserInfo()
        this.setState({routes})
      }
    }
  }

  renderRoute = (routes) => {
    const renderRouters = []
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

  render() {
    const {routes} = this.state
    console.log(routes)
    const defaultRoute = this.getInitRoute(routes)
    const redirectTo = isLogin() ? defaultRoute : '/login'

    return (
      <HashRouter history={history}>
        <CacheSwitch>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/404' component={NoMatch}/>
          <Route exact path='/screen' component={Screen}/>
          <Route exact path='/'>
            <Redirect to={redirectTo}/>
          </Route>
          {
            isLogin() && (
              <Layout
                proKey='smp'
                showBreadcrumb
                menuBg={menuBg}
                routes={routes}
                defaultRoute={defaultRoute}
                // proNameImg={sysImg}
                proIcon={<ProIcon width={24} height={24} fill='#FFFFFF'/>}
                proName={pkg.projectName}
                version={pkg.version}
                aliveControl={aliveControl}
                toolbar={<Toolbar/>}
              >
                {this.renderRoute(routes)}
              </Layout>
            )
          }
        </CacheSwitch>
      </HashRouter>
    )
  }
}

export default Router
