import { useContext, useEffect, useState } from "react"
import RoomContext from "../contexts/RoomContext"
import AuthContext from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import Domino from "../components/Domino"

type GameStateType = {
  individualData: {
    [userId: string]: { dominoes: (number | null)[][] },
  }
}

function Game({GameState}: {GameState: GameStateType}) {

    const {auth} = useContext(AuthContext)

    const [startVisibility, setStartVisibility] = useState(false)

    const [selected, setSelected] = useState<(null | {coords: number[], value: number})[]>([null, null])

    const {leaveRoom, currentRoom} = useContext(RoomContext)

    if (!auth) {
      leaveRoom()
      return <Navigate to={'/'}/>
    }

    useEffect(() => {
      setStartVisibility(true)
      setTimeout(() => {
        setStartVisibility(false)
      }, 3000)
    }, [])

    useEffect(() => {
      if (selected[0] !== null && selected[1] !== null && selected[0]?.value === selected[1]?.value) {
          for (let domino of selected) {
            if (!domino) {return}
            //socket
            GameState.individualData[auth.id].dominoes[domino.coords[1]][domino.coords[0]] = null
          }
      }
    }, [selected, GameState.individualData[auth.id].dominoes])

  return (
    <>
        <h1>{'_________________ /||\\__ /||\\'}</h1>
        <h1>{'GAME STARTED /// ^\\/\\/^ ///'}</h1>
        <button onClick={() => leaveRoom()} children={'leave'} />
        {currentRoom?.users.map((user, i) => <h3 key={i}>{user.nickname} - ID: {user.id}</h3>)}
        {JSON.stringify(selected)}
        <div className="Game">
        <div 
          className="GameTable"
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
        {GameState.individualData[auth.id].dominoes.map((row, y) => {
          return <h2
            key={y}
            style={{display: 'flex', flexDirection: 'row'}}
          >
            {row.map((value, x) => {
              return (value !== null) ? <Domino
                className={selected.map(coords => JSON.stringify(coords)).includes(JSON.stringify({value: value, coords: [x, y]})) ? 'selected' : ''}
                key={x}
                value={value}
                visible={
                  startVisibility ||
                  selected.map(coords => JSON.stringify(coords)).includes(JSON.stringify({value: value, coords: [x, y]}))
                }
                onClick={() => {
                  if (selected.every(value => value)) {return}
                  setSelected(prev => {
                    const coords = [x, y]
                    if (!prev[0] && !prev[1]) {
                      return [{value, coords}, null]
                    }
                    if (prev[0] && !prev[1] && prev[0].coords.some((value, i) => value !== coords[i])) {
                      setTimeout(() => {
                        setSelected([null, null])
                      }, 600)
                      return [prev[0], {value, coords}]
                    } 
                    return prev
                  })
                }}
                /> : <div style={{width: '5rem', height: '7rem'}}></div>
            })}
            </h2>
        })}
        </div>
        <div className="EnemyGameTable">
        {currentRoom?.users.map((user, i) => <h1 style={{textAlign: 'center'}} key={i}>{user.nickname} - ID: {user.id}</h1>)}
        <div>
          {GameState.individualData[auth.id].dominoes.map((row, y) => {
            return <h2
              key={y}
              style={{display: 'flex', flexDirection: 'row'}}
            >
              {row.map((value, x) => {
                return value !== null
                ? <Domino className={''} value={value} visible={false} onClick={() => {}}/>
                : <div style={{width: '5rem', height: '7rem'}}></div>
              })}
              </h2>
          })}
        </div>

        </div>
       
    </div>
    </>
  )
}

export default Game