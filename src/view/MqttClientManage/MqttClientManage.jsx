import {Table, Divider, Card, Button, Popconfirm, Select, Modal} from 'antd'
import React, {useEffect, useState} from 'react'
import ModuleAPI from '../../api/modules'
import mqttApi from '../../api/mqtt'
import {StatusCreator} from '@fishballer/bui'
import utilities from '../../style/utilities.scss'
import IconFont from '../../components/Iconfont'
import moment from 'moment'
import Filter from '../../components/Filter/Filter'
import MqttForm from './components/MqttForm'

const TypeStatus = StatusCreator([
  {color: '#1890FF', text: '正常', value: true},
  {color: '#F5222D', text: '禁用', value: false}
])

const FILTER_STATUS = [
  {value: true, text: '正常', color: '#1890FF'},
  {value: false, text: '禁用', color: '#F5222D'}
]

class MqttClentList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pagination: {},
      loading: false,
      visible: true,
      MqttVisible: false,
      MqttData: {},
      filters: []
    }
  }

  onTestHandler = (values) => {
    mqttApi.mqttClientTest(values)
      .then(() => {
        Modal.success({
          content: '连接成功！',
        })
      })
  }

  createFilter = () => {
    this.setState({
        filters: [
          {
            type: 'input',
            name: 'name',
            config: {
              initialValue: ''
            },
            attr: {
              placeholder: '连接名称',
              allowClear: true
            }
          },
          {
            type: 'input',
            name: 'broker',
            style: {
              width: 100
            },
            config: {
              initialValue: ''
            },
            attr: {
              placeholder: 'broker',
              allowClear: true
            }
          },
          {
            type: 'select',
            name: 'status',
            attr: {
              placeholder: '状态',
              allowClear: true,
              style: {
                width: 100
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
        title: '连接名称',
        dataIndex: 'name',
        sorter: true,
        render: (data, record) => (
          <React.Fragment>
            {data} <span style={{color: 'rgba(0,0,0,0.25)'}}>(ID:{record.id})</span>
          </React.Fragment>
        ),
        width: 250,
      },
      {
        title: 'broker',
        dataIndex: 'broker',
        width: 150
      },
      {
        title: 'port',
        dataIndex: 'port',
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
        title: '状态',
        dataIndex: 'status',
        // align: 'center',
        width: 100,
        align: 'center',
        render: (data, record) => (<TypeStatus
          value={data}
          style={{cursor: 'pointer', color: '#6b6b6b'}}
          onClick={() => {
            const {id, status, project, ...restData} = record
            mqttApi.updateStatusMqttClient(id)
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
        width: 150,
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
                  MqttVisible: true,
                  MqttData: {...record}
                })
              }}
            />
            <Divider type="vertical"/>
            <IconFont
              title={'测试连接'}
              position={index}
              type={'icon-guanlishujuyuan'}
              style={{fontSize: 24}}
              className={utilities['opt-disabled']}
              onClick={() => this.onTestHandler({...record})}
            />
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                mqttApi.deleteMqttClient(record.id)
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
    this.createFilter()
  }

  handleSearch = value => {
    console.log()
    this.fetch({
      ...value
    })
  }

  fetch = (params = {}) => {
    // console.log('params:', params)
    this.setState({loading: true})
    mqttApi.getMqttClientList(params).then(data => {
      this.setState({
        loading: false,
        data: data.data.items,
      })
    })
  }

  render() {
    const buttons = (
      <Button
        type={'primary'}
        onClick={() => {
          this.setState({
            MqttData: {},
            MqttVisible: true
          })
        }}>
        <IconFont type={'icon-addcopy'}/> 新建连接 </Button>
    )
    return (
      <div style={{background: '#ECECEC'}}>
        <Card title="Mqtt列表" bordered={false} style={{width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
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
            pagination={false}
            // pagination={false}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            scroll={{x: 1110}}
          />
          <MqttForm
            data={this.state.MqttData}
            visible={this.state.MqttVisible}
            onOk={() => {
              this.setState({MqttVisible: false})
              this.fetch()
            }}
            onCancel={() => {
              this.setState({MqttVisible: false})
            }}
          />
        </Card>
      </div>
    )
  }
}

export default MqttClentList