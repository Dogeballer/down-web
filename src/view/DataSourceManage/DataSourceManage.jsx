import { Table, Divider, Card, Button, Popconfirm, Select, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import ModuleAPI from '../../api/modules'
import DataSourceApi from '../../api/datasourse'
import { StatusCreator } from '@fishballer/bui'
import ModuleForm from './components/DataSourceForm'
import utilities from '../../style/utilities.scss'
import IconFont from '../../components/Iconfont'
import moment from 'moment'
import ProjectAPI from '../../api/projects'
import Filter from '../../components/Filter/Filter'
import DataSourceForm from './components/DataSourceForm'
import DataSourceAPI from '../../api/datasourse'

const TypeStatus = StatusCreator([
  { color: '#1890FF', text: '正常', value: true },
  { color: '#F5222D', text: '禁用', value: false }
])

const FILTER_STATUS = [
  { value: true, text: '正常', color: '#1890FF' },
  { value: false, text: '禁用', color: '#F5222D' }
]
const dataSourceTypeChoice = [
  { name: 'PG', value: 0 },
  { name: 'SqlSever', value: 1 },
  { name: 'Oracle', value: 2 },
  { name: 'Mysql', value: 3 },
]

class DataSourceList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      pagination: {},
      loading: false,
      visible: true,
      DataSourceVisible: false,
      DataSourceData: {},
      filters: []
    }
  }

  onTestHandler = (values) => {
    DataSourceAPI.dataSourceTest(values)
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
              placeholder: '元数据名称',
              allowClear: true
            }
          },
          {
            type: 'select',
            name: 'database_type',
            attr: {
              placeholder: '选择类型',
              allowClear: true,
              style: {
                width: 150
              },
              option: dataSourceTypeChoice.map(item => {
                return ({
                  value: item.value,
                  key: item.value,
                  text: item.name
                })
              })
            }
          },
          {
            type: 'input',
            name: 'database',
            style: {
              width: 150
            },
            config: {
              initialValue: ''
            },
            attr: {
              placeholder: 'database',
              allowClear: true
            }
          },
          {
            type: 'input',
            name: 'host',
            style: {
              width: 100
            },
            config: {
              initialValue: ''
            },
            attr: {
              placeholder: 'host',
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
        title: '元数据名称',
        dataIndex: 'name',
        sorter: true,
        render: (data, record) => (
          <React.Fragment>
            {data} <span style={{ color: 'rgba(0,0,0,0.25)' }}>(ID:{record.id})</span>
          </React.Fragment>
        ),
        width: 300,
      },
      {
        title: '元数据类型',
        dataIndex: 'database_type',
        width: 150,
        render: (value) => {
          let name = ''
          dataSourceTypeChoice.forEach((item) => {
            if (item.value === value) {
              name = item.name
            }
          })
          return name
        }
      },
      {
        title: 'host',
        dataIndex: 'host',
        width: 150
      },
      {
        title: 'port',
        dataIndex: 'port',
        width: 100
      }, {
        title: 'database',
        dataIndex: 'database',
        width: 150
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
          style={{ cursor: 'pointer', color: '#6b6b6b' }}
          onClick={() => {
            const { id, status, project, ...restData } = record
            DataSourceApi.updateStatusDataSource(id)
              .then(() => {this.fetch()})
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
              style={{ fontSize: 24 }}
              onClick={() => {
                this.setState({
                  DataSourceFormVisible: true,
                  DataSourceData: { ...record }
                })
              }}
            />
            <Divider type="vertical"/>
            <IconFont
              title={'测试连接'}
              position={index}
              type={'icon-guanlishujuyuan'}
              style={{ fontSize: 24 }}
              className={utilities['opt-disabled']}
              onClick={() => this.onTestHandler({ ...record })}
            />
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                DataSourceApi.deleteDataSource(record.id)
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
    this.setState({ loading: true })
    DataSourceApi.getDataSourceList(params).then(data => {
      this.setState({
        loading: false,
        data: data.data.items,
      })
    })
  }

  render () {
    const buttons = (
      <Button
        type={'primary'}
        onClick={() => {
          this.setState({
            DataSourceData: {},
            DataSourceFormVisible: true
          })
        }}>
        <IconFont type={'icon-addcopy'}/> 新建元数据 </Button>
    )
    return (
      <div style={{ background: '#ECECEC' }}>
        <Card title="元数据列表" bordered={false} style={{ width: '100%' }}>
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
            pagination={false}
            // pagination={false}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            scroll={{ x: 1450 }}
          />
          <DataSourceForm
            data={this.state.DataSourceData}
            visible={this.state.DataSourceFormVisible}
            onOk={() => {
              this.setState({ DataSourceFormVisible: false })
              this.fetch()
            }}
            onCancel={() => { this.setState({ DataSourceFormVisible: false }) }}
          />
        </Card>
      </div>
    )
  }
}

export default DataSourceList