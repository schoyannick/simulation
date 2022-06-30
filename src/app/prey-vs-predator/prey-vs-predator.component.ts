import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import Hud from './objects/hud';
import Predator, { PREDATOR_HEIGHT, PREDATOR_WIDTH } from './objects/predator';
import Prey, { PREY_HEIGHT, PREY_WIDTH } from './objects/prey';

const PREY_COUNT = 5;
const PREDATOR_COUNT = 5;

@Component({
    selector: 'app-prey-vs-predator',
    templateUrl: './prey-vs-predator.component.html',
    styleUrls: ['./prey-vs-predator.component.scss'],
})
export class PreyVsPredatorComponent implements OnInit {
    @ViewChild('canvas')
    canvas!: ElementRef<HTMLCanvasElement>;

    ctx!: CanvasRenderingContext2D;

    height = window.innerHeight - 100;
    width = window.innerWidth - 40;

    preys: Array<Prey> = [];
    predators: Array<Predator> = [];

    hud = new Hud();

    time = 0;

    resizeOberserver$!: Observable<Event>;

    destroyPreyObserver$!: Observable<CustomEvent>;
    destroyPredatorObserver$!: Observable<CustomEvent>;

    createPreyObserver$!: Observable<CustomEvent>;
    createPredatorObserver$!: Observable<CustomEvent>;

    ngOnInit() {
        this.initListener();
    }

    async ngAfterViewInit(): Promise<void> {
        this.ctx = this.canvas.nativeElement.getContext(
            '2d'
        ) as CanvasRenderingContext2D;

        this.setCanvasDimensions();
        this.addClickListener();

        Promise.all([this.generatePredators(), this.generatePreys()]).then(
            ([predators, preys]) => {
                this.preys.push(...preys);
                this.predators.push(...predators);
                this.loop(0);
            }
        );
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
        this.canvas.nativeElement.addEventListener('click', (event) => {
            const preysAndPredators = [...this.preys, ...this.predators];
            const rect = this.canvas.nativeElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

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
        this.height = window.innerHeight - 100;
        this.width = window.innerWidth - 40;
        this.canvas.nativeElement.height = this.height;
        this.canvas.nativeElement.width = this.width;
    }

    update(deltaTime: number): void {
        this.preys.forEach((prey) => {
            prey.update(deltaTime, this.width, this.height);
        });

        this.predators.forEach((predator) => {
            predator.update(deltaTime, this.width, this.height, this.preys);
        });

        const preysAndPredators = [...this.preys, ...this.predators];
        this.hud.update(preysAndPredators);
    }

    draw(): void {
        this.preys.forEach((prey) => {
            prey.draw(this.ctx);
        });

        this.predators.forEach((predator) => {
            predator.draw(this.ctx);
        });

        this.hud.draw(this.ctx);
    }

    async generatePreys(): Promise<Array<Prey>> {
        const preyImage = new Image();
        preyImage.src = '/assets/prey.png';

        const imageLoaded = new Promise<void>((res) => {
            preyImage.addEventListener('load', () => {
                res();
            });
        });

        await imageLoaded;

        const preys: Array<Prey> = [];

        while (preys.length < PREY_COUNT) {
            const x = Math.floor(Math.random() * (this.width / 3 - PREY_WIDTH));
            const y = Math.floor(Math.random() * (this.height - PREY_HEIGHT));
            const prey = new Prey(x, y, preyImage);
            preys.push(prey);
        }

        return preys;
    }

    async generatePredators(): Promise<Array<Predator>> {
        const predatorImage = new Image();
        predatorImage.src = '/assets/predator.png';

        const imageLoaded = new Promise<void>((res) => {
            predatorImage.addEventListener('load', () => {
                res();
            });
        });

        await imageLoaded;

        const predators: Array<Predator> = [];

        while (predators.length < PREDATOR_COUNT) {
            const minX = this.width / 2 - 10;
            const x =
                Math.floor(
                    Math.random() * (this.width - minX - PREDATOR_WIDTH)
                ) + minX;
            const y = Math.floor(
                Math.random() * (this.height - PREDATOR_HEIGHT)
            );

            const predator = new Predator(x, y, predatorImage);
            predators.push(predator);
        }

        return predators;
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
}
