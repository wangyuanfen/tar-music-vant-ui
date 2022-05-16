import Taro from '@tarojs/taro'
import { useState, useEffect, FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tabs, Tab } from '@antmjs/vantui'
import { View } from '@tarojs/components'
import classnames from 'classnames'
import api from '../../../../services/api'
import CLoading from '../../../../components/CLoading'
import CMusic from '../../../../components/CMusic'
import {
  updatePlayStatus,
  updateCanplayList,
  updateRecentTab,
} from '../../../../actions/song'
import { MusicItemType, songType } from '../../../../constants/commonType'
import './index.less'

type PageStateProps = {
  song: songType
}
type List = Array<{
  playCount: number
  song: MusicItemType
}>

const Page: FC = () => {
  const getData = () => {
    const userId = Taro.getStorageSync('userId')
    api
      .get('/user/record', {
        uid: userId,
        type: currentTab === 0 ? 1 : 0,
      })
      .then((res) => {
        const dataType = currentTab === 0 ? 'weekData' : 'allData'
        if (res.data && res.data[dataType] && res.data[dataType].length > 0) {
          setList(res.data[dataType])
        }
      })
  }

  const switchTab = (e) => {
    setCurrentTab(e.detail.index)
    setList(list)
    getData()
  }

  const playSong = (songId, canPlay) => {
    if (canPlay) {
      saveData(songId)
      Taro.navigateTo({
        url: `/pages/packageA/pages/songDetail/index?id=${songId}`,
      })
    } else {
      Taro.showToast({
        title: '暂无版权',
        icon: 'none',
      })
    }
  }

  const saveData = (songId) => {
    const tempList = list.map((item) => {
      let temp: any = {}
      temp.name = item.song.name
      temp.id = item.song.id
      temp.ar = item.song.ar
      temp.al = item.song.al
      temp.copyright = item.song.copyright
      temp.st = item.song.st
      return temp
    })
    const canPlayList = tempList.filter((item) => {
      return item.st !== -200
    })
    dispatch(
      updateCanplayList({
        canPlayList,
        currentSongId: songId,
      })
    )
    dispatch(
      updateRecentTab({
        recentTab: currentTab,
      })
    )
  }

  const showMore = () => {
    Taro.showToast({
      title: '暂未实现，敬请期待',
      icon: 'none',
    })
  }

  const song = useSelector((state: PageStateProps) => state.song)
  const { currentSongInfo, isPlaying, canPlayList } = song
  const [currentTab, setCurrentTab] = useState(0)
  const [list, setList] = useState<List>([])
  const dispatch = useDispatch()

  useEffect(() => {
    getData()
  }, [])

  return (
    <View
      className={classnames({
        recentPlay_container: true,
        hasMusicBox: !!song.currentSongInfo.name,
      })}
    >
      <CMusic
        songInfo={{
          currentSongInfo,
          isPlaying,
          canPlayList,
        }}
        onUpdatePlayStatus={(object) => {
          dispatch(updatePlayStatus(object))
        }}
      />
      <Tabs active={currentTab} onClick={switchTab}>
        <Tab title='最近7天'>
          {list.length === 0 ? (
            <CLoading />
          ) : (
            list.map((item) => (
              <View key={item.song.id} className='recentPlay__music'>
                <View
                  className='recentPlay__music__info'
                  onClick={() => {
                    playSong(item.song.id, item.song.st !== -200)
                  }}
                >
                  <View className='recentPlay__music__info__name'>
                    {item.song.name}
                  </View>
                  <View className='recentPlay__music__info__desc'>
                    {`${item.song.ar[0] ? item.song.ar[0].name : ''} - ${
                      item.song.al.name
                    }`}
                  </View>
                </View>
                <View
                  className='fa fa-ellipsis-v recentPlay__music__icon'
                  onClick={showMore}
                ></View>
              </View>
            ))
          )}
        </Tab>
        <Tab title='全部'>
          {list.length === 0 ? (
            <CLoading />
          ) : (
            list.map((item) => (
              <View key={item.song.id} className='recentPlay__music'>
                <View
                  className='recentPlay__music__info'
                  onClick={() => {
                    playSong(item.song.id, item.song.st !== -200)
                  }}
                >
                  <View className='recentPlay__music__info__name'>
                    {item.song.name}
                  </View>
                  <View className='recentPlay__music__info__desc'>
                    {`${item.song.ar[0] ? item.song.ar[0].name : ''} - ${
                      item.song.al.name
                    }`}
                  </View>
                </View>
                <View
                  className='fa fa-ellipsis-v recentPlay__music__icon'
                  onClick={showMore}
                ></View>
              </View>
            ))
          )}
        </Tab>
      </Tabs>
    </View>
  )
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page
