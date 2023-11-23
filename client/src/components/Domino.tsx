import { ReactEventHandler } from "react"

function Domino({value, visible, onClick, className, disabled}: {disabled: boolean, value: number | null, visible: boolean, onClick: ReactEventHandler, className: string}) {

    return (
        <div 
            className={`domino ${className} ${disabled ? 'disabled' : ''}`}
            onClick={!disabled ? onClick : () => {}}
        >
            {visible ? value : '▩'}
        </div>
    )
}

export default Domino