import { useState, useEffect, FC } from 'react'
import { Search, Icon } from '@antmjs/vantui'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import CLoading from '../../../../components/CLoading'
import {
  getKeywordInHistory,
  setKeywordInHistory,
  clearKeywordInHistory,
} from '../../../../utils/common'
import api from '../../../../services/api'
import './index.less'

type HotList = Array<{
  searchWord: string
  score: number
  iconUrl: string
  content: string
  iconType: number
}>

const Page: FC = () => {
  const searchTextChange = (e) => {
    setSearchValue(e.detail)
  }

  const searchResult = () => {
    goResult(searchValue)
  }

  const goResult = (keywords) => {
    setKeywordInHistory(keywords)
    Taro.navigateTo({
      url: `/pages/packageA/pages/searchResult/index?keywords=${keywords}`,
    })
  }

  const getHotSearch = () => {
    api.get('/search/hot/detail', {}).then((res) => {
      if (res.data && res.data.data) {
        setHotList(res.data.data)
      }
    })
  }

  const [searchValue, setSearchValue] = useState<string>('')
  const [hotList, setHotList] = useState<HotList>([])
  const [historyList, sethHistoryList] = useState<Array<string>>([])

  useEffect(() => {
    getHotSearch()
    sethHistoryList(getKeywordInHistory())
  }, [])
  return (
    <View className='search_container'>
      <Search
        value={searchValue}
        placeholder='搜一下'
        focus
        className='search__input'
        onChange={searchTextChange}
        renderAction={<View onClick={searchResult}>搜索</View>}
      />
      <ScrollView className='search_content' scrollY>
        {historyList.length ? (
          <View className='search__history'>
            <View className='search__history__title'>
              <Text className='search__history__title__label'>搜索历史</Text>
              <Icon
                classPrefix='fa'
                name='trash-o'
                size='20'
                color='#cccccc'
                className='search__history__title__icon'
                onClick={() => {
                  sethHistoryList([])
                  clearKeywordInHistory()
                }}
              ></Icon>
            </View>
            <ScrollView className='search__history__list' scrollX>
              {historyList.map((keyword) => (
                <Text
                  className='search__history__list__item'
                  key={keyword}
                  onClick={() => {
                    goResult(keyword)
                  }}
                >
                  {keyword}
                </Text>
              ))}
            </ScrollView>
          </View>
        ) : (
          ''
        )}
        <View className='search__hot'>
          <View className='search__history__title'>
            <Text className='search__history__title__label'>热搜榜</Text>
          </View>
          {hotList.length === 0 ? <CLoading /> : ''}
          <View className='search__hot__list'>
            {hotList.map((item, index) => (
              <View
                className='search__hot__list__item flex flex-align-center'
                key={item.searchWord}
                onClick={() => {
                  goResult(item.searchWord)
                }}
              >
                <View
                  className={classnames({
                    search__hot__list__item__index: true,
                    spec: index <= 2,
                  })}
                >
                  {index + 1}
                </View>
                <View className='search__hot__list__item__info'>
                  <View className='flex flex-align-center'>
                    <Text
                      className={classnames({
                        search__hot__list__item__info__title: true,
                        spec: index <= 2,
                      })}
                    >
                      {item.searchWord}
                    </Text>
                    <Text className='search__hot__list__item__info__score'>
                      {item.score}
                    </Text>
                    {item.iconUrl ? (
                      <Image
                        src={item.iconUrl}
                        mode='widthFix'
                        className={classnames({
                          search__hot__list__item__info__icon: true,
                          spec: item.iconType === 5,
                        })}
                      />
                    ) : (
                      ''
                    )}
                  </View>
                  <View className='search__hot__list__item__info__desc'>
                    {item.content}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
