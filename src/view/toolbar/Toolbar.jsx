import React from 'react'

import {Avatar, Dropdown, Menu} from 'antd';
import avatar from '../../assets/images/frame/avatar.png';
import {history, Icon} from '@cecdataFE/bui';
import { logout, getUserData } from '../../lib/storage'
import style from './style.scss'

const Toolbar = () => {
  const userData = getUserData()

  const handleLogout = () => {
    logout()
      .then(() => {
        history.replace('/login')
      })
  }

  const handleMenuClick = (item) => {
    const { key } = item
    switch (key) {
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
  }
  return (
    <Dropdown
      overlay={(
        <Menu onClick={handleMenuClick}>
          <Menu.Item key='logout'>退出登录</Menu.Item>
        </Menu>
      )}
      placement='bottomRight'
    >
      <div className={style['header-user']}>
          <span className={style['header-user-name']}>
            {userData ? userData.userName : 'cecdata'}
          </span>
        <Avatar size={32} src={avatar} />
        <Icon type='icon-shangsanjiaoxing' className={style['header-user-triangle']} />
      </div>
    </Dropdown>
  )
}

export default Toolbar
