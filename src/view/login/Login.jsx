import React, { Component } from 'react'
import md5 from 'md5'
import moment from 'moment'
import { Form, Icon, Input, Button, Row, Col, message } from 'antd'
import { history } from '@cecdataFE/bui'
import logo from '../../assets/images/frame/cec-data-logo.png'
import { isLogin, setUserData } from '../../lib/storage'
import { login, getCaptchaCode } from '../../api/login'
import style from './style.scss'

const FormItem = Form.Item
class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      captchaImg: '',
      captchaId: '',
      loading: false
    }
  }

  componentDidMount () {
    if (isLogin()) {
      return history.push('/')
    }
    this.resetCaptcha()
  }

  resetCaptcha = () => {
    getCaptchaCode().then(res => {
      const data = res.data || res
      const captchaCode = 'data:image/png;base64,' + data.captchaImg
      const captchaCodeId = data.captchaId
      this.setState({
        captchaImg: captchaCode,
        captchaId: captchaCodeId
      })
    }).catch(e => {
      message.error('获取验证码失败')
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (err) return
      this.setState({ loading: true })
      const { userPwd, captchaCode, userName, captchaId } = values
      if (userName === 'root' && userPwd === 'root') {
          setUserData({userName, password: userPwd})
          setTimeout(() => {
            history.replace('/')
          }, 100)
      }
      this.setState({ loading: false })
      // login({
      //   userName,
      //   userPwd: md5(userPwd),
      //   captchaId,
      //   captchaCode: captchaCode.toLowerCase()
      // }).then(userData => {
      //   setUserData(userData)
      //   setTimeout(() => {
      //     history.replace('/')
      //   }, 40)
      //   this.setState({ loading: false })
      // }).catch(err => {
      //   this.resetCaptcha()
      //   message.error(err?.data?.message || err?.message || '登录失败')
      //   this.setState({ loading: false })
      // })
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { captchaImg, captchaId, loading  } = this.state

    return (
      <div className={style['login-wrapper']}>
        <div className={style['login-body']}>
          <div className={style['login-logo']}>
            <img className={style['logo-img']} src={logo} alt='logo' />
            <h1>人工智能数据安全检测平台</h1>
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
                    {getFieldDecorator('captchaCode', {
                        rules: [{ required: true, message: '验证码不可为空' }]
                    })(
                      <Input size='large' placeholder='请输入验证码' />
                    )}
                  </Col>
                  <Col span={8} style={{ height: 40 }}>
                    <img
                      className='login-captcha'
                      src={captchaImg}
                      onClick={this.resetCaptcha}
                      alt='验证码'
                    />
                  </Col>
                </Row>
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('captchaId', {
                    initialValue: captchaId
                })(
                  <Input />
                )}
              </FormItem>
              <Button loading={loading} size='large' block type='primary' htmlType='submit'>登录</Button>
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

