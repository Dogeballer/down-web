import { StatusCreator, PopStatusCreator } from '@fishballer/bui'
import { ETL_STATUS_DATA } from '../../constant'

export const ETLStatus = StatusCreator([...ETL_STATUS_DATA])

export const ETLPopStatus = PopStatusCreator([...ETL_STATUS_DATA], ETLStatus)
