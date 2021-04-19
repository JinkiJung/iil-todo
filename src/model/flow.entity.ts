export interface IFlow {
    id: number,
    priority: number,
    scoring: string,
    if: string,
    then: string,
    else: string,
    thenFeedback: string,
    elseFeedback: string,
    ownedBy: string
}