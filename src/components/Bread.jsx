import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom'

export default function Bread() {
    const { pathname } = useLocation()
    const [breadName, setBreadName] = useState('')

    // Not to get path when mouted component 
    // 而是路径一旦变化，就要获取对应的路径名称，并且修改breadName
    // Listening route paths(/list /edit /means)
    useEffect(() => {
        switch (pathname) {
            case "/listlist":
                setBreadName('View the list of articles');
                break;
            case "/listtable":
                setBreadName('View the table of articles');
                break;
            case "/edit":
                setBreadName('Edit article');
                break;
            case "/means":
                setBreadName('Modify information');
                break;
            default:
                setBreadName(pathname.includes('edit') ? 'Edit article' : "");
                break;
        }
    }, [pathname])

    return (
        <Breadcrumb style={{height: '30px', lineHeight: '30px'}}>
            <Breadcrumb.Item href='/'>
                <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>{breadName}</Breadcrumb.Item>
        </Breadcrumb>
    )
}

