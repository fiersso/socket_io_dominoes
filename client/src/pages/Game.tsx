import { useContext, useEffect, useRef, useState } from "react"
import RoomContext from "../contexts/RoomContext"
import AuthContext from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import MainField from "../components/MainField"
import EnemyField from "../components/EnemyField"
import {useTimer} from 'react-timer-hook'

type GameStateType = {
  individualData: {
    [userId: string]: { dominoes: (number | null)[][] },
  },
  fieldSize: number[],
}

function Game({GameState}: {GameState: GameStateType}) {

    const {auth, socket} = useContext(AuthContext)

    const [startVisibility, setStartVisibility] = useState(false)
    
    const time = new Date()
    time.setSeconds(time.getSeconds() + 3)

    const giveUp = () => {
      socket.emit('give_up', currentRoom?.id)
    }
    
    const timerSpanRef = useRef<null | HTMLSpanElement>(null)

    const {
      seconds,
      isRunning,
    } = useTimer({ autoStart: true, expiryTimestamp: time, onExpire: () => {
      setStartVisibility(false)
    }})

    
    const {leaveRoom, currentRoom} = useContext(RoomContext)


    if (!auth) {
      leaveRoom()
      return <Navigate to={'/'}/>
    }

    useEffect(() => {
      setStartVisibility(true)
    }, [])

    useEffect(() => {
      if (!timerSpanRef.current) return 
      timerSpanRef.current.classList.remove("spawnAnimation")
      timerSpanRef.current.classList.add("spawnAnimation")
    }, [seconds])

  return (
    <div style={{
      margin: 'auto',
      width: 'fit-content'
    }}>
        <div style={{display: 'flex', alignItems: 'end', gap: '1rem', marginBottom: '1rem',marginTop: '1rem'}}>
          <div>
            <h1>{'_________________ /||\\__ /||\\'}</h1>
            <h1>{'GAME STARTED /// ^\\/\\/^ ///'}</h1>
          </div>
          <button onClick={() => giveUp()} children={'give up'} />
        </div>
        <div className="Game"
          style={{
            display: 'grid',
            gridTemplateColumns: (currentRoom?.users.length === 2) ? '1fr auto 1fr' : 'repeat(3, 1fr)',
            gap: '5rem'
          }}
        >
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.8rem', color: 'rgba(100, 100, 100, 1)', fontSize: '2rem'}}><h5>THIS</h5> <h1>YOURS</h1></div>
              
            </div>
            <MainField dominoes={ GameState.individualData[auth.id].dominoes } fieldSize={GameState.fieldSize} startVisibility={startVisibility} />
          </div>


          {(currentRoom?.users.length === 2) 
            ? <h1 style={{width: 'fit-content'}}>{(!isRunning) ? 'VS' : <span ref={timerSpanRef}>{seconds}</span>}</h1>
            : null
          }
          {
            Object.keys(GameState.individualData).filter(id => +id !== auth.id).map((id, i) => 
            
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center'}}>
                  <h5 style={{color: 'rgba(100, 100, 100, 1)', fontSize: '3.5rem'}}>{currentRoom?.users.find(user => user.id === +id)?.nickname}</h5>
                </div>
                <EnemyField fieldSize={GameState.fieldSize} dominoes={ GameState.individualData[id].dominoes } />
              </div>
            
            )
          }
        </div>
    </div>
  )
}

export default Game