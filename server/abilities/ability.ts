interface Ability {
    getState(): object;
    use(): void;
    update(): void;
}

export default Ability;