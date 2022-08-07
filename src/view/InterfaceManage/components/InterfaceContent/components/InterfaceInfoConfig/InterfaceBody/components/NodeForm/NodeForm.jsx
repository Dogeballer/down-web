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
      title={addNodeFlag ? '新增节点' : '编辑节点'}
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

  // ------ 生命周期区 ----- //
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

  // ------ 数据交互区 ----- //

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

  // ------ 公共方法区 ----- //

  handleNodeTree = (nodeTree, isNodeTree, recordId) => {
    let nodeList = [...nodeTree]
    handleNodeTreeData({ nodeList, isNodeTree, recordId })
    if (isNodeTree) nodeList.unshift({ title: '作为一级节点', value: -1, key: 0 })
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
          label='类型'
        >
          {getFieldDecorator('node', {
            rules: [{
              required: true,
              message: '请选择节点类型'
            }]
          })(
            <Select
              placeholder={'请选择节点类型'}
            >
              <Option key={'1'} value={true}>节点</Option>
              <Option key={'0'} value={false}>字段</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          label='节点名称'
        >
          {getFieldDecorator('name', {
            rules: []
          })(
            <Input placeholder={'请输入字段或节点名称'}/>
          )}
        </FormItem>
        <FormItem
          label='父节点'
        >
          {getFieldDecorator('parent', {
            rules: [{
              required: true, message: '请选择所属父节点'
            }]
          })(
            <TreeSelect
              showTop
              showSearch
              treeData={nodeList}
              treeNodeFilterProp={'title'}
              placeholder={'请选择父节点'}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            />
          )}
        </FormItem>
        <div className={style['node-form-row']}>
          <FormItem
            label='是否必填'
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 10 }}
          >
            {getFieldDecorator('required', {
              rules: [{
                required: true,
                message: '请选择是否必填'
              }]
            })(
              <Select
                defaultValue={false}
              >
                <Option key={'1'} value={true}>是</Option>
                <Option key={'0'} value={false}>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label='是否循环'
            labelCol={{ xs: { span: 14 }, sm: { span: 14 } }}
            wrapperCol={{ xs: { span: 10 }, sm: { span: 10 } }}
          >
            {getFieldDecorator('circulation', {
              rules: [{
                required: true,
                message: '请选择是否循环'
              }]
            })(
              <Select
                defaultValue={false}
              >
                <Option key={'1'} value={true}>是</Option>
                <Option key={'0'} value={false}>否</Option>
              </Select>
            )}
          </FormItem>
        </div>
        <FormItem
          label='值类型'
        >
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择值类型'
              }
            ]
          })(
            <Select
              allowClear
              placeholder={'请选择值类型'}
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
          label='示例值'
        >
          {getFieldDecorator('example', {
            rules: []
          })(
            <Input placeholder={'请输入字段或节点示例值'}/>
          )}
        </FormItem>
        <FormItem
          label='节点描述'
        >
          {getFieldDecorator('describe', {
            rules: []
          })(
            <Input placeholder={'请输入字段或节点名称'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const NodeFormWrapper = Form.create({ name: 'NodeForm' })(NodeForm)

export default NodeFormModal
