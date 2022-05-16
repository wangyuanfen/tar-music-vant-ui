import { Component } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
// @ts-ignore
import api from '@/services/api'
import './index.less'

type PageState = {}

class Page extends Component<{}, PageState> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillUnmount() {}

  componentDidShow() {
    this.getUserDetail()
  }

  componentDidHide() {}

  getUserDetail() {
    const { id } = getCurrentInstance()?.router?.params || {}
    api
      .get('/user/detail', {
        uid: id,
      })
      .then((res) => {
        // console.log('user/detail==>', res)
      })
  }

  render() {
    return <View className='user_container'></View>
  }
}

export default Page
