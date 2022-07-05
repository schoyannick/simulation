import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import {
    PREY_WIDTH,
    PREY_HEIGHT,
    PREY_COUNT,
    PREDATOR_COUNT,
} from './constants/constants';
import EndScreen from './screens/endScreen';
import Hud from './objects/hud';
import Predator from './objects/predator';
import Prey from './objects/prey';
import StartScreen from './screens/startScreen';
import addDebugListener from './utils/addDebugListener';
import { generatePredators, generatePreys } from './utils/generateObjects';
import Background from './screens/background';

enum SimulationState {
    initial,
    running,
    ended,
}

@Component({
    selector: 'app-prey-vs-predator',
    templateUrl: './prey-vs-predator.component.html',
    styleUrls: ['./prey-vs-predator.component.scss'],
})
export class PreyVsPredatorComponent implements OnInit {
    @ViewChild('canvas')
    canvas!: ElementRef<HTMLCanvasElement>;
    ctx!: CanvasRenderingContext2D;

    @ViewChild('backgroundCanvas')
    backgroundCanvas!: ElementRef<HTMLCanvasElement>;
    backgroundCtx!: CanvasRenderingContext2D;

    height = window.innerHeight;
    width = window.innerWidth;

    preys: Array<Prey> = [];
    predators: Array<Predator> = [];

    hud = new Hud();

    background = new Background();
    startScreen = new StartScreen();
    endScreen = new EndScreen();

    time = 0;

    simulationState = SimulationState.initial;

    resizeOberserver$!: Observable<Event>;

    destroyPreyObserver$!: Observable<CustomEvent>;
    destroyPredatorObserver$!: Observable<CustomEvent>;

    createPreyObserver$!: Observable<CustomEvent>;
    createPredatorObserver$!: Observable<CustomEvent>;

    spriteSheet: HTMLImageElement = new Image();

    ngOnInit() {
        this.initListener();
    }

    async ngAfterViewInit(): Promise<void> {
        this.spriteSheet = new Image();
        this.spriteSheet.src = '/assets/spritesheet.png';

        const spriteSheetLoaded = new Promise<void>((res) => {
            this.spriteSheet!.addEventListener('load', () => {
                res();
            });
        });

        await spriteSheetLoaded;

        this.ctx = this.canvas.nativeElement.getContext(
            '2d'
        ) as CanvasRenderingContext2D;

        this.backgroundCtx = this.backgroundCanvas.nativeElement.getContext(
            '2d'
        ) as CanvasRenderingContext2D;

        this.startScreen.spriteSheet = this.spriteSheet;

        this.setCanvasDimensions();
        this.addClickListener();

        addDebugListener();

        this.loop(0);
    }

    initListener() {
        this.resizeOberserver$ = fromEvent(window, 'resize');
        this.resizeOberserver$.subscribe(() => {
            this.setCanvasDimensions();
        });

        this.createPreyObserver$ = fromEvent<CustomEvent>(window, 'createPrey');
        this.createPreyObserver$.subscribe((event) => {
            this.createPrey(event.detail);
        });

        this.createPredatorObserver$ = fromEvent<CustomEvent>(
            window,
            'createPredator'
        );
        this.createPredatorObserver$.subscribe((event) => {
            this.createPredator(event.detail);
        });

        this.destroyPreyObserver$ = fromEvent<CustomEvent>(
            window,
            'destroyPrey'
        );
        this.destroyPreyObserver$.subscribe((event) => {
            this.destroyPrey(event.detail);
        });

        this.destroyPredatorObserver$ = fromEvent<CustomEvent>(
            window,
            'destroyPredator'
        );
        this.destroyPredatorObserver$.subscribe((event) => {
            this.destroyPredator(event.detail);
        });
    }

    addClickListener() {
        this.canvas.nativeElement.addEventListener('click', async (event) => {
            const rect = this.canvas.nativeElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.simulationState === SimulationState.running) {
                const preysAndPredators = [...this.preys, ...this.predators];

                const offset = 8;
                const clickedObject = preysAndPredators.find((obj) => {
                    return (
                        x > obj.x - offset &&
                        x < obj.x + PREY_WIDTH + offset &&
                        y > obj.y - offset &&
                        y < obj.y + PREY_HEIGHT + offset
                    );
                });

                this.hud.setActiveObject(clickedObject || null);
            } else {
                const button = this.getShownButtonPos();

                if (
                    x >= button.x &&
                    x <= button.x + button.width &&
                    y >= button.y &&
                    y <= button.y + button.height
                ) {
                    this.preys = [];
                    this.predators = [];
                    await this.generatePreysAndPredators();
                    this.simulationState = SimulationState.running;
                }
            }
        });
    }

    loop(timestamp: number): void {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const deltaTime = timestamp - this.time;
        this.time = timestamp;

        this.update(deltaTime);

        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    setCanvasDimensions(): void {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.canvas.nativeElement.height = this.height;
        this.canvas.nativeElement.width = this.width;

        this.backgroundCanvas.nativeElement.height = window.innerHeight;
        this.backgroundCanvas.nativeElement.width = window.innerWidth;

        this.background.update(window.innerWidth, window.innerHeight);
        this.background.draw(this.backgroundCtx);
    }

    update(deltaTime: number): void {
        if (this.simulationState === SimulationState.running) {
            // Predators won
            if (this.preys.length === 0) {
                this.simulationState = SimulationState.ended;
                return;
            }

            // Preys won
            if (this.predators.length === 0) {
                this.simulationState = SimulationState.ended;
                return;
            }

            this.preys.forEach((prey) => {
                prey.update(deltaTime, this.width, this.height, this.predators);
            });

            this.predators.forEach((predator) => {
                predator.update(deltaTime, this.width, this.height, this.preys);
            });

            const preysAndPredators = [...this.preys, ...this.predators];
            this.hud.update(preysAndPredators);
        } else if (this.simulationState === SimulationState.initial) {
            this.startScreen.update(this.width, this.height);
        } else if (this.simulationState === SimulationState.ended) {
            this.endScreen.update(
                this.width,
                this.height,
                this.preys.length === 0 ? 'Predator' : 'Prey'
            );
        }
    }

    draw(): void {
        switch (this.simulationState) {
            case SimulationState.initial: {
                this.startScreen.draw(this.ctx, this.width, this.height);
                break;
            }
            case SimulationState.running: {
                this.preys.forEach((prey) => {
                    prey.draw(this.ctx, this.predators);
                });

                this.predators.forEach((predator) => {
                    predator.draw(this.ctx, this.preys);
                });

                this.hud.draw(this.ctx);
                break;
            }
            case SimulationState.ended: {
                this.preys.forEach((prey) => {
                    prey.draw(this.ctx, this.predators);
                });

                this.predators.forEach((predator) => {
                    predator.draw(this.ctx, this.preys);
                });

                this.hud.draw(this.ctx);

                this.endScreen.draw(this.ctx, this.width, this.height);
                break;
            }
            default:
                throw new Error(
                    `this SimulationState is not implemented: ${this.simulationState}]`
                );
        }
    }

    createPrey(prey: Prey) {
        this.preys.push(prey);
    }

    createPredator(predator: Predator) {
        this.predators.push(predator);
    }

    destroyPrey(prey: Prey) {
        this.preys = this.preys.filter((current) => current !== prey);
    }

    destroyPredator(predator: Predator) {
        this.predators = this.predators.filter(
            (current) => current !== predator
        );
    }

    async generatePreysAndPredators(): Promise<void> {
        await Promise.all([
            generatePredators(
                PREDATOR_COUNT,
                this.width,
                this.height,
                this.spriteSheet
            ),
            generatePreys(
                PREY_COUNT,
                this.width,
                this.height,
                this.spriteSheet
            ),
        ]).then(([predators, preys]) => {
            this.preys.push(...preys);
            this.predators.push(...predators);
        });
    }

    getShownButtonPos(): {
        x: number;
        y: number;
        width: number;
        height: number;
    } {
        if (this.simulationState === SimulationState.initial) {
            return this.startScreen.startButton;
        }
        return this.endScreen.restartButton;
    }
}
