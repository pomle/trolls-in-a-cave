import { Game } from '@snakesilk/engine';
import { XMLLoader, Parser } from '@snakesilk/xml-loader';
import { AnimationRouter, Move } from '@snakesilk/top-down-traits';
import DPAD from './Dpad';

const dpad = new DPAD();
dpad.listen(window);

export function createGame() {
    let controllable;
    const heroes = [];

    function loadScene(url) {
        return loader.asyncLoadXML(url)
        .then(doc => doc.children[0])
        .then(node => sceneParser.getScene(node))
        .then(context => context.scene);
    }

    function loadEntities(url) {
        return loader.asyncLoadXML(url)
        .then(doc => doc.children[0])
        .then(node => entityParser.getObjects(node));
    }

    function switchCharacter() {
        let index = heroes.findIndex(hero => hero === controllable);
        controllable = heroes[++index % heroes.length];
    }

    function setupCharacters(context) {
        const gipsy = new context['Monk'].constructor();
        gipsy.applyTrait(new AnimationRouter());
        gipsy.applyTrait(new Move());
        gipsy.move.speed = 60;
        heroes.push(gipsy);

        const dipsy = new context['Monk'].constructor();
        dipsy.applyTrait(new Move());
        dipsy.move.speed = 100;
        heroes.push(dipsy);

        switchCharacter();
    }

    function startLevel(level) {
        Promise.all([
            loadScene(`/resources/${level}.xml`),
            entities,
        ])
        .then(([scene]) => {
            heroes.forEach(hero => {
                hero.position.z = 1;
                scene.world.addObject(hero);
            });
            window.addEventListener('keydown', event => {
                if (event.keyCode === 9) {
                    event.preventDefault();
                    switchCharacter();
                }
            });
            trolls.setScene(scene);
        });
    }

    dpad.on('change', dir => {
        if (!controllable) {
            return;
        }
        controllable.move.aim.copy(dir);
    });

    const trolls = new Game();
    const loader = new XMLLoader(trolls);
    loader.textureScale = 4;

    const entityParser = new Parser.EntityParser(loader);
    const sceneParser = new Parser.SceneParser(loader);
    const entities = loadEntities('/resources/characters/Characters.xml');
    entities.then(setupCharacters);

    loadScene('/resources/intro.xml')
    .then(scene => {
        function start() {
            window.removeEventListener('keydown', start);

            startLevel('level1');
        }
        window.addEventListener('keydown', start);
        trolls.setScene(scene);
    });

    return trolls;
}
