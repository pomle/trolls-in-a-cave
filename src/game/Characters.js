import { AnimationRouter, Move, Torch } from '@snakesilk/top-down-traits';

export default function CharacterFactory(entities) {
    return {
        Monk: function() {
            const monk = new entities['Monk'].constructor();
            monk.applyTrait(new AnimationRouter());
            monk.applyTrait(new Move());
            monk.applyTrait(new Torch());
            monk.torch.origin.set(7, 6, 10);
            monk.move.speed = 60;
            return monk;
        },
        Dipsy: function() {
            const dipsy = new entities['Dipsy'].constructor();
            dipsy.applyTrait(new AnimationRouter());
            dipsy.applyTrait(new Move());
            dipsy.move.speed = 100;
            return dipsy;
        },
    };
};

