import React, {Component, useEffect, useState} from 'react'
import {Form, Input, Modal, Select} from 'antd'
import constant, {DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG} from '../../../../../constant'
import {isEmpty} from '@fishballer/bui/dist/lib/utils'
import ClassSelect from '../../../../../components/ClassSelect/ClassSelect'
import EnvironmentAPI from '../../../../../api/environment'
import ProjectAPI from '../../../../../api/projects'
import AuthEnvironmentAPI from '../../../../../api/authEnvironment'
import utilities from '../../../../../style/utilities.scss'
import DictSelect from '../../../../../components/DictSelect/DictSelect'
import EventEmitter from '../../../../../lib/EventEmitter'

const FormItem = Form.Item
const Option = Select.Option

export const ProjectSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [projectList, setProjectList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    ProjectAPI.getProjectList()
      .then(data => {
        setProjectList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  return <Select
    loading={loading}
    {...props}
  >
    {(projectList || []).map(({id, name}) => <Option key={id} value={id}>{name}</Option>)}
  </Select>
}
export const AuthEnvironmentSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [authEnvironmentList, setAuthEnvironmentList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    AuthEnvironmentAPI.getAuthEnvironmentList()
      .then(data => {
        setAuthEnvironmentList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  return <Select
    loading={loading}
    {...props}
  >
    {(authEnvironmentList || []).map(({id, name}) => <Option key={id} value={id}>{name}</Option>)}
  </Select>
}

function EnvironmentEditModal(props = {}) {
  const {onOk, ...modalProps} = props
  const [loading, setLoading] = useState(false)
  let form = null
  const onOkHandler = () => {
    form.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true)
        let data = props.data || {}
        const id = data.id
        if (id) {
          // ETLClassAPI.updateClass('etl', { ...data, ...values })
          EnvironmentAPI.updateEnvironment(id, values)
            .then(() => {
              setLoading(false)
              // EventEmitter.emit(EVENT_TYPE.ETL_TREE_CHANGED)
              typeof onOk === 'function' && onOk()
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          // ETLClassAPI.addClass('etl', values)
          EnvironmentAPI.addEnvironment(values)
            .then(() => {
              setLoading(false)
              // EventEmitter.emit(EVENT_TYPE.ETL_TREE_CHANGED)
              typeof onOk === 'function' && onOk()
            })
            .finally(() => {
              setLoading(false)
            })
        }
      }
    })
  }

  return (
    <Modal
      centered
      title={isEmpty(props.data.id) ? '????????????' : '????????????'}
      width={'430px'}
      onOk={onOkHandler}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose={true}
      {...modalProps}
    >
      <EditForm wrappedComponentRef={ref => {
        form = ref
      }} data={props.data}/>
    </Modal>
  )
}

class Edit extends Component {
  componentDidMount() {
    if (!isEmpty(this.props.data)) {
      // const {project, ...restProps} = this.props.data
      // this.props.form.setFieldsValue({project: project.id, ...restProps})
      const {project, authentication_environment, ...restProps} = this.props.data
      // let uac_url_value = 0
      // uacList.forEach(function (item) {
      //   if (item.name === uac_url) {
      //     uac_url_value = item.value
      //   }
      // })
      // console.log(uac_url_value)
      this.props.form.setFieldsValue({
        project: project.id,
        authentication_environment: authentication_environment.id, ...restProps
      })
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form
        className={utilities['modal-form']}
        {...modalFromLayout.item}
      >
        <FormItem
          label="????????????"
        >
          {getFieldDecorator('project', {
            rules: [
              {required: true, message: '????????????????????????'}
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <ProjectSelect placeholder={'?????????'}/>
          )}
        </FormItem>
        <FormItem
          label="????????????"
        >
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '????????????????????????'}
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <Input placeholder={'?????????????????????'}/>
          )}
        </FormItem>
        <FormItem
          label="URL"
        >
          {getFieldDecorator('url', {
            rules: [
              {required: true, message: 'URL????????????'}
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <Input placeholder={'?????????URL'}/>
          )}
        </FormItem>
        {/*<FormItem*/}
        {/*  label="UAC??????"*/}
        {/*>*/}
        {/*  {getFieldDecorator('uac_url', {*/}
        {/*    rules: [*/}
        {/*      {required: true, message: 'UAC??????????????????'}*/}
        {/*      // { min: 4, max: 30, message: '?????????????????????4-30??????' }*/}
        {/*    ]*/}
        {/*  })(*/}
        {/*    <Select*/}
        {/*      style={{width: '100%'}}*/}
        {/*      placeholder={'?????????UAC??????'}*/}
        {/*    >*/}
        {/*      {*/}
        {/*        uacList.map((item) =>*/}
        {/*          <Option key={item.value} value={item.value}>{item.name}</Option>)*/}
        {/*      }*/}
        {/*    </Select>)}*/}
        {/*</FormItem>*/}
        <FormItem
          label="????????????"
        >
          {getFieldDecorator('authentication_environment', {
            rules: [
              {required: true, message: '????????????????????????'}
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <AuthEnvironmentSelect placeholder={'?????????'}/>)}
        </FormItem>
        <FormItem
          label="????????????"
        >
          {getFieldDecorator('describe', {
            rules: [
              {required: true, message: '????????????????????????'}
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <Input placeholder={'?????????????????????'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({name: 'EnvironmentForm'})(Edit)

export default EnvironmentEditModal
