import React, {useState, useEffect, Fragment, useRef} from 'react'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import * as api from "../../../api/riskWarning"
import DetailModal from "./modal/DetailModal";
import {Pagination} from "antd";
import thousandComma from "@cecdataFE/bui/dist/lib/thousandComma";

export default function (props) {
    const [loading, setLoading] = useState(true)
    const [dataSource, setDataSource] = useState()
    const [total, setTotal] = useState(0)
    const queryRef = useRef({ page: 1, limit: 20, isProvideService: 0 })
    const q = queryRef.current

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setLoading(true)
        api.getRiskWarning(queryRef.current).then(res => {
            setDataSource(res.data.items)
            setTotal(res.data.total)
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleSizeChange = (page, pageSize) => {
        queryRef.current.page = 1
        queryRef.current.limit = pageSize
        fetchData()
    }

    const handlePageChange = (page, pageSize) => {
        queryRef.current.page = page
        fetchData()
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '1',
        },
        {
            title: '用户',
            dataIndex: '1',
        },
        {
            title: '操作类型',
            dataIndex: '1',
        },
        {
            title: '事件信息',
            dataIndex: '1',
        },
        {
            title: '操作IP',
            dataIndex: '1',
        },
        {
            title: '操作应用',
            dataIndex: '1',
        },
        {
            title: '应用IP',
            dataIndex: '1',
        },
        {
            title: '资产ip',
            dataIndex: '1',
        },
        {
            title: '资产名称',
            dataIndex: '1',
        },
        {
            title: '资产类型',
            dataIndex: '1',
        },
        {
            title: '资产等级',
            dataIndex: '1',
        },
        {
            title: '控制方式',
            dataIndex: '1',
        },
        {
            title: '协议类型',
            dataIndex: '1',
        },
        {
            title: '操作时间',
            dataIndex: '1',
        },
        {
            title: '原始日志',
            dataIndex: 'op',
            align: 'center',
            fixed: 'right',
            render: (v, r) => <DetailModal><a>详情</a></DetailModal>
        }
    ]

    return (
       <Fragment>
           <Table
               sticky
               scroll={{ x: 2046 }}
               bordered
               rowKey='id'
               loading={loading}
               columns={columns}
               dataSource={dataSource}
               pagination={false}
           />
           <div style={{marginTop: 12, textAlign: 'right'}}>
               <Pagination
                   showSizeChanger
                   total={total}
                   showTotal={total => `总共 ${thousandComma(total)} 条数据`}
                   pageSizeOptions={['20', '30', '50', '100']}
                   current={q.page}
                   pageSize={q.limit}
                   onChange={handlePageChange}
                   onShowSizeChange={handleSizeChange}
               />
           </div>
       </Fragment>
    )
}