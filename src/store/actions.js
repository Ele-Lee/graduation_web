import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearHistory,
  savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

//  当播放模式为随机播放时，播放当前点击歌曲需要重新获取其index
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
//  如果播放模式的话歌曲列表已被打乱，index已经不是原来的index，所以需要另外处理
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
//  记录当前歌曲
  let currentSong = playList[currentIndex]
//  查找该当前歌曲列表是否已经含有要插入的歌曲
  let fpIndex = findIndex(playList, song)
//  因为是插入歌曲，所以索引+1
  currentIndex++
//  插入这首歌到当前位置
  playList.splice(currentIndex, 0, song)
//  如果包含了这首歌，就得把原来的这首歌删掉
  if (fpIndex > -1) {
  //  如果当前插入的序号大于该列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
  //  如果当前插入的序号小于该列表中的序号
      playList.splice(fpIndex + 1, 1)
    }
  }

//  查找要插入的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
//  查找sequenceList是否存在该歌曲
  let fsIndex = findIndex(sequenceList, song)
  //  插入这首歌到当前位置
  sequenceList.splice(currentSIndex, 0, song)
  //  删除原有歌曲
  if (fsIndex > -1) {
    //  如果当前插入的序号大于该列表中的序号
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      //  如果当前插入的序号小于该列表中的序号
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  //  如果当前播放歌曲在删除歌曲之后，需要将currentIndex往前-1
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

//    如果把播放列表删完后要将播放状态改为false
  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
//  另一种写法
//  const playingState = playList.length > 0
//  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearHistory())
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

//  进行我喜欢的和播放历史的转换
// export const changeLikeHistory = function ({commit}, index) {
//   commit(types.SET_LIKE_HISTORY, index)
// }
