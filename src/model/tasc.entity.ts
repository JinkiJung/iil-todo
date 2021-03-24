enum TascState {
    None = 0,
    Active = 1,
    Focused = 2,
    Pending = 3,
    Done = 4
}

interface ITasc {
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
}

class Tasc implements ITasc{
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

    constructor(itasc : Partial<ITasc>){
        this.id = itasc.id || "";
        this.goal = itasc.goal || "";
        this.endWhen = itasc.endWhen || "";
        this.state = TascState.Active;
        this.given = itasc.given || "";
        this.startWhen = itasc.startWhen || "";
        this.act = itasc.act || "";
        this.actor = itasc.actor || "";
        this.guidedBy = itasc.guidedBy || "";
        this.produce = itasc.produce || "";
        this.leadTo = itasc.leadTo || "";
        this.order = itasc.order || -1;
    }
    /*
    constructor(id:string, actor: string, act: string,
        startWhen: string, endWhen: string, order: number){
        this.id = id;
        this.goal = "";
        this.endWhen = endWhen;
        this.state = TascState.Active;
        this.given = "";
        this.startWhen = startWhen;
        this.act = act;
        this.actor = actor;
        this.guidedBy = "";
        this.produce = "";
        this.leadTo = "";
        this.order = order;
    }*/

    update(entryFromInput: Object): Tasc{
        Object.assign(this, entryFromInput);
        return this;
    }

    toJson(): object{
        return JSON.parse(JSON.stringify(this));
    }
}

export default Tasc;
