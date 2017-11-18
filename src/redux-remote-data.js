export const remoteDataThunkAction = ({ actionPrefix = 'REMOTE_DATA' }) => {
  const CHANGE_ACTION = `${actionPrefix}_CHANGE`

  return (remoteData, ...args) => dispatch => {
    remoteData.onChange = d =>
      dispatch({
        type: CHANGE_ACTION,
        remoteData: d,
      })

    return remoteData.fetch(...args).then(d => {
      dispatch({
        type: CHANGE_ACTION,
        remoteData: d,
      })
    })
  }
}
