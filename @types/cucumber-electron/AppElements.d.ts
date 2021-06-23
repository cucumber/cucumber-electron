export = AppElements;
declare class AppElements {
    /**
     * @private
     */
    private fakeBrowserElements;
    /**
     * Creates a new DOM node that looks like a browser window and adds it to the DOM.
     *
     * @param {Document} document the DOM document
     * @param {string} title the title of the top bar
     * @return {HTMLElement} a DOM node that can be used to mount a DOM application such as a React or Vue element.
     */
    create(document: Document, title: string): HTMLElement;
    /**
     * Destroys all previously created app elements.
     */
    destroyAll(): void;
}
