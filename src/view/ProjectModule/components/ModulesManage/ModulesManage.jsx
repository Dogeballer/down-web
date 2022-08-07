import { Table, Divider, Card, Button, Popconfirm, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import ModuleAPI from '../../../../api/modules'
import { StatusCreator } from '@fishballer/bui'
import ModuleForm from './components/ModulesForm'
import utilities from '../../../../style/utilities.scss'
import IconFont from '../../../../components/Iconfont'
import moment from 'moment'
import ProjectAPI from '../../../../api/projects'
import Filter from '../../../../components/Filter/Filter'

const TypeStatus = StatusCreator([
  { color: '#1890FF', text: '正常', value: true },
  { color: '#F5222D', text: '禁用', value: false }
])

const FILTER_STATUS = [
  { value: true, text: '正常', color: '#1890FF' },
  { value: false, text: '禁用', color: '#F5222D' }
]

class ModulesList extends React.Component {
  constructor () {
    super()

    this.state = {
      data: [],
      pagination: {
        pageSize: 20
      },
      loading: false,
      visible: true,
      ModuleFormVisible: false,
      ModuleFormData: {},
      filters: []
    }
  }

  createFilter = (projectList) => {
    this.setState({
        filters: [
          {
            type: 'input',
            name: 'name',

            config: {
              initialValue: ''
            },
            attr: {
              placeholder: '模块名称',
              allowClear: true
            }
          },
          {
            type: 'select',
            name: 'project',
            attr: {
              placeholder: '选择项目',
              allowClear: true,
              style: {
                width: 200
              },
              option: projectList.map(item => {
                return ({
                  value: item.value,
                  key: item.value,
                  text: item.text
                })
              })
            }
          },
          {
            type: 'select',
            name: 'status',
            attr: {
              placeholder: '状态',
              allowClear: true,
              style: {
                width: 200
              },
              option: FILTER_STATUS.map(item => {
                return ({
                  value: item.value,
                  key: item.value,
                  text: item.text
                })
              })
            }
          }
        ]
      }
    )
    this.columns = [
      {
        title: '模块名称',
        dataIndex: 'name',
        sorter: true,
        render: (data, record) => (
          <React.Fragment>
            {data} <span style={{ color: 'rgba(0,0,0,0.25)' }}>(ID:{record.id})</span>
          </React.Fragment>
        ),
        width: 200,
      },
      {
        title: '所属项目',
        dataIndex: 'project.name',
        width: 200
      }, {
        title: '开发人员',
        dataIndex: 'developer',
        width: 100
      }, {
        title: '测试人员',
        dataIndex: 'tester',
        width: 100
      },
      {
        title: '添加时间',
        dataIndex: 'create_time',
        width: 180,
        render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        width: 180,
        render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
      {
        title: '项目状态',
        dataIndex: 'status',
        // align: 'center',
        width: 100,
        align: 'center',
        render: (data, record) => (<TypeStatus
          value={data}
          style={{ cursor: 'pointer', color: '#6b6b6b' }}
          onClick={() => {
            const { id, status, project, ...restData } = record
            ModuleAPI.updateModule(id, { 'status': !status, 'project': project.id, ...restData })
              .then(() => {this.fetch()})
          }}
        />)
      },
      {
        title: '操作',
        dataIndex: 'op',
        fixed: 'right',
        width: 100,
        align: 'center',
        render: (data, record, index) => (
          <div className={utilities['opt-dispaly-center']}>
            <IconFont
              title={'编辑'}
              position={index}
              type={'icon-bianji'}
              className={utilities['opt-disabled']}
              style={{ fontSize: 24 }}
              onClick={() => {
                this.setState({
                  ModuleFormVisible: true,
                  ModuleFormData: { ...record }
                })
              }}
            />
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                ModuleAPI.deleteModule(record.id)
                  .then(() => {this.fetch()})
              }}
              okText={'删除'}
              placement="topRight"
            >
              <IconFont
                title={'删除'}
                position={index}
                type={'icon-shanchu1'}
                style={{ fontSize: 24 }}
                className={utilities['opt-disabled']}
              />
            </Popconfirm>
          </div>
        )
      }
    ]
  }

  componentDidMount () {
    this.fetch({
      page: 1,
      limit: 20
    })
    ProjectAPI.getProjectList()
      .then(data => {
        const projectList = (data.data.items || []).map(({ id, name }) => {
          return {
            'value': id,
            'text': name
          }
        })
        this.createFilter(projectList)
      })
  }

  handleSearch = value => {
    console.log()
    this.fetch({
      page: 1,
      limit: 20
      , ...value
    })
  }

  handleTableChange = (pagination, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    const filters = this.filter.getFieldsValue()
    this.fetch({
      page: pagination.current,
      limit: 20,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }

  fetch = (params = {}) => {
    // console.log('params:', params)
    this.setState({ loading: true })
    ModuleAPI.getModuleList(params).then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      pagination.total = data.total
      this.setState({
        loading: false,
        data: data.data.items,
        pagination,
      })
    })
  }

  render () {
    const buttons = (
      <Button
        type={'primary'}
        onClick={() => {
          this.setState({
            ModuleFormData: {},
            ModuleFormVisible: true
          })
        }}>
        <IconFont type={'icon-addcopy'}/> 新建模块 </Button>
    )
    return (
      <div style={{ background: '#ECECEC' }}>
        <Card bordered={false} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Filter
              fields={this.state.filters}
              onSubmit={this.handleSearch}
            />
            {buttons}
          </div>
          <Table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            // pagination={false}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            scroll={{ x: 1200 }}
          />
          <ModuleForm
            data={this.state.ModuleFormData}
            visible={this.state.ModuleFormVisible}
            onOk={() => {
              this.setState({ ModuleFormVisible: false })
              this.fetch()
            }}
            onCancel={() => { this.setState({ ModuleFormVisible: false }) }}
          />
        </Card>
      </div>
    )
  }
}

export default ModulesList