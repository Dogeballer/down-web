import shine from './shine.json'

import * as echarts from 'echarts'

export const pieColors = [
  '#1479e9',
  '#11a6ae',
  '#24a654',
  '#d5b021',
  ...shine.color
]

echarts.registerTheme('shine', shine)
