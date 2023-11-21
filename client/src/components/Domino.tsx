import { ReactEventHandler, useState } from "react"

const values: Object = {
    1: 'red',
    2: 'blue',
    3: 'green',
    4: 'orange' 
}


function Domino({value, visible, onClick, className}: {value: number | null, visible: boolean, onClick: ReactEventHandler, className: string}) {

    return (
        <div 
            className={`domino ${className}`}
            onClick={onClick}
        >
            {visible ? value : '▩'}
        </div>
    )
}

export default Domino