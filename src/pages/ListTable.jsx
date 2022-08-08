import React, { useState, useEffect } from 'react'
import './less/ListTable.less'
import { Table, Button, Space, message } from 'antd';
import moment from 'moment'
import { ArticleListApi, ArticleDelApi } from '../request/api'
import { useNavigate } from 'react-router-dom'

// Header component
function MyTitle(props) {
    return (
        <div>
            <a className='table_title' href={"http://codesohigh.com:8765/article/" + props.id} target="_blank">{props.title}</a>
            <p style={{ color: '#999' }}>{props.subTitle}</p>
        </div>
    )
}

export default function ListTable() {
    // List Array
    const [arr, setArr] = useState([])
    const navigate = useNavigate()
    // Page Break
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

    // Extraction of the requested code
    const getArticleList = (current, pageSize) => {
        ArticleListApi({
            num: current,
            count: pageSize
        }).then(res => {
            if (res.errCode === 0) {
                // Change pagination
                let { num, count, total } = res.data;
                setPagination({ current: num, pageSize: count, total })
                // Deep copy of the acquired array
                let newArr = JSON.parse(JSON.stringify(res.data.arr));
                // Claim an empty array
                let myarr = []
                /* 
                    1. Add key to each arry item, make key=id
                    2. need to require a set of label structures, assigning an attribute
                */
                newArr.map(item => {
                    let obj = {
                        key: item.id,
                        date: moment(item.date).format("YYYY-MM-DD hh:mm:ss"),
                        mytitle: <MyTitle id={item.id} title={item.title} subTitle={item.subTitle} />
                    }
                    myarr.push(obj)
                })
                setArr(myarr)
            }
        })
    }

    // request a list of articles (mounted)
    useEffect(() => {
        getArticleList(pagination.current, pagination.pageSize);
    }, [])

    // Functions for pagination
    const pageChange = (arg) => getArticleList(arg.current, arg.pageSize);

    // Delete
    const delFn = (id) => {
        ArticleDelApi({ id }).then(res => {
            if (res.errCode === 0) {
                message.success(res.message)
                // Reflash page, or re-request the data for this list   window.reload   Call getList(1)  Add test for variable
                getArticleList(1, pagination.pageSize);
            } else {
                message.success(res.message)
            }
        })
    }

    // Each column
    const columns = [
        {
            dataIndex: 'mytitle',
            key: 'mytitle',
            width: '60%',
            render: text => <div>{text}</div>
        },
        {
            dataIndex: 'date',
            key: 'date',
            render: text => <p>{text}</p>,
        },
        {
            key: 'action',
            render: text => {
                return (
                    <Space size="middle">
                        {/* text.key is id */}
                        <Button type='primary' onClick={() => navigate('/edit/' + text.key)}>Edit</Button>
                        <Button type='danger' onClick={()=>delFn(text.key)}>Delete</Button>
                    </Space>
                )
            },
        },
    ];

    return (
        <div className='list_table'>
            <Table
                showHeader={false}
                columns={columns}
                dataSource={arr}
                onChange={pageChange}
                pagination={pagination}
            />
        </div>
    )
}







