import React, { Component } from 'react'
import style from './style.scss'
import {
  Upload, Icon, Alert
} from 'antd'

const { Dragger } = Upload
class Uploader extends Component {
  onSuccess = (res, file) => {
    this.props.handleResponse(res)
  }

  // onError = (err, response) => {
  //   console.log(err, response)
  // }

  beforeUpload = (file, fileList) => {
    // validate fileformat and size
    // const isLt8M = (file.size / 1024 / 1024) < 8
    // if (!isLt8M) {
    //   message.error('文件不超过8M!')
    // }
    // if (exist.length === 0 || !isLt8M) {
    //   file.status = 'error'
    // }
    // return (exist.length !== 0) && isLt8M
  }

  render () {
    const {
      params,
      uploadURL,
      ...otherProps
    } = this.props

    return (
      <div className={style['uploader-modal']}>
        <div>
          <Alert message='导入后将清空界面现有的编辑内容!' type='info' showIcon />
        </div>
        <div className={style['uploader-wrapper']}>
          <Dragger
            name={'file'}
            data={params}
            multiple={false}
            accept={'.xlsx, .xls'}
            action={uploadURL}
            // onError={this.onError}
            onSuccess={this.onSuccess}
            {...otherProps}
          >
            <p className={style['uploader-drag-icon']}>
              <Icon type='inbox' />
            </p>
            <p className={style['uploader-text']}>点击或将文件拖拽到这里上传</p>
            <p className={style['uploader-hint']}>支持文件拓展名.xlsx .xls</p>
          </Dragger>
        </div>
      </div>
    )
  }
}

export default Uploader
