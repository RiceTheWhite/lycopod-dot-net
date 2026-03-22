export class InputManager {
    private pressedKeys = new Set<string>()

    constructor() {
        // CSR
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', this.handleKeyDown)
            window.addEventListener('keyup', this.handleKeyUp)
        }
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        this.pressedKeys.add(e.key.toLowerCase())
    }

    private handleKeyUp = (e: KeyboardEvent) => {
        this.pressedKeys.delete(e.key.toLowerCase())
    }


    isPressed(key: string): boolean {
        return this.pressedKeys.has(key.toLowerCase())
    }


    destroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keydown', this.handleKeyDown)
            window.removeEventListener('keyup', this.handleKeyUp)
        }
    }
}