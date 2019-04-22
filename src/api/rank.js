import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    g_tk: 5381,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid: topid,
    tpl: 3,
    type: 'top',
    page: 'detail',
    platform: 'yqq',
    g_tk: 5381,
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
