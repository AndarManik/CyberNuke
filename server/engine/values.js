const values = {
    game: {
        tick: 128,
    },
    abilities: {
        a: {
            meleeAttack: {
                cooldown: 4,
                castRange: 50,
                damage: 100,
                timeToHit: 0.1,
            },
            rangeAttack: {
                cooldown: 3,
                castRange: 100,
                damage: 60,
                movespeed: 450,

            }
        }
    }
};
//CALM: make the other parts of the game use this
module.exports = values;
