import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

//  插入数据到储存数组中,compare为比较函数，查找该数组是否存在该数据
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  //  如果保存的数据就在第一条，什么都不做
  if (index === 0) {
    return
  }
  //  有该数据并且不在第一条
  if (index > 0) {
    arr.splice(index, 1)
  }
  //  向数组的开头添加元素
  arr.unshift(val)
  //  当存储数组有长度并长度大于最大储存数量时
  if (maxLen && arr.length > maxLen) {
  //  移除最旧的数据
    arr.pop()
  }
}

//  从数组中删除数据的方法
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

//  保存数据到本地存储上
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  //  调用插入数据的方法
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)
  return searches
}

//  从本地存储上获取搜索列表数据
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

//  删除本地存储上的历史数据
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)
  return searches
}

//  清空本地存储上的历史数据
export function clearHistory() {
  storage.remove(SEARCH_KEY)
  return []
}

//  本地存储播放历史
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

//  从本地存储上获取播放列表数据
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

//  本地存储我喜欢的歌曲
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

//  从本地存储我喜欢的歌曲列表中删除歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

//  从本地存储获取我喜欢的歌曲列表
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
