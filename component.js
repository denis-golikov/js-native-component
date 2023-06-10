'use strict'

import Nil from "./nil"

class Component {
    /**
     * @private
     * @const
     * @type {Object.<String, String>}
     */
    static bindingMarker = {
        attribute: 'data-binding-marker',
        field: 'bindingMarker'
    }
    /**
     * @private
     * @const
     * @type {Object.<String, String>}
     */
    static childMarker = {
        attribute: 'data-child-marker',
        field: 'childMarker'
    }

    /**
     * @protected
     * @property
     * @type {HTMLElement}
     */
    element

    /**
     * @private
     * @property
     * @type {Object.<String|Number, String|HTMLElement>}
     */
    bindingMap = {}

    /**
     * @private
     * @property
     */
    childrenMap = {}

    /**
     * @protected
     * @abstract
     * @function
     * @return {Object.<String, Component>|Array.<Component>}
     */
    children() {
        return {}
    }

    /**
     * @protected
     * @abstract
     * @function
     * @return {String}
     */
    view() {
        return ''
    }

    /**
     * @protected
     * @abstract
     * @function
     */
    initialize() {
    }

    /**
     * @public
     * @function
     * @param {String|HTMLElement} element
     * @return void
     * @throws {Error}
     */
    compileInto(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element)
        }
        element.insertAdjacentHTML('beforebegin', this.view())
        this.element = element.previousElementSibling
        element.remove()
        this.compile()
    }

    /**
     * @protected
     * @function
     * @param {String|Number} name
     * @return {String} bindMark
     */
    bind(name) {
        this.bindingMap[name] = this.generateBindMarker()

        return this.bindingMap[name]
    }

    /**
     * @protected
     * @function
     * @param {String|Number} name
     * @return {HTMLElement}
     * @throws {Error}
     */
    getBind(name) {
        if (!this.bindingMap[name]) {
            throw new Error(`В ${this.getName()} отсутствует связанный элемент с именем ${name}`)
        }

        return this.bindingMap[name]
    }

    /**
     * @protected
     * @function
     * @param {String|Number} name
     * @throws {Error}
     */
    getChild(name) {
        if (!this.childrenMap[name]) {
            throw new Error(`В ${this.getName()} отсутствует дочерний компонент с именем ${name}`)
        }

        return this.childrenMap[name]
    }

    /**
     * @private
     * @function
     * @return void
     * @throws {Error}
     */
    compile() {
        this.binding()
        this.compileChildren()
        this.initialize()
    }

    /**
     * @private
     * @function
     * @return void
     */
    binding() {
        for (const [alias, marker] of Object.entries(this.bindingMap)) {
            this.bindingMap[alias] = this.element.querySelector(`[${marker}]`)
            delete this.bindingMap[alias].dataset[Component.bindingMarker.field]
        }
    }

    /**
     * @private
     * @function
     * @return void
     * @throws {Error}
     */
    compileChildren() {
        if (typeof this.children() === Nil) {
            return
        }

        for (const [name, component] of Object.entries(this.children())) {
            component.compileInto(this.element.querySelector(name))
            this.childrenMap[name] = component
        }
    }

    /**
     * @private
     * @function
     * @return {String}
     */
    generateBindMarker() {
        return `${Component.bindingMarker.attribute}="${this.generateUid()}"`
    }

    /**
     * @private
     * @function
     * @return {String}
     */
    generateUid() {
        return `${(~~(Math.random()*1e8)).toString(16)}`
    }

    /**
     * @private
     * @function
     * @return {String}
     */
    getName() {
        return this.constructor.name
    }
}

export default Component
