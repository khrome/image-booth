export class Brush {
    constructor(name, engine){
        this.internalName = name;
        this.engine = engine;
    }
    
    name(){
        return this.internalName;
    }
    
    kernel(controls){
       throw new Error('.kernel() must be implemented in the brush class');
    }
    
    getControls(){
        return {};
    }
    
    getLabel(){
        return this.name().split('-').map((str)=>str.substring(0, 1).toUpperCase()+str.substring(1)).join(' ');
    }
};