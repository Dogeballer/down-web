import { Table, Divider, Card, Button, Popconfirm } from 'antd'
import React from 'react'
import ProjectAPI from '../../../../api/projects'
import { StatusCreator } from '@fishballer/bui'
import ProjectForm from './components/ProjectForm'
import utilities from '../../../../style/utilities.scss'
import IconFont from '../../../../components/Iconfont'
import moment from 'moment'

const TypeStatus = StatusCreator([
  { color: '#1890FF', text: '正常', value: true },
  { color: '#F5222D', text: '禁用', value: false }
])

class ProjectsList extends React.Component {
  constructor () {
    super()
    this.columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        sorter: true,
        render: (data, record) => (
          <React.Fragment>
            {data} <span style={{ color: 'rgba(0,0,0,0.25)' }}>(ID:{record.id})</span>
          </React.Fragment>
        ),
      },
      {
        title: '项目描述',
        dataIndex: 'describe',
        width: 300
      },
      {
        title: '添加时间',
        dataIndex: 'create_time',
        width: 175,
        render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        width: 175,
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
            const status = !data,
              id = record.id
            ProjectAPI.updateProject(id, { 'name': record.name, 'status': status })
              .then(() => {this.fetch()})
          }}
        />)
      },
      {
        title: '操作',
        dataIndex: 'op',
        // fixed: 'right',
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
                  ProjectFormVisible: true,
                  ProjectFormData: { ...record }
                })
              }}
            />
            <Divider type='vertical'/>
            <Popconfirm
              title='确定要删除吗?'
              onConfirm={() => {
                ProjectAPI.deleteProject(record.id)
                  .then(() => {this.fetch()})
              }}
              okText={'删除'}
              placement='topRight'
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

  state = {
    data: [],
    pagination: {},
    loading: false,
    visible: true,
    ProjectFormVisible: false,
    ProjectFormData: {},
  }

  componentDidMount () {
    this.fetch()
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }

  fetch = (params = {}) => {
    // console.log('params:', params)
    this.setState({ loading: true })
    ProjectAPI.getProjectList().then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 20
      // console.log(data.data[0]['status'])
      this.setState({
        loading: false,
        data: data.data.items,
        pagination,
      })
    })
  }

  render () {
    const buttons = (
      <div className={utilities['table-button-group']}>
        <Button
          type={'primary'}
          onClick={() => {
            this.setState({
              ProjectFormData: {},
              ProjectFormVisible: true
            })
          }}>
          <IconFont type={'icon-addcopy'}/> 新建项目 </Button>
      </div>
    )
    return (
      <div style={{ background: '#ECECEC' }}>
        <Card bordered={false} style={{ width: '100%' }}>
          {buttons}
          <Table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.state.data}
            // pagination={this.state.pagination}
            pagination={false}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
          <ProjectForm
            data={this.state.ProjectFormData}
            visible={this.state.ProjectFormVisible}
            onOk={() => {
              this.setState({ ProjectFormVisible: false })
              this.fetch()
            }}
            onCancel={() => { this.setState({ ProjectFormVisible: false }) }}
          />
        </Card>
      </div>
    )
  }
}

export default ProjectsList