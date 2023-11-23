import { useEffect, useState } from "react"
import styles from './styles.module.css'

type CardPropsTypes = {
    value: number | string,
    hidden: boolean,
    [index: string]: any,
}

function Card(props: CardPropsTypes) {

    const [isHidden, setHidden] = useState<boolean>(props.hidden)

    useEffect(() => {
        setHidden(props.hidden)
    }, [props.hidden])

    return (
        <div
            className={`${styles.card} ${isHidden ? styles.hidden : null}`}
            onClick={props?.onClick || (() => {})}
            style={{
                width: '4rem',
                aspectRatio: '1/1.8',
                margin: '1rem',
                ...(props?.style?.card || {})
            }}
        >
            <div
                className={`${styles.frontSide}`}
                style={{
                    // background: '#ff0025',
                    background: '#fff',
                    color: 'black',
                    ...(props?.style?.frontSide || {})
                    // boxShadow: 'rgba(255, 0, 37, 0.38) 0px 0px 2rem 0.4rem'
                }}
            >
                <h1>{props.value}</h1>
            </div>

            <div
                className={`${styles.backSide}`}
                style={{
                    background: '#111',
                    border: '0.1rem solid #fff',
                    ...(props?.style?.backSide || {})
                    // boxShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 2rem 0.4rem',
                }}
            >
                <img src="https://www.shutterstock.com/image-vector/sparkles-emoji-star-pixel-art-600nw-2257711361.jpg"/>
            </div>
            
        </div>
    )
}

export default Card