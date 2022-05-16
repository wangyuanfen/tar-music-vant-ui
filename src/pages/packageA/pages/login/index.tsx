import Taro from '@tarojs/taro'
import { FC, useState } from 'react'
import { View, Input } from '@tarojs/components'
import { Icon, Button } from '@antmjs/vantui'
import CTitle from '../../../../components/CTitle'
import api from '../../../../services/api'
import './index.less'

type InputType = 'phone' | 'password'

const Page: FC = () => {
  function loginStatus(res) {
    const { code } = res.data
    let tipText = '登录成功'
    if (code !== 200) {
      tipText = res.data.msg || '登录失败'
    }
    Taro.hideLoading()
    Taro.showToast({
      title: tipText,
      icon: 'none',
      duration: 2000,
    })
    if (code === 200) {
      Taro.setStorageSync('userInfo', res.data)
      Taro.setStorageSync('userId', res.data.account.id)
      Taro.navigateTo({
        url: '/pages/index/index',
      })
    }
  }

  function login() {
    if (!phone) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    if (!password) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    Taro.showLoading({
      title: '登录中',
    })
    api
      .get('/login/cellphone', {
        phone,
        password,
      })
      .then((res) => {
        loginStatus(res)
      })
  }

  function handleChange(type: InputType, event) {
    const { value } = event.detail
    if (type === 'phone') {
      setPhone(value)
    } else {
      setPassword(value)
    }
  }

  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <View className='login_container'>
      <CTitle isFixed={false} />
      <View className='login_content'>
        <View className='login_content__item'>
          <Icon name='phone' size='24' color='#ccc'></Icon>
          <Input
            type='text'
            placeholder='手机号'
            className='login_content__input'
            onInput={(e): void => {
              handleChange('phone', e)
            }}
          />
        </View>
        <View className='login_content__item'>
          <Icon name='lock' size='24' color='#ccc'></Icon>
          <Input
            type='text'
            password
            placeholder='密码'
            className='login_content__input'
            onInput={(e): void => {
              handleChange('password', e)
            }}
          />
        </View>
        <Button className='login_content__btn' onClick={() => login()}>
          登录
        </Button>
      </View>
    </View>
  )
}

export default Page
