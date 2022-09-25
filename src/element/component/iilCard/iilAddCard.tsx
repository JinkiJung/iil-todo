import React from "react";

export interface IiilAddCardProp {
    onAddCard: () => void;
}
export const IilAddCard = ({onAddCard}: IiilAddCardProp) => <div 
    role="button"
    style={{
    border: "1px solid",
    display: "flex",
    borderInlineColor: "gray",
    margin: "0 2px",
    width: "80px",
    height: "100%",
    userSelect: "none",
    color: "white",
    backgroundColor: "#2274A5",
    justifyContent: "center",
    alignItems: "center",
    }}
    tabIndex={0}
    className="card"
    onClick={onAddCard}>
        <h1>+</h1>
</div>