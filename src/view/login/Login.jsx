import React, { Component } from 'react'
import moment from 'moment'
import { Form, Icon, Input, Button, Row, Col, message } from 'antd'
import Captcha from 'captcha-mini'
import { history, emitter } from '@cecdataFE/bui'
import logo from '../../assets/images/frame/cec-data-logo.png'
import { isLogin, setUserData } from '../../lib/storage'
import { USER_LIST } from '../../constant'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import style from './style.scss'
import packageJson from '../../../package.json'

const FormItem = Form.Item
const { emitterGetRoute } = emitter
class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  captchaCanvas = React.createRef()

  componentDidMount () {
    this.resetCaptcha()
    if (isLogin()) {
      return history.push('/')
    }
    this.resetCaptcha()
  }

  resetCaptcha = () => {
    const captcha1 = new Captcha({ fontSize: 70, length: 4 })
    captcha1.draw(this.captchaCanvas.current, r => { this.captcha = r })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) return
      this.setState({ loading: true })
      const { userPwd, userName, captcha } = values
      if (this.captcha.toLowerCase() !== captcha.trim().toLowerCase()) {
        this.props.form.setFields({
          captcha: { value: captcha, errors: [new Error('验证码错误')] }
        })
        this.resetCaptcha()
      } else {
        const userInfo = USER_LIST.find(v => v.userName === userName && v.userPwd === userPwd)
        if (!isEmpty(userInfo)) {
          setUserData(userInfo)
          setTimeout(() => {
            emitterGetRoute()
            history.replace('/')
          }, 100)
        } else {
          message.error('用户名与密码不匹配')
        }
      }
      this.setState({ loading: false })
    })
  }

  render () {
    const { loading } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <div className={style['login-wrapper']}>
        <div className={style['login-body']}>
          <div className={style['login-logo']}>
            <h1>{packageJson.projectName}</h1>
          </div>
          <Form onSubmit={this.handleSubmit} className={style['login-form']}>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '账户不可为空' }]
              })(
                <Input size='large' prefix={<Icon type='user' />} placeholder='账户' />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('userPwd', {
                rules: [{ required: true, message: '密码不可为空' }]
              })(
                <Input.Password size='large' prefix={<Icon type='lock' />} placeholder='密码' />
              )}
            </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: '验证码不可为空' }]
                  })(
                    <Input size='large' placeholder='请输入验证码' />
                  )}
                </Col>
                <Col span={8} style={{ height: 40 }}>
                  <canvas className={style.captcha} ref={this.captchaCanvas} />
                </Col>
              </Row>
            </FormItem>
            <Button
              block
              size='large'
              type='primary'
              htmlType='submit'
              loading={loading}
            >
              登录
            </Button>
          </Form>
        </div>
        <div className={style['login-footer']}>
          &copy;2018-{moment(Date.now()).year()} 中电数据.  All Rights Reserved.中电数据
        </div>
      </div>
    )
  }
}

export default Form.create()(Login)
