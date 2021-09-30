import React from 'react'

const Card = (props) => {
    return (
        <div className={`card mb-3 widget-content ${props.variant}`}>
            <div className="widget-content-wrapper text-white">
                <div className="widget-content-left">
                    <div className="widget-heading">{props.details.title}</div>
                    <div className="widget-subheading">{props.details.description}</div>
                </div>
                <div className="widget-content-right">
                    <div className="widget-numbers text-white"><span>{props.details.number}</span></div>
                </div>
            </div>
        </div>
    )
}

export default Card;
