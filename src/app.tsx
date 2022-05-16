import { FC } from 'react'
import { Provider } from 'react-redux'
import configStore from './store'
import './assets/iconFont/icon.less'
import './app.less'

const store = configStore()

const App: FC = ({ children }) => {
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  return <Provider store={store}>{children}</Provider>
}

export default App
