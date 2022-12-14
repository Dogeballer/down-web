import React, { Component, useState } from 'react'
import { Modal, Form, Input, Select, TreeSelect, message } from 'antd'
import { handleNodeTreeData, getParentNodeChain } from '../../../../../../../../../lib/utils'
import { treeForeach as treeEach } from '@fishballer/bui/dist/lib/tree'
import interfaceAPI from '../../../../../../../../../api/interfaces'
import style from './style.scss'
import { modalFromLayout } from '../../../../../../../../../constant'
import EnvironmentAPI from '../../../../../../../../../api/environment'

const FormItem = Form.Item
const Option = Select.Option
const valueTypes = [
  { value: 'string', text: 'string' },
  { value: 'integer', text: 'integer' },
  { value: 'array', text: 'array' },
  { value: 'boolean', text: 'boolean' },
  { value: 'number', text: 'number' },
  { value: 'null', text: 'null' },
  { value: 'any', text: 'any' },
]

function NodeFormModal (props = {}) {
  const [loading, setLoading] = useState(false)
  const {
    record,
    nodeTree,
    paramList,
    interfaceId,
    onOk,
    onCancel,
    ...modalProps
  } = props
  let nodeForm = null

  const onOkHandler = () => {
    nodeForm.props.form.validateFields((err, values) => {
      if (!err) {
        setLoading(true)
        if (record.id) {
          // ETLClassAPI.updateClass('etl', { ...data, ...values })
          interfaceAPI.updateInterfaceBody(record.id, values)
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
          values['belong_interface'] = interfaceId
          interfaceAPI.createInterfaceBody(values)
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

  const addNodeFlag = Object.keys(record).length === 0

  return (
    <Modal
      centered
      destroyOnClose
      width={450}
      title={addNodeFlag ? '????????????' : '????????????'}
      onOk={onOkHandler}
      onCancel={onCancel}
      maskClosable={false}
      {...modalProps}
    >
      <NodeFormWrapper
        record={record}
        nodeTree={nodeTree || []}
        paramList={paramList || []}
        interfaceId={interfaceId}
        wrappedComponentRef={ref => { nodeForm = ref }}
      />
    </Modal>
  )
}

class NodeForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataset: [],
      valueTypes: []
    }
  }

  // ------ ??????????????? ----- //
  componentDidMount = () => {
    const { record } = this.props
    delete record.children
    let { name, required, node, parent, example, circulation, describe, type } = record
    this.props.form.setFieldsValue({
      name,
      node,
      circulation,
      required,
      type,
      example,
      describe,
      parent
    })
    // if (interfaceId) this.getDatasetParam(interfaceId)
  }

  // ------ ??????????????? ----- //

  getDatasetParam = (interfaceId) => {
    interfaceAPI.getDatasetParam(interfaceId)
      .then((response) => {
        if (response.code === 0) {
          const field = this.props.inOut
            ? 'inParamList' : 'outParamList'
          const dataset = response.data[field]
          this.setState({ dataset })
        }
      })
  }

  // ------ ??????????????? ----- //

  handleNodeTree = (nodeTree, isNodeTree, recordId) => {
    let nodeList = [...nodeTree]
    handleNodeTreeData({ nodeList, isNodeTree, recordId })
    if (isNodeTree) nodeList.unshift({ title: '??????????????????', value: -1, key: 0 })
    return nodeList
  }

  // showValueType = () => {
  //   const { form, pageType, showValueType, isOuterIntf } = this.props
  //   const cycleFlag = form.getFieldValue('cycle') === 1
  //   const paramMapType = pageType === COMPONENT_TYPE.PARAM_MAP
  //   const notNodeFlag = form.getFieldValue('paramCategory') === 0 || form.getFieldValue('paramCategory') === 2
  //   return (paramMapType || notNodeFlag || (isOuterIntf && cycleFlag)) && showValueType
  // }

  showFieldValue = () => {
    const { form } = this.props
    const valueType = form.getFieldValue('valueType')
    return this.showValueType && valueType && valueType !== 6
  }

  disabledParamCategory = () => {
    let disabled = false
    const { record, nodeTree } = this.props
    if (Object.keys(record).length === 1) {
      treeEach(nodeTree, (item) => {
        if (item.id === record.parent && item.paramCategory === 0) disabled = true
      })
    }
    return disabled
  }

  render () {
    const {
      form,
      nodeTree,
      record
    } = this.props

    const { getFieldDecorator, getFieldValue, setFieldsValue } = form

    let nodeList = this.handleNodeTree(nodeTree, true, record.id)

    return (
      <Form
        {...modalFromLayout.item}
      >
        <FormItem
          label='??????'
        >
          {getFieldDecorator('node', {
            rules: [{
              required: true,
              message: '?????????????????????'
            }]
          })(
            <Select
              placeholder={'?????????????????????'}
            >
              <Option key={'1'} value={true}>??????</Option>
              <Option key={'0'} value={false}>??????</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          label='????????????'
        >
          {getFieldDecorator('name', {
            rules: []
          })(
            <Input placeholder={'??????????????????????????????'}/>
          )}
        </FormItem>
        <FormItem
          label='?????????'
        >
          {getFieldDecorator('parent', {
            rules: [{
              required: true, message: '????????????????????????'
            }]
          })(
            <TreeSelect
              showTop
              showSearch
              treeData={nodeList}
              treeNodeFilterProp={'title'}
              placeholder={'??????????????????'}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            />
          )}
        </FormItem>
        <div className={style['node-form-row']}>
          <FormItem
            label='????????????'
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 10 }}
          >
            {getFieldDecorator('required', {
              rules: [{
                required: true,
                message: '?????????????????????'
              }]
            })(
              <Select
                defaultValue={false}
              >
                <Option key={'1'} value={true}>???</Option>
                <Option key={'0'} value={false}>???</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label='????????????'
            labelCol={{ xs: { span: 14 }, sm: { span: 14 } }}
            wrapperCol={{ xs: { span: 10 }, sm: { span: 10 } }}
          >
            {getFieldDecorator('circulation', {
              rules: [{
                required: true,
                message: '?????????????????????'
              }]
            })(
              <Select
                defaultValue={false}
              >
                <Option key={'1'} value={true}>???</Option>
                <Option key={'0'} value={false}>???</Option>
              </Select>
            )}
          </FormItem>
        </div>
        <FormItem
          label='?????????'
        >
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '??????????????????'
              }
            ]
          })(
            <Select
              allowClear
              placeholder={'??????????????????'}
            >
              {
                (valueTypes || []).map(item => <Option
                  key={item.text}
                  value={item.value}>
                  {item.value}
                </Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          label='?????????'
        >
          {getFieldDecorator('example', {
            rules: []
          })(
            <Input placeholder={'?????????????????????????????????'}/>
          )}
        </FormItem>
        <FormItem
          label='????????????'
        >
          {getFieldDecorator('describe', {
            rules: []
          })(
            <Input placeholder={'??????????????????????????????'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const NodeFormWrapper = Form.create({ name: 'NodeForm' })(NodeForm)

export default NodeFormModal
