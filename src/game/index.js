import { OrthographicCamera } from 'three';
import { Game } from '@snakesilk/engine';
import { XMLLoader, Parser } from '@snakesilk/xml-loader';
import Characters from './Characters';
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

    function setupCharacters(contexts) {
        const context = contexts.reduce((all, context) => {
            return Object.assign(all, context);
        }, {});

        const Factory = Characters(context);

        const monk = Factory.Monk();
        heroes.push(monk);

        const dipsy = Factory.Dipsy();
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
            scene.camera.camera = new OrthographicCamera(-200, 200, 112, -112);
            scene.camera.position = scene.camera.camera.position;
            scene.camera.position.z = 500;
            scene.world.ambientLight.color.setRGB(0.1,0.1,0.1);
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
    const entities = Promise.all([
        loadEntities('/resources/characters/Monk.xml'),
        loadEntities('/resources/characters/Dipsy.xml'),
    ]);
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
