import { useContext, useEffect, useState } from "react"
import AuthContext from "../contexts/AuthContext"
import Card from "./Card/Card"
import RoomContext from "../contexts/RoomContext"
import { Navigate } from "react-router-dom"


function MainField({dominoes, fieldSize, startVisibility}: {
    startVisibility: boolean,
    dominoes: (number | null)[][],
    fieldSize: number[],
}) {

    const [selected, setSelected] = useState<(null | {coords: number[], value: number})[]>([null, null])

    const {auth, socket} = useContext(AuthContext)
    const {leaveRoom, currentRoom} = useContext(RoomContext)

    if (!auth) {
        leaveRoom()
        return <Navigate to={'/'}/>
      }

    useEffect(() => {
        if (selected[0] !== null && selected[1] !== null && selected[0]?.value === selected[1]?.value) {
            for (let domino of selected) {
              if (!domino) {return}
              setTimeout(() => socket.emit('coincidence', currentRoom?.id, selected.map(select => select?.coords)), 500)
            }
        }
      }, [selected, dominoes])

  return (
    <div 
    className="GameTable"
    style={{
        border: '0.16rem dashed white',
        padding: '1rem',
        // background: 'red',
      display: 'grid',
      width: 'fit-content',
      gridTemplateColumns: `repeat(${fieldSize[0]}, 1fr)`,
      gridTemplateRows: `repeat(${fieldSize[1]}, 1fr)`,
    }}
  >
  {auth && dominoes.map((row, y) =>
      row.map((value, x) => {
        return (value !== null) ? <Card
          className={selected.map(coords => JSON.stringify(coords)).includes(JSON.stringify({value: value, coords: [x, y]})) ? 'selected' : ''}
          key={x}
          value={value}
          hidden={
                !(startVisibility ||
                selected.map(coords => JSON.stringify(coords)).includes(JSON.stringify({value: value, coords: [x, y]}))
                )
          }
          onClick={() => {
            if (selected.every(value => value) || startVisibility) {return}
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
      }))}
  </div>
  )
}

export default MainField