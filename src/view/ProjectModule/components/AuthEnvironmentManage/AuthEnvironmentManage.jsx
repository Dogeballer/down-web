import {Table, Divider, Card, Button, Popconfirm, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import authEnvironmentAPI from '../../../../api/authEnvironment'
import {StatusCreator} from '@fishballer/bui'
import AuthEnvironmentForm from './components/AuthEnvironmentForm'
import utilities from '../../../../style/utilities.scss'
import IconFont from '../../../../components/Iconfont'
import moment from 'moment'
import ProjectAPI from '../../../../api/projects'
import Filter from '../../../../components/Filter/Filter'

const TypeStatus = StatusCreator([
  {color: '#1890FF', text: '正常', value: true},
  {color: '#F5222D', text: '禁用', value: false}
])

class AuthEnvironmentList extends React.Component {
  constructor() {
    super()

    this.state = {
      data: [],
      pagination: {},
      loading: false,
      visible: true,
      authEnvironmentFormVisible: false,
      authEnvironmentFormData: {},
    }
    this.columns = [
      {
        title: '鉴权环境名称',
        dataIndex: 'name',
        sorter: true,
        render: (data, record) => (
          <React.Fragment>
            {data} <span style={{color: 'rgba(0,0,0,0.25)'}}>(ID:{record.id})</span>
          </React.Fragment>
        ),
        width: 200,
      },
      {
        title: '标识码',
        dataIndex: 'code',
        width: 150
      },
      {
        title: '超时(min)',
        dataIndex: 'timeout',
        width: 100
      },
      {
        title: '是否缓存redis',
        dataIndex: 'is_redis',
        width: 100,
        render: (value) => {
          return value.toString()
        }
      },
      {
        title: '是否函数调用',
        dataIndex: 'is_func_call',
        width: 100,
        render: (value) => {
          return value.toString()
        }
      },
      {
        title: '是否异常',
        dataIndex: 'execution_result',
        width: 100,
        render: (value) => {
          return value.toString()
        }
      },
      {
        title: '上次执行时间',
        dataIndex: 'last_time',
        width: 180,
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
            authEnvironmentAPI.updateStatusAuthEnvironment(record.id)
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
                  authEnvironmentFormVisible: true,
                  authEnvironmentFormData: {...record}
                })
              }}
            />
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                authEnvironmentAPI.deleteAuthEnvironment(record.id)
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
    authEnvironmentAPI.getAuthEnvironmentList(params).then(data => {
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
              authEnvironmentFormData: {},
              authEnvironmentFormVisible: true
            })
          }}>
          <IconFont type={'icon-addcopy'}/> 新建鉴权环境 </Button>
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
            scroll={{x: 1180}}
          />
          <AuthEnvironmentForm
            data={this.state.authEnvironmentFormData}
            visible={this.state.authEnvironmentFormVisible}
            onOk={() => {
              this.setState({authEnvironmentFormVisible: false})
              this.fetch()
            }}
            onCancel={() => {
              this.setState({authEnvironmentFormVisible: false})
            }}
          />
        </Card>
      </div>
    )
  }
}

export default AuthEnvironmentList