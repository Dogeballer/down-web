import {Table, Divider, Card, Button, Popconfirm, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import EnvironmentAPI from '../../../../api/environment'
import {StatusCreator} from '@fishballer/bui'
import EnvironmentForm from './components/EnvironmentForm'
import utilities from '../../../../style/utilities.scss'
import IconFont from '../../../../components/Iconfont'
import moment from 'moment'
import ProjectAPI from '../../../../api/projects'
import Filter from '../../../../components/Filter/Filter'

const TypeStatus = StatusCreator([
  {color: '#1890FF', text: '正常', value: true},
  {color: '#F5222D', text: '禁用', value: false}
])

class EnvironmentList extends React.Component {
  constructor() {
    super()

    this.state = {
      data: [],
      pagination: {},
      loading: false,
      visible: true,
      EnvironmentFormVisible: false,
      EnvironmentFormData: {},
    }
    this.columns = [
      {
        title: '环境名称',
        dataIndex: 'name',
        sorter: true,
        render: (data, record) => (
          <React.Fragment>
            {data} <span style={{color: 'rgba(0,0,0,0.25)'}}>(ID:{record.id})</span>
          </React.Fragment>
        ),
        width: 300,
      },
      {
        title: '所属项目',
        dataIndex: 'project.name',
        width: 200
      },
      {
        title: 'URL',
        dataIndex: 'url',
        width: 300
      },
      {
        title: '鉴权环境',
        dataIndex: 'authentication_environment.name',
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
        title: '环境状态',
        dataIndex: 'status',
        // align: 'center',
        width: 100,
        align: 'center',
        render: (data, record) => (<TypeStatus
          value={data}
          style={{cursor: 'pointer', color: '#6b6b6b'}}
          onClick={() => {
            EnvironmentAPI.updateStatusEnvironment(record.id)
              .then(() => {
                this.fetch()
              })
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
              style={{fontSize: 24}}
              onClick={() => {
                this.setState({
                  EnvironmentFormVisible: true,
                  EnvironmentFormData: {...record}
                })
              }}
            />
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                EnvironmentAPI.deleteEnvironment(record.id)
                  .then(() => {
                    this.fetch()
                  })
              }}
              okText={'删除'}
              placement="topRight"
            >
              <IconFont
                title={'删除'}
                position={index}
                type={'icon-shanchu1'}
                style={{fontSize: 24}}
                className={utilities['opt-disabled']}
              />
            </Popconfirm>
          </div>
        )
      }
    ]
  }

  componentDidMount() {
    this.fetch()
  }

  handleTableChange = (pagination, sorter) => {
    const pager = {...this.state.pagination}
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.fetch({
      page: pagination.current,
      limit: 20,
      sortField: sorter.field,
      sortOrder: sorter.order,
    })
  }

  fetch = (params = {}) => {
    // console.log('params:', params)
    this.setState({loading: true})
    EnvironmentAPI.getEnvironmentList(params).then(data => {
      // Read total count from server
      this.setState({
        loading: false,
        data: data.data.items,
      })
    })
  }

  render() {
    const buttons = (
      <div className={utilities['table-button-group']}>
        <Button
          type={'primary'}
          onClick={() => {
            this.setState({
              EnvironmentFormData: {},
              EnvironmentFormVisible: true
            })
          }}>
          <IconFont type={'icon-addcopy'}/> 新建环境 </Button>
      </div>
    )
    return (
      <div style={{background: '#ECECEC'}}>
        <Card bordered={false} style={{width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            {buttons}
          </div>
          <Table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.state.data}
            // pagination={this.state.pagination}
            pagination={false}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            scroll={{x: 1600}}
          />
          <EnvironmentForm
            data={this.state.EnvironmentFormData}
            visible={this.state.EnvironmentFormVisible}
            onOk={() => {
              this.setState({EnvironmentFormVisible: false})
              this.fetch()
            }}
            onCancel={() => {
              this.setState({EnvironmentFormVisible: false})
            }}
          />
        </Card>
      </div>
    )
  }
}

export default EnvironmentList