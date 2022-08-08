import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message, Upload } from 'antd';
import {GetUserDataApi, ChangeUserDataApi} from '../request/api'
import "./less/Means.less"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'

// Convert the image path to base64
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// Limit image size to 200KB
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 / 1024  < 200;
  if (!isLt2M) {
    message.error('Please upload an image of less than 200KB!');
  }
  return isJpgOrPng && isLt2M;
}

function Means(props){
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  useEffect(()=>{
    GetUserDataApi().then(res=>{
      console.log(res)
      if(res.errCode===0){
        message.success(res.message)
        // Save to sessionStorage
        sessionStorage.setItem('username', res.data.username)
      }
    })
  }, [])

  // Form submission events
  const onFinish = (values) => {
    // If username have the value in Form and not equal to the username at initialization, Meanwhile, password is not empty
    if(values.username && values.username!==sessionStorage.getItem('username') && values.password.trim() !== ""){
      // Form submission
      ChangeUserDataApi({
        username: values.username,
        password: values.password
      }).then(res=>{
        console.log(res)
        // When you motify successfully, do not foget re-login
      })
    }
  }

  // Upload images when clicked
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>{
        setLoading(false)
        setImageUrl(imageUrl)
        // save the name of images
        localStorage.setItem('avatar', info.file.response.data.filePath)
        // use react-redux
        props.addKey()
      }
      );
    }
  };

  // upload Button
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className='means'>
      <Form
        name="basic"
        style={{width: '400px'}}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="Change username:" name="username">
          <Input placeholder='Please input new username' />
        </Form.Item>

        <Form.Item label="Change password:" name="password">
          <Input.Password placeholder='Please input new password' />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{float: 'right'}}>Submit</Button>
        </Form.Item>
      </Form>
      <p>Click below to change your avatar: </p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={{"cms-token": localStorage.getItem('cms-token')}}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    addKey(){
      dispatch({type: "addKeyFn"})
    }
  }
}

export default connect(null, mapDispatchToProps)(Means)