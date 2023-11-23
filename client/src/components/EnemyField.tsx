import Card from "./Card/Card"


function EnemyField({dominoes, fieldSize}: {
    fieldSize: number[],
    dominoes: (number | null)[][],
}) {

  return (
    <div 
    className="GameTable"
    style={{
        // background: 'red',
        border: '0.16rem dashed white',
        padding: '1rem',
      display: 'grid',
      width: 'fit-content',
      gridTemplateColumns: `repeat(${fieldSize[0]}, 1fr)`,
      gridTemplateRows: `repeat(${fieldSize[1]}, 1fr)`,
    }}
  >
  {[...dominoes].flat().map((value, x) =>
      {
        return (value !== null) ? <Card
          style={{
            card: {
              cursor: 'default',
            },
            frontSide: {
              background: 'red',
            },
            backSide: {
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                black 0px 5px,
                rgba(50, 50, 50, 1) 5px 10px
              )`,
            }
          }}
          key={x}
          value={value}
          hidden={true}
          disabled={true}
          /> : <div style={{width: '5rem', height: '7rem'}}></div>
        })
    }
  </div>
  )
}

export default EnemyField