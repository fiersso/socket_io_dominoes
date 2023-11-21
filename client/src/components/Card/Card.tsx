import { useEffect, useState } from "react"
import styles from './styles.module.css'

type CardPropsTypes = {
    value: number | string,
    hidden: boolean,
    [index: string]: any,
}

function Card({value, hidden}: CardPropsTypes) {

    const [isHidden, setHidden] = useState<boolean>(hidden)

    useEffect(() => {
        // setTimeout(() => {
        //     setHidden(prev => !prev)
        // }, 1_000)
    }, [isHidden])

    return (
        <div style={{
            margin: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#111',
            width: '20rem',
            aspectRatio: '1/1',
        }}>
        <div
            className={`${styles.card} ${isHidden ? styles.hidden : null}`}
            onClick={() => {setHidden(prev => !prev)}}
            style={{
                width: '5rem',
                aspectRatio: '1/1.8',
                margin: '1rem',
            }}
        >
            <div
                className={`${styles.frontSide}`}
                style={{
                    background: '#ff0025',
                    boxShadow: 'rgba(255, 0, 37, 0.38) 0px 0px 2rem 0.4rem'
                }}
            >
                <h3>value:</h3>
                <h2>{value}</h2>
            </div>

            <div
                className={`${styles.backSide}`}
                style={{
                    background: '#111',
                    border: '0.1rem solid #fff',
                    boxShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 2rem 0.4rem',
                }}
            >
                <img src="https://www.shutterstock.com/image-vector/sparkles-emoji-star-pixel-art-600nw-2257711361.jpg"/>
            </div>
            
        </div>
        </div>
    )
}

export default Card