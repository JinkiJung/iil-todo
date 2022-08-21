import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { IilDto } from "../../../ill-repo-client";
import { IilCard } from "./iilCard";
// NOTE: for hide scrollbar
import "./hideScrollbar.css";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import usePreventBodyScroll from "./usePreventBodyScroll";
import { LeftArrow, RightArrow } from "./arrows";
import { IilAddCard } from "./iilAddCard";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
export interface IiilSummaryListProp {
    iils: IilDto[];
}


export const IilCardList = (
    {iils}: IiilSummaryListProp
    ) => {
    const { disableScroll, enableScroll } = usePreventBodyScroll();
    
    function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
        const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
      
        if (isThouchpad) {
          ev.stopPropagation();
          return;
        }
      
        if (ev.deltaY < 0) {
          apiObj.scrollNext();
        } else if (ev.deltaY > 0) {
          apiObj.scrollPrev();
        }
      }

    return <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
        >
            <IilAddCard />
            {
                iils.map((iil) => <IilCard iil={iil} compact={true} />)
            }
          </ScrollMenu>
        </div>}