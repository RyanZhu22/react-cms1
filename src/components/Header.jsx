import React, { useEffect, useState } from 'react'
import logoImg from '../assets/logoLayout.png'
import { Menu, Dropdown, message } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import defaultAvatar from '../assets/defaultAvatar.jpg'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux';

function Header(props) {
    const navigate = useNavigate()
    const [avatar, setAvatar] = useState(defaultAvatar)
    const [username, setUsername] = useState("Visitor")

    // Imitate componentDidMount
    useEffect(() => {
        let username1 = localStorage.getItem('username')
        let avatar1 = localStorage.getItem('avatar')
        if (username1) {
            setUsername(username1)
        }
        if (avatar1) {
            setAvatar('http://47.93.114.103:6688/' + avatar1)
        }
    }, [props.mykey])

    // Logout
    const logout = () => {
        message.success('Exit successful, about to return to the login page')
        localStorage.clear();   // clear data in localStorage
        setTimeout(() => navigate('/login'), 1500)
    }

    const menu = (
        <Menu>
            <Menu.Item key={1}>Modify information</Menu.Item>
            <Menu.Divider />
            <Menu.Item key={2} onClick={logout}>Logout</Menu.Item>
        </Menu>
    );

    return (
        <header>
            <img src={logoImg} alt="" />
            <div className="right">
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <img src={avatar} className="avatar" alt="" />
                        <span>{username}</span>
                        <CaretDownOutlined />
                    </a>
                </Dropdown>
            </div>
        </header>
    )
}

const mapStateToProps = (state) => {
    return {
        mykey: state.mykey
    }
}

export default connect(mapStateToProps)(Header)