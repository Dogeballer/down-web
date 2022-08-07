import { Select, message } from 'antd'
import React, { Component } from 'react'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

const Option = Select.Option

class AjaxSelect extends Component {
  state = {
    options: [],
    loading: false
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (!isEmpty(nextProps.disabled)) {
      this.disabled = nextProps.disabled
    }
    if (!isEmpty(nextProps.value) && !this.loaded) {
      this.fetch(true)
    } else {
      if (nextProps.updateData && (nextProps.updateData !== this.props.updateData)) {
        this.fetch(true)
      }
    }
  }

  componentDidMount () {
    const {autoFetch, disabled} = this.props
    this.disabled = !!disabled
    if (autoFetch || typeof autoFetch === 'undefined') {
      this.fetch(true)
    }
  }

  visibleChangeHandler = (open) => {
    if (open && !this.loaded) {
      this.fetch()
    }
  }
  disabled = false
  loaded = false
  /**
   * 加载数据
   * @param isSilent - 是否提示报错信息
   */
  fetch (isSilent = false) {
    if (this.disabled) {
      return
    }
    this.setState({ loading: true })
    this.props.fetch()
      .then((response) => {
        const options = this.props.optionsGet(response)
        this.setState({ options })
        // const { setDataList } = this.props
        // typeof setDataList === 'function' && setDataList(response.data.list)
      })
      .catch((msg) => {
        if (!isSilent) {
          message.error(msg)
        }
      })
      .finally(() => {
        this.loaded = true
        this.setState({ loading: false })
      })
  }

  render () {
    const {
      autoFetch,
      fetch,
      optionsGet,
      searchable,
      autoDisabled,
      disabledKey,
      ...props
    } = this.props

    const searchProps = searchable ? {
      showSearch: true,
      filterOption: (input, option) => {
        let { children, label } = option.props
        if (Array.isArray(children) && typeof label === 'string') {
          return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        } else if (typeof children === 'string') {
          return children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        return false
      }
    } : {}

    return (
      <Select
        allowClear
        placeholder={'请选择'}
        loading={this.state.loading}
        onDropdownVisibleChange={this.visibleChangeHandler}
        dropdownMatchSelectWidth={false}
        {...searchProps}
        disabled={autoDisabled}
        {...props}
      >
        {this.state.options.map((option) => (
          <Option
            key={option.value}
            value={option.value}
            title={option.title}
            disabled={disabledKey && option.value === disabledKey}
          >
            {option.title}
          </Option>
        ))}
      </Select>
    )
  }
}

export default AjaxSelect
