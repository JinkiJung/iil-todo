export interface IFlow {
    id: number,
    priority: number,
    scoringMethod: string,
    score: number,
    ownedBy: string,
}

export interface IFall extends IFlow{
    to: string,
    effect: string,
    feedback: string,
}

export interface IFork extends IFlow {
    if: string,
    then: IFlow,
    else: IFlow,
}