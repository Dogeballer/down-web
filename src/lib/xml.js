import convert from 'xml-js'
import fxp from 'fast-xml-parser'
import { isJSON } from './utils'
import { XML_OPTION } from '../constant'

const defaultOptions = {
  format: true,
  ignoreAttributes: false,
  parseTrueNumberOnly: true,
  textNodeName: '#text',
  cdataTagName: '_cdata'
}
export const xml2Json = (data, options = defaultOptions) => {
  if (!fxp.validate(data)) return null
  return fxp.parse(data, options)
}

export const json2Xml = (data, options = defaultOptions) => {
  if (!isJSON(data)) return null
  const parser = new fxp.j2xParser(options)
  return parser.parse(data)
}

export const prettify = (data, options = defaultOptions) => {
  if (!fxp.validate(data)) return null
  const xmlData = fxp.parse(data, options)
  const parser = new fxp.j2xParser(options)
  return parser.parse(xmlData)
}

export const formatter = (message) => {
  const jsonStr = convert.xml2json(message, XML_OPTION)
  return convert.json2xml(jsonStr, XML_OPTION)
}

export default {
  prettify,
  json2Xml,
  xml2Json,
  formatter
}
