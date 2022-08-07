import React, { Component, useEffect, useState } from 'react'
import Resizer from '../../components/resizer'
import UseCasesList from './components/UseCasesList/UseCasesList'
import UesCaseTree from './components/UseCaseTree/UesCaseTree'
import UseCaseContent from './components/UseCaseContent'
import myHistory from '../../route/history'
import { isEmpty } from '../../lib/utils'

const UseCasesManage = (props) => {
  const query = myHistory.getQuery()
  const [currentNodeInfo, setCurrentNodeInfo] = useState({})
  const [type, setType] = useState('')
  const onTreeSelect = (keys) => {
    if (keys.length) {
      const type = keys[0].split('-')[1]
      const id = keys[0].split('-')[0]
      setCurrentNodeInfo({ [type]: id })
      setType(type)
    } else {
      setType('list')
    }
  }
  const useCaseDetail = id => {
    setCurrentNodeInfo({ 'useCase': id })
    setType('useCase')
  }
  const onBackClick = () => {
    setType('list')
  }
  const addCase = () => {
    setCurrentNodeInfo({})
    setType('useCase')
  }
  useEffect(
    () => {
      if (query.query.caseId) {
        setCurrentNodeInfo({ 'useCase': query.query.caseId })
        setType('useCase')
      } else {
        setType('list')
      }
    }
    , [])
  console.log(currentNodeInfo)
  return (
    <Resizer
      left={
        <UesCaseTree
          onPropsSelect={onTreeSelect}
        />
      }
      right={
        type !== 'useCase' ?
          <UseCasesList
            searchValue={currentNodeInfo}
            useCaseDetailInter={useCaseDetail}
            addCase={addCase}
          /> :
          <UseCaseContent
            currentNode={currentNodeInfo[type]}
            onBackClick={onBackClick}
          />
      }
    />
  )
}

export default UseCasesManage