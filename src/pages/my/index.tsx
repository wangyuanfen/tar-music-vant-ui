import Taro from '@tarojs/taro'
import { useState, useEffect, FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Search, Icon, Tabbar, TabbarItem } from '@antmjs/vantui'
import classnames from 'classnames'
import { View, Image, Text } from '@tarojs/components'
import CLoading from '../../components/CLoading'
import api from '../../services/api'
import CMusic from '../../components/CMusic'
import { updatePlayStatus } from '../../actions/song'
import { formatCount } from '../../utils/common'
import { songType } from '../../constants/commonType'
import './index.less'

type ListItemInfo = {
  id: number
  coverImgUrl: string
  name: string
  trackCount: number
  playCount: number
}

type PageStateProps = {
  song: songType
}

type UserInfo = {
  account: {
    id: number
  }
  level: number
  profile: {
    avatarUrl: string
    backgroundUrl: string
    nickname: string
    eventCount: number
    follows: number
    followeds: number
    userId: number
  }
}

const Page: FC = () => {
  const getPlayList = () => {
    const { userId } = userInfo.profile
    api
      .get('/user/playlist', {
        uid: userId,
        limit: 300,
      })
      .then((res) => {
        if (res.data.playlist && res.data.playlist.length > 0) {
          setUserCreateList(
            res.data.playlist.filter((item) => item.userId === userId)
          )
          setUserCollectList(
            res.data.playlist.filter((item) => item.userId !== userId)
          )
        }
      })
  }

  const switchTab = (value) => {
    if (value !== 0) return
    Taro.reLaunch({
      url: '/pages/my/index',
    })
  }

  const showToast = () => {
    Taro.showToast({
      title: '暂未实现，敬请期待',
      icon: 'none',
    })
  }

  const goSearch = () => {
    Taro.navigateTo({
      url: `/pages/packageA/pages/search/index`,
    })
  }

  const jumpPage = (name) => {
    Taro.navigateTo({
      url: `/pages/packageA/pages/${name}/index`,
    })
  }

  const signOut = () => {
    Taro.clearStorage()
    api.get('/logout').then((res) => {
      console.log('退出登陆', res)
    })
    Taro.redirectTo({
      url: '/pages/packageA/pages/login/index',
    })
  }

  const goDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/packageA/pages/playListDetail/index?id=${item.id}&name=${item.name}`,
    })
  }

  const song = useSelector((state: PageStateProps) => state.song)
  const { currentSongInfo, isPlaying, canPlayList } = song
  const [userInfo] = useState<UserInfo>(Taro.getStorageSync('userInfo'))
  const dispatch = useDispatch()
  const [current] = useState(0)
  const [searchValue] = useState('')
  const [userCreateList, setUserCreateList] = useState<Array<ListItemInfo>>([])
  const [userCollectList, setUserCollectList] = useState<Array<ListItemInfo>>(
    []
  )

  useEffect(() => {
    if (!userInfo) {
      Taro.navigateTo({
        url: '/pages/packageA/pages/login/index',
      })
      return
    }
    getPlayList()
  }, [])

  return (
    <View
      className={classnames({
        my_container: true,
        hasMusicBox: !!currentSongInfo.name,
      })}
    >
      <CMusic
        songInfo={{
          currentSongInfo,
          isPlaying,
          canPlayList,
        }}
        isHome
        onUpdatePlayStatus={(object) => {
          dispatch(updatePlayStatus(object))
        }}
      />
      <View onClick={goSearch}>
        <Search
          value={searchValue}
          placeholder='搜一下'
          disabled
          onChange={goSearch}
        />
      </View>
      <View className='header'>
        <View className='header__left' onClick={showToast}>
          {userInfo?.profile?.avatarUrl ? (
            <Image
              src={`${userInfo?.profile?.avatarUrl}?imageView&thumbnail=250x0`}
              className='header__img'
            />
          ) : (
            ''
          )}

          <View className='header__info'>
            <View className='header__info__name'>
              {userInfo?.profile?.nickname}
            </View>
            <View>
              <Text className='header__info__level'>LV.{userInfo.level}</Text>
            </View>
          </View>
        </View>
        <Icon
          classPrefix='fa'
          name='sign-out'
          size='30'
          color='#d43c33'
          className='exit_icon'
          onClick={signOut}
        ></Icon>
      </View>
      <View className='user_count'>
        <View className='user_count__sub' onClick={showToast}>
          <View className='user_count__sub--num'>
            {userInfo?.profile?.eventCount || 0}
          </View>
          <View>动态</View>
        </View>
        <View
          className='user_count__sub'
          onClick={() => {
            jumpPage('myFocus')
          }}
        >
          <View className='user_count__sub--num'>
            {userInfo?.profile?.follows || 0}
          </View>
          <View>关注</View>
        </View>
        <View
          className='user_count__sub'
          onClick={() => {
            jumpPage('myFans')
          }}
        >
          <View className='user_count__sub--num'>
            {userInfo?.profile?.followeds || 0}
          </View>
          <View>粉丝</View>
        </View>
      </View>
      <View className='user_brief'>
        <View className='user_brief__item'>
          <Image
            className='user_brief__item__img'
            src={require('../../assets/images/my/recent_play.png')}
          />
          <View
            className='user_brief__item__text'
            onClick={() => {
              jumpPage('recentPlay')
            }}
          >
            <Text>最近播放</Text>
            <Text className='at-icon at-icon-chevron-right'></Text>
          </View>
        </View>
        <View className='user_brief__item'>
          <Image
            className='user_brief__item__img'
            src={require('../../assets/images/my/my_radio.png')}
          />
          <View className='user_brief__item__text' onClick={showToast}>
            <Text>我的电台</Text>
            <Text className='at-icon at-icon-chevron-right'></Text>
          </View>
        </View>
        <View className='user_brief__item'>
          <Image
            className='user_brief__item__img'
            src={require('../../assets/images/my/my_collection_icon.png')}
          />
          <View className='user_brief__item__text' onClick={showToast}>
            <Text>我的收藏</Text>
            <Text className='at-icon at-icon-chevron-right'></Text>
          </View>
        </View>
      </View>
      <View className='user_playlist'>
        <View className='user_playlist__title'>
          我创建的歌单
          <Text className='user_playlist__title__desc'>
            ({userCreateList.length})
          </Text>
        </View>
        {userCreateList.length === 0 ? <CLoading /> : ''}
        <View>
          {userCreateList.map((item) => (
            <View
              key={item.id}
              className='user_playlist__item'
              onClick={() => {
                goDetail(item)
              }}
            >
              <Image
                className='user_playlist__item__cover'
                src={`${item.coverImgUrl}?imageView&thumbnail=250x0`}
              />
              <View className='user_playlist__item__info'>
                <View className='user_playlist__item__info__name'>
                  {item.name}
                </View>
                <View className='user_playlist__item__info__count'>
                  {item.trackCount}首, 播放{formatCount(item.playCount)}次
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className='user_playlist'>
        <View className='user_playlist__title'>
          我收藏的歌单
          <Text className='user_playlist__title__desc'>
            ({userCollectList.length})
          </Text>
        </View>
        {userCollectList.length === 0 ? <CLoading /> : ''}
        <View>
          {userCollectList.map((item) => (
            <View
              key={item.id}
              className='user_playlist__item'
              onClick={() => {
                goDetail(item)
              }}
            >
              <Image
                className='user_playlist__item__cover'
                src={`${item.coverImgUrl}?imageView&thumbnail=250x0`}
              />
              <View className='user_playlist__item__info'>
                <View className='user_playlist__item__info__name'>
                  {item.name}
                </View>
                <View className='user_playlist__item__info__count'>
                  {item.trackCount}首, 播放{formatCount(item.playCount)}次
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Tabbar fixed active={current} activeColor='#d43c33'>
        <TabbarItem iconPrefix='fa' icon='feed' onClick={switchTab}>
          发现
        </TabbarItem>
        <TabbarItem iconPrefix='fa' icon='music' onClick={switchTab}>
          我的
        </TabbarItem>
      </Tabbar>
    </View>
  )
}

export default Page
