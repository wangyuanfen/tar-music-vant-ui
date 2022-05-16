import Taro from '@tarojs/taro'
import { useState, useEffect, FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import { Search, Icon, Tabbar, TabbarItem } from '@antmjs/vantui'
import classnames from 'classnames'
import CLoading from '../../components/CLoading'
import CMusic from '../../components/CMusic'
import api from '../../services/api'
import { songType } from '../../constants/commonType'
import {
  getRecommendPlayList,
  getRecommendDj,
  getRecommendNewSong,
  getRecommend,
  updatePlayStatus,
} from '../../actions/song'
import './index.less'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
type BannerList = Array<{
  typeTitle: string
  pic: string
  targetId: number
}>

type RecommendPlayList = Array<{
  id: number
  name: string
  picUrl: string
  playCount: number
}>

type PageStateProps = {
  song: songType
}

const Index: FC = () => {
  const goSearch = () => {
    Taro.navigateTo({
      url: `/pages/packageA/pages/search/index`,
    })
  }

  const goDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/packageA/pages/playListDetail/index?id=${item.id}&name=${item.name}`,
    })
  }

  const goPage = () => {
    Taro.showToast({
      title: '正在开发中，敬请期待',
      icon: 'none',
    })
  }

  const switchTab = (value) => {
    if (value !== 1) return
    Taro.reLaunch({
      url: '/pages/my/index',
    })
  }

  const getBanner = () => {
    api
      .get('/banner', {
        type: 1,
      })
      .then(({ data }) => {
        if (data.banners) {
          setBannerList(data.banners)
        }
      })
  }

  const song = useSelector((state: PageStateProps) => state.song)
  const { currentSongInfo, isPlaying, canPlayList } = song
  const recommendPlayList: RecommendPlayList = song.recommendPlayList
  const dispatch = useDispatch()
  const [current] = useState(0)
  const [showLoading, setShowLoading] = useState(true)
  const [searchValue] = useState('')
  const [bannerList, setBannerList] = useState<BannerList>([])

  useEffect(() => {
    dispatch(getRecommendPlayList())
    dispatch(getRecommendNewSong())
    dispatch(getRecommendDj())
    dispatch(getRecommend())
    getBanner()
    setShowLoading(false)
  }, [dispatch])

  return (
    <View
      className={classnames({
        index_container: true,
        hasMusicBox: !!currentSongInfo.name,
      })}
    >
      <CLoading fullPage hide={!showLoading} />
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
      <Swiper
        className='banner_list'
        indicatorColor='#999'
        indicatorActiveColor='#d43c33'
        circular
        indicatorDots
        autoplay
      >
        {bannerList.map((item) => (
          <SwiperItem key={item.targetId} className='banner_list__item'>
            <Image src={item.pic} className='banner_list__item__img' />
          </SwiperItem>
        ))}
      </Swiper>
      <View className='handle_list'>
        <View className='handle_list__item' onClick={goPage}>
          <View className='handle_list__item__icon-wrap'>
            <Icon
              classPrefix='fa'
              name='calendar-minus-o'
              size='25'
              color='#ffffff'
              className='handle_list_item__icon'
            ></Icon>
          </View>
          <Text className='handle_list__item__text'>每日推荐</Text>
        </View>
        <View className='handle_list__item' onClick={goPage}>
          <View className='handle_list__item__icon-wrap'>
            <Icon
              classPrefix='fa'
              name='bar-chart'
              size='25'
              color='#ffffff'
              className='handle_list_item__icon'
            ></Icon>
          </View>
          <Text className='handle_list__item__text'>排行榜</Text>
        </View>
      </View>
      <View className='recommend_playlist'>
        <View className='recommend_playlist__title'>推荐歌单</View>
        <View className='recommend_playlist__content'>
          {recommendPlayList.map((item) => (
            <View
              key={item.id}
              className='recommend_playlist__item'
              onClick={() => {
                goDetail(item)
              }}
            >
              <Image
                src={`${item.picUrl}?imageView&thumbnail=250x0`}
                className='recommend_playlist__item__cover'
              />
              <View className='recommend_playlist__item__cover__num'>
                <Text className='at-icon at-icon-sound'></Text>
                {item.playCount < 10000
                  ? item.playCount
                  : `${Number(item.playCount / 10000).toFixed(0)}万`}
              </View>
              <View className='recommend_playlist__item__title'>
                {item.name}
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

export default Index
