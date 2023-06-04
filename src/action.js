export class Action{
    constructor(name, engine){
        this.internalName = name;
        this.engine = engine;
    }
    name(){
        return this.internalName;
    }
    
    act(layer, controls){
        throw new Error('.act() must be implemented in the filter class');
    }
    
    merge(pixelsA, pixelsB, mode){
        return this.engine.merge(pixelsA, pixelsB, mode);
    }
    
    getControls(){
        return {};
    }
    
    getLabel(){
        return this.name().split('-').map((str)=>str.substring(0, 1).toUpperCase()+str.substring(1)).join(' ');
    }
};