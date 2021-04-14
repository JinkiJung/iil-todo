import { TascState } from "../type/tascState";

export interface ITasc {
    iid: number;
    id: string;
    goal: string;
    given: string;
    startWhen: string;
    actor: string;
    act: string;
    guidedBy: string;
    endWhen: string;
    leadTo: string;
    produce: string;
    state: TascState;
    order: number;
    ownedBy: string;
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
    public leadTo: string;
    public produce: string;
    public state: TascState;
    public order: number;
    public ownedBy: string;

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
        this.leadTo = itasc.leadTo || "";
        this.order = itasc.order || -1;
        this.ownedBy = itasc.ownedBy || itasc.actor || "";
    }

    update(entryFromInput: Object): Tasc{
        Object.assign(this, entryFromInput);
        return this;
    }

    toJson(): object{
        return JSON.parse(JSON.stringify(this));
    }
}

export default Tasc;
