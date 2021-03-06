import { Component } from 'react'
import Taro from '@tarojs/taro'
import { Search, Icon, Tabbar, TabbarItem } from '@antmjs/vantui'
import classnames from 'classnames'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '../../utils/connect'
import CLoading from '../../components/CLoading'
import api from '../../services/api'
import CMusic from '../../components/CMusic'
import { getSongInfo, updatePlayStatus } from '../../actions/song'
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

type PageDispatchProps = {
  getSongInfo: (object) => any
  updatePlayStatus: (object) => any
}

type IProps = PageStateProps & PageDispatchProps

interface Page {
  props: IProps
}

type PageState = {
  userInfo: {
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
  current: number
  userCreateList: Array<ListItemInfo>
  userCollectList: Array<ListItemInfo>
  searchValue: string
}

@connect(
  ({ song }) => ({
    song: song,
  }),
  (dispatch) => ({
    getSongInfo(object) {
      dispatch(getSongInfo(object))
    },
    updatePlayStatus(object) {
      dispatch(updatePlayStatus(object))
    },
  })
)
class Page extends Component<IProps, PageState> {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: Taro.getStorageSync('userInfo'),
      current: 1,
      userCreateList: [],
      userCollectList: [],
      searchValue: '',
    }
  }

  componentWillUnmount() {}

  componentDidShow() {
    if (!this.state.userInfo) {
      Taro.navigateTo({
        url: '/pages/packageA/pages/login/index',
      })
      return
    }
    this.getSubcount()
    this.getUserDetail()
    this.getPlayList()
  }

  getUserDetail() {
    // const { userId } = this.state.userInfo.profile
    // api
    //   .get('/user/detail', {
    //     uid: userId,
    //   })
    //   .then((res) => {
    //     res.data
    //     this.setState({
    //       userInfo: res.data,
    //     })
    //   })
  }

  getPlayList() {
    const { userId } = this.state.userInfo.profile
    api
      .get('/user/playlist', {
        uid: userId,
        limit: 300,
      })
      .then((res) => {
        if (res.data.playlist && res.data.playlist.length > 0) {
          this.setState({
            userCreateList: res.data.playlist.filter(
              (item) => item.userId === userId
            ),
            userCollectList: res.data.playlist.filter(
              (item) => item.userId !== userId
            ),
          })
        }
      })
  }

  getSubcount() {
    api.get('/user/subcount').then((res) => {
      console.log('res', res)
    })
  }

  switchTab(value) {
    if (value !== 0) return
    Taro.reLaunch({
      url: '/pages/index/index',
    })
  }

  showToast() {
    Taro.showToast({
      title: '???????????????????????????',
      icon: 'none',
    })
  }

  goUserDetail() {
    return
    // const { userId } = this.state.userInfo.profile
    // Taro.navigateTo({
    //   url: `/pages/user/index?id=${userId}`
    // })
  }

  goSearch() {
    Taro.navigateTo({
      url: `/pages/packageA/pages/search/index`,
    })
  }

  jumpPage(name) {
    Taro.navigateTo({
      url: `/pages/packageA/pages/${name}/index`,
    })
  }

  jumpEventPage() {
    this.showToast()
    // const { userId } = this.state.userInfo.profile;
    // Taro.navigateTo({
    //   url: `/pages/packageA/pages/myEvents/index?uid=${userId}`
    // });
  }

  signOut() {
    Taro.clearStorage()
    api.get('/logout').then((res) => {
      console.log('????????????', res)
    })
    Taro.redirectTo({
      url: '/pages/packageA/pages/login/index',
    })
  }

  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/packageA/pages/playListDetail/index?id=${item.id}&name=${item.name}`,
    })
  }

  render() {
    const { userInfo, userCreateList, userCollectList, searchValue } =
      this.state
    const { currentSongInfo, isPlaying, canPlayList } = this.props.song
    return (
      <View
        className={classnames({
          my_container: true,
          hasMusicBox: !!this.props.song.currentSongInfo.name,
        })}
      >
        <CMusic
          songInfo={{
            currentSongInfo,
            isPlaying,
            canPlayList,
          }}
          isHome
          onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)}
        />
        <View onClick={this.goSearch.bind(this)}>
          <Search
            value={searchValue}
            placeholder='?????????'
            disabled
            onChange={this.goSearch.bind(this)}
          />
        </View>
        <View className='header'>
          <View className='header__left' onClick={this.goUserDetail.bind(this)}>
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
            onClick={this.signOut.bind(this)}
          ></Icon>
        </View>
        <View className='user_count'>
          <View
            className='user_count__sub'
            onClick={this.jumpEventPage.bind(this)}
          >
            <View className='user_count__sub--num'>
              {userInfo?.profile?.eventCount || 0}
            </View>
            <View>??????</View>
          </View>
          <View
            className='user_count__sub'
            onClick={this.jumpPage.bind(this, 'myFocus')}
          >
            <View className='user_count__sub--num'>
              {userInfo?.profile?.follows || 0}
            </View>
            <View>??????</View>
          </View>
          <View
            className='user_count__sub'
            onClick={this.jumpPage.bind(this, 'myFans')}
          >
            <View className='user_count__sub--num'>
              {userInfo?.profile?.followeds || 0}
            </View>
            <View>??????</View>
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
              onClick={this.jumpPage.bind(this, 'recentPlay')}
            >
              <Text>????????????</Text>
              <Text className='at-icon at-icon-chevron-right'></Text>
            </View>
          </View>
          <View className='user_brief__item'>
            <Image
              className='user_brief__item__img'
              src={require('../../assets/images/my/my_radio.png')}
            />
            <View
              className='user_brief__item__text'
              onClick={this.showToast.bind(this)}
            >
              <Text>????????????</Text>
              <Text className='at-icon at-icon-chevron-right'></Text>
            </View>
          </View>
          <View className='user_brief__item'>
            <Image
              className='user_brief__item__img'
              src={require('../../assets/images/my/my_collection_icon.png')}
            />
            <View
              className='user_brief__item__text'
              onClick={this.showToast.bind(this)}
            >
              <Text>????????????</Text>
              <Text className='at-icon at-icon-chevron-right'></Text>
            </View>
          </View>
        </View>
        <View className='user_playlist'>
          <View className='user_playlist__title'>
            ??????????????????
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
                onClick={this.goDetail.bind(this, item)}
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
                    {item.trackCount}???, ??????{formatCount(item.playCount)}???
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className='user_playlist'>
          <View className='user_playlist__title'>
            ??????????????????
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
                onClick={this.goDetail.bind(this, item)}
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
                    {item.trackCount}???, ??????{formatCount(item.playCount)}???
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <Tabbar fixed active={this.state.current} activeColor='#d43c33'>
          <TabbarItem
            iconPrefix='fa'
            icon='feed'
            onClick={this.switchTab.bind(this)}
          >
            ??????
          </TabbarItem>
          <TabbarItem
            iconPrefix='fa'
            icon='music'
            onClick={this.switchTab.bind(this)}
          >
            ??????
          </TabbarItem>
        </Tabbar>
      </View>
    )
  }
}

export default Page
