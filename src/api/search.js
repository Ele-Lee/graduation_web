import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    g_tk: 5381,
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    perpage: perpage,
    n: perpage,
    zhidaqu: 1,
    t: 0,
    cr: 1,
    lossless: 0,
    flag_qc: 0,
    flag: 1,
    aggr: 1,
    remoteplace: 'txt.yqq.center',
    uid: 0,
    platform: 'yqq',
    needNewCode: 0,
    g_tk: 5381
  })
  return jsonp(url, data, options)
}
