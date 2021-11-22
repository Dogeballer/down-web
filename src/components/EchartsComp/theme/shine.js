import shine from './shine.json'

import * as echarts from 'echarts'

export const pieColors = [
  shine.color[2],
  shine.color[1],
  shine.color[0],
  ...shine.color.slice().reverse()
]

echarts.registerTheme('shine', shine)
