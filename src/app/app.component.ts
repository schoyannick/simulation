import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import Predator, { PREDATOR_RADIUS } from './objects/predator';
import Prey, { PREY_RADIUS } from './objects/prey';
import areCircleColliding from './utils/areCircleColliding';

const PREY_COUNT = 5;
const PREDATOR_COUNT = 5;

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

    ngAfterViewInit(): void {
        this.ctx = this.canvas.nativeElement.getContext(
            '2d'
        ) as CanvasRenderingContext2D;

        this.setCanvasDimensions();

        const predators = this.generatePredators();
        const preys = this.generatePreys();

        this.objects.push(...preys, ...predators);

        this.loop(0);
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

    generatePreys(): Array<Prey> {
        const preys: Array<Prey> = [];

        while (preys.length < PREY_COUNT) {
            const prey = new Prey(
                Math.floor(
                    Math.random() * (this.width / 3 - PREY_RADIUS * 2) +
                        PREY_RADIUS
                ),
                Math.floor(
                    Math.random() * (this.height - PREY_RADIUS * 2) +
                        PREY_RADIUS
                )
            );
            if (!areCircleColliding(prey.x, prey.y, preys)) {
                preys.push(prey);
            }
        }

        return preys;
    }

    generatePredators(): Array<Predator> {
        const predators: Array<Predator> = [];

        while (predators.length < PREDATOR_COUNT) {
            const minX = this.width / 2;
            const predator = new Predator(
                Math.floor(
                    Math.random() * (minX - PREDATOR_RADIUS * 2) +
                        PREDATOR_RADIUS +
                        minX
                ),
                Math.floor(
                    Math.random() * (this.height - PREDATOR_RADIUS * 2) +
                        PREDATOR_RADIUS
                )
            );
            if (!areCircleColliding(predator.x, predator.y, predators)) {
                predators.push(predator);
            }
        }

        return predators;
    }

    deleteObject(object: Prey | Predator) {
        this.objects = this.objects.filter((current) => current !== object);
    }
}
