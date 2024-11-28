interface Ability {
    getState(): object;
    use(): boolean;
    // HECTIC: Is used is the wrong paradigm if you want to call it that. This special state change should be handled by the ability itself, i.e. you should be passing the relevant input variables into the ability update function instead of controlling the ability from the outside using the variables. This is because there could be special input behavior which abilities want to use.
    update(): void;
}

export default Ability;