import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import Predator, { PREDATOR_HEIGHT, PREDATOR_WIDTH } from './objects/predator';
import Prey, { PREY_HEIGHT, PREY_WIDTH } from './objects/prey';
import areObjectsColliding from './utils/areObjectsColliding';

const PREY_COUNT = 50;
const PREDATOR_COUNT = 20;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    @ViewChild('canvas')
    canvas!: ElementRef<HTMLCanvasElement>;

    ctx!: CanvasRenderingContext2D;

    height = window.innerHeight - 200;
    width = window.innerWidth - 20;

    objects: Array<Prey> = [];

    time = 0;

    resizeOberserver$!: Observable<Event>;
    deleteObserver$!: Observable<CustomEvent>;

    ngOnInit() {
        this.initListener();
    }

    async ngAfterViewInit(): Promise<void> {
        this.ctx = this.canvas.nativeElement.getContext(
            '2d'
        ) as CanvasRenderingContext2D;

        this.setCanvasDimensions();

        Promise.all([this.generatePredators(), this.generatePreys()]).then(
            ([predators, preys]) => {
                this.objects.push(...preys, ...predators);
                this.loop(0);
            }
        );
    }

    initListener() {
        this.resizeOberserver$ = fromEvent(window, 'resize');
        this.resizeOberserver$.subscribe(() => {
            this.setCanvasDimensions();
        });

        this.deleteObserver$ = fromEvent<CustomEvent>(window, 'destroy');
        this.deleteObserver$.subscribe((event) => {
            this.deleteObject(event.detail);
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
        this.height = window.innerHeight - 50;
        this.width = window.innerWidth - 20;
        this.canvas.nativeElement.height = this.height;
        this.canvas.nativeElement.width = this.width;
    }

    update(deltaTime: number): void {
        this.objects.forEach((object) => {
            const otherObjects = this.objects.filter(
                (current) => current !== object
            );
            object.update(deltaTime, this.width, this.height, otherObjects);
        });
    }

    draw(): void {
        this.objects.forEach((object) => {
            object.draw(this.ctx);
        });
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

            if (!areObjectsColliding(prey.x, prey.y, preys)) {
                preys.push(prey);
            }
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
            const minX = this.width / 2;
            const x =
                Math.floor(Math.random() * (minX + PREDATOR_WIDTH)) + minX;
            const y = Math.floor(
                Math.random() * (this.height - PREDATOR_HEIGHT)
            );

            const predator = new Predator(x, y, predatorImage);
            if (!areObjectsColliding(predator.x, predator.y, predators)) {
                predators.push(predator);
            }
        }

        return predators;
    }

    deleteObject(object: Prey | Predator) {
        this.objects = this.objects.filter((current) => current !== object);
    }
}
