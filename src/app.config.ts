export default defineAppConfig({
  pages: ['pages/index/index', 'pages/my/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#d43c33',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white',
  },
  requiredBackgroundModes: ['audio'],
  subpackages: [
    {
      root: 'pages/packageA',
      pages: [
        'pages/videoDetail/index',
        'pages/search/index',
        'pages/searchResult/index',
        'pages/songDetail/index',
        'pages/playListDetail/index',
        'pages/login/index',
        'pages/myFans/index',
        'pages/myFocus/index',
        'pages/myEvents/index',
        'pages/recentPlay/index',
      ],
    },
  ],
})
