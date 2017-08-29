import { Game } from '@snakesilk/engine';
import { XMLLoader, Parser } from '@snakesilk/xml-loader';

export function createGame() {
    function loadScene(url) {
        return loader.asyncLoadXML(url)
        .then(doc => doc.children[0])
        .then(node => sceneParser.getScene(node))
        .then(context => {
            console.log('Scene', context);
            trolls.setScene(context.scene);
        });
    }

    const trolls = new Game();
    const loader = new XMLLoader(trolls);
    const sceneParser = new Parser.SceneParser(loader);

    loadScene('/resources/intro.xml');

    return trolls;
}
