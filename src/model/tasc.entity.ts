import { TascState } from "../type/tascState";
import { IFlow } from "./flow.entity";

export interface ITasc {
    iid: number;
    id: string;
    goal: string;
    given: string;
    startWhen: string;
    actor: string;
    act: string;
    produce: string;
    guidedBy: string;
    endWhen: string;
    leadTo: IFlow[];
    state: TascState;
    ownedBy: string;
    // platform dependent parameters
    order: number;
    namespace: string;
    loopCount: number;
}

class Tasc implements ITasc{
    public iid: number;
    public id: string;
    public goal: string;
    public given: string;
    public startWhen: string;
    public actor: string;
    public act: string;
    public guidedBy: string;
    public endWhen: string;
    public leadTo: IFlow[];
    public produce: string;
    public state: TascState;
    public order: number;
    public ownedBy: string;
    public namespace: string;
    public loopCount: number;

    constructor(itasc : Partial<ITasc>){
        this.iid = itasc.iid || 0;
        this.id = itasc.id || "";
        this.goal = itasc.goal || "";
        this.endWhen = itasc.endWhen || "";
        this.state = itasc.state || TascState.None;
        this.given = itasc.given || "";
        this.startWhen = itasc.startWhen || "";
        this.act = itasc.act || "";
        this.actor = itasc.actor || "";
        this.guidedBy = itasc.guidedBy || "";
        this.produce = itasc.produce || "";
        this.leadTo = itasc.leadTo || [];
        this.order = itasc.order || -1;
        this.ownedBy = itasc.ownedBy || itasc.actor || "";
        this.namespace = itasc.namespace || "";
        this.loopCount = itasc.loopCount || 0;
    }

    update(entryFromInput: Object): Tasc{
        Object.assign(this, entryFromInput);
        return this;
    }

    toJson(): object{
        return JSON.parse(JSON.stringify(this));
    }

    setOrder(i: number){
        this.order = i;
    }
}

export default Tasc;
