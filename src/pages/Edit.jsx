import React, { useEffect, useState } from 'react'
import { PageHeader, Button, Modal, Form, Input, message } from 'antd';
import moment from 'moment'
import E from 'wangeditor'
import { ArticleAddApi, ArticleSearchApi, ArticleUpdateApi } from '../request/api'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

let editor = null

export default function Edit() {
  const [content, setContent] = useState('')
  const location = useLocation()
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const params = useParams()

  // Processing of requested data
  const dealData = (errCode, msg) => {
    setIsModalVisible(false); // Close dialog box
    if (errCode === 0) {
      message.success(msg)
      setTimeout(() => {
        // Jump back to the list page
        navigate('/listlist')
      }, 1500)
    } else {
      message.error(msg)
    }
  }

  // Dialog box submit when clicked
  const handleOk = () => {
    form
      .validateFields()    // validate   field 
      .then((values) => {
        // form.resetFields();   // reset
        let { title, subTitle } = values;
        // id in the address bar mean that you want to update an article now
        if (params.id) {
          // Requests for article updates
          ArticleUpdateApi({ title, subTitle, content, id: params.id }).then(res => dealData(res.errCode, res.message))
        } else {
          // Request to add an article
          ArticleAddApi({ title, subTitle, content }).then(res => dealData(res.errCode, res.message))
        }
      })
      .catch(() => false);
  };

  // imitate componentDidMount
  useEffect(() => {
    editor = new E('#div1')
    editor.config.onchange = (newHtml) => {
      setContent(newHtml)
    }
    editor.create()

    // 根据地址栏id做请求 make a request accoring to address bar
    if (params.id) {
      ArticleSearchApi({ id: params.id }).then(res => {
        if (res.errCode === 0) {
          editor.txt.html(res.data.content) // re-set Editorial content
          setTitle(res.data.title)
          setSubTitle(res.data.subTitle)
        }
      })
    }

    return () => {
      // Destroy the editor when the component is destroyed
      // NOTE：The class  needs to be called in componentWillUnmount
      editor.destroy()
    }
  }, [location.pathname])

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={params.id ? () => window.history.back() : null}
        title="Article Editor"
        subTitle={"Current date:" + moment(new Date()).format("YYYY-MM-DD")}
        extra={<Button key="1" type="primary" onClick={() => setIsModalVisible(true)}>Submit article</Button>}
      ></PageHeader>
      <div id="div1" style={{ padding: '0 20px 20px', background: '#fff' }}></div>
      <Modal zIndex={99999} title="Fill in the article title" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} okText="submit" cancelText="cancel">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          autoComplete="off"
          initialValues={{ title, subTitle }}
        >
          <Form.Item
            label="title"
            name="title"
            rules={[{ required: true, message: 'Please fill in the title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="subTitle"
            name="subTitle"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
