import React, { useEffect, useRef, useState } from 'react'
import { Button, Empty, Menu, Modal } from 'antd'
import style from './style.scss'
import UseCasesApi from '../../../../../../api/usecases'
import utilities from '../../../../../../style/utilities.scss'
import StepForm from './components/StepForm'
import StepAddModal from './components/StepAddModal'

const UseCaseStep = (props) => {
  const [steps, setSteps] = useState([])
  const [index, setIndex] = useState(0)
  const [addVisible, setAddVisible] = useState(false)
  const menuContainer = useRef(null)
  const stepForm = useRef(null)
  useEffect(() => {
    fetch()
  }, [props.currentNode])
  const fetch = () => {
    if (props.currentNode) {
      UseCasesApi.getUseCaseStepList(props.currentNode)
        .then((response) => {
          const step_list = response.data.items
          setSteps(step_list || [])
          renderStepItem(step_list, index)
        })
    }
  }
  const showModalHandler = () => {
    if (props.currentNode) {
      setAddVisible(true)
    } else {
      Modal.warning({
        centered: true,
        title: '提示',
        content: '请先保存用例基础信息'
      })
    }
  }

  const onModalOkHandler = (values) => {
    const index = steps.length
    steps.push({ ...values, _changed: true })
    // stepForm && (stepForm.current.values = values)
    setIndex(index)
    setSteps(steps)
    setAddVisible(false)
    // this.setState({
    //   index,
    //   steps,
    //   addVisible: false
    // }, () => {
    //   if (this.menuWrapper && typeof this.menuWrapper.scrollTo === 'function') {
    //     this.menuWrapper.scrollTo({ top: this.menuWrapper.scrollHeight })
    //   }
    // })
  }
  const onMenuClickHandler = ({ key }) => {
    setIndex(parseInt(key))
  }
  const onMenuSelectHandler = ({ key }) => {
    const index = parseInt(key)
    stepForm && (stepForm.current.values = steps[index])
  }
  const onSaveHandler = (values) => {
    // console.log(props.currentNode)
    const formData = { ...steps[index], ...values }
    delete formData['_changed']
    if (formData.id) {
      return UseCasesApi.updateUseCaseStep(formData.id, { ...formData, use_case: props.currentNode })
        .then((response) => {
          steps[index] = { ...formData, _changed: false }
          setSteps([...steps])
          return response
        })
    } else {
      return UseCasesApi.createUseCaseStep({ ...formData, use_case: props.currentNode })
        .then((response) => {
          steps[index] = { ...formData, id: response.data.id, _changed: false }
          setSteps([...steps])
          return response
        })
    }
  }

  const onDeleteHandler = () => {
    if (steps[index].id) {
      UseCasesApi.deleteUseCaseStep([steps[index].id])
        .then(() => {
          deleteStep(index)
        })
    } else {
      deleteStep(index)
    }
  }
  const onCopyHandler = () => {
    if (steps[index].id) {
      UseCasesApi.copyCaseStep({ 'stepId': steps[index].id })
        .then(() => {
          fetch()
        })
    }
  }
  const deleteStep = (index) => {
    const currentLength = steps.length
    steps.splice(index, 1)
    const deletedIndex = index === currentLength - 1 ? index - 1 : index
    setIndex(deletedIndex)
    setSteps([...steps])
  }

  const renderStepItem = (steps, index) => {
    // console.log(steps[index])
    if (steps.length > 0 && steps[index]) {
      return <StepForm
        key={index}
        index={index}
        currentNode={props.currentNode}
        values={steps[index]}
        onSave={onSaveHandler}
        onDelete={onDeleteHandler}
        onCopy={onCopyHandler}
        ref={stepForm}
      />
    } else {
      return <Empty
        description={
          <span style={{ color: 'rgba(0,0,0,0.45)' }}>
            你尚未配置任何执行步骤，请先
            <span
              className={utilities['op-span']}
              onClick={showModalHandler}>
              配置步骤
            </span>
          </span>
        }
        image={require('../../../../../../assets/images/empty.png')}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      />
    }
  }
  return (
    <div className={style['etl-step']}>
      <div
        ref={menuContainer}
        className={style['etl-step-list']}
      >
        <Menu
          selectedKeys={[index + '']}
          onClick={onMenuClickHandler}
          onSelect={onMenuSelectHandler}
        >
          {steps.map((step, index) => (
            step ? (
              <Menu.Item key={index + ''}>
                {step.sort}. {step.name}
                <span className={style['changed']}>{step._changed ? '*' : ''}</span>
              </Menu.Item>
            ) : null
          ))}
        </Menu>
        <div className={style['etl-add-button']}>
          <Button
            onClick={showModalHandler}
          >
            新增步骤
          </Button>
        </div>
      </div>
      <div style={{ flex: 1, overflowX: 'hidden' }}>
        {renderStepItem(steps, index)}
      </div>
      <StepAddModal
        onOk={onModalOkHandler}
        onCancel={() => { setAddVisible(false) }}
        visible={addVisible}
        currentNode={props.currentNode}
      />
    </div>
  )
}

export default UseCaseStep