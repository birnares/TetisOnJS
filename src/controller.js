export class Controller {
    constructor(game, view) {
        this.game = game
        this.view = view
        this.intervalId = null
        this.isPlaying = false

        document.addEventListener('keydown', this.handelKeyDown.bind(this));
        document.addEventListener('keyup', this.handelKeyUp.bind(this));

        this.view.renderStartScreen()
    }

    updateView() {
        const state = this.game.getState()

        if(state.isGameOver) {
            this.view.renderEndGameScreen(state)
        } else {
            this.view.renderMainScreen(state)
        }
    }

    update() {
        this.game.movePieceDown()
        this.updateView()
    }

    play() {
        this.isPlaying = true
        this.startTimer()
        this.updateView()
    }

    pause() {
        this.isPlaying = false
        this.stopTimer()
        this.updateView()
        this.view.renderPauseScreen()
    }

    reset() {
        this.game.reset()
        this.play()
    }

    startTimer() {
        const state = this.game.getState()
        const speed = 1000 - state.level * 100

        if(!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update()
            }, speed > 0 ? speed : 100)
        }
    }

    stopTimer() {
        if(this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    handelKeyDown(event) {
        event.preventDefault()
        const state = this.game.getState()
        switch(event.keyCode) {
            case 13: // Enter
                if(state.isGameOver) {
                    this.reset()
                } else if(this.isPlaying) {
                    this.pause()
                } else {
                    this.play()
                }
                break
            case 37: // Left Arrow
                this.game.movePieceLeft()
                this.updateView()
                break
            case 38: // Up Arrow
                this.game.rotatePiece()
                this.updateView()
                break
            case 39: // Right Arrow
                this.game.movePieceRight()
                this.updateView()
                break
            case 40: // Down Arrow
                this.stopTimer()
                this.game.movePieceDown()
                this.updateView()
                break
        }
    }

    handelKeyUp(event) {
        event.preventDefault()
        switch(event.keyCode) {
            case 40: // Down Arrow
            this.startTimer()
            break
        }
    }
}