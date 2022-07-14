import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { fromEvent, Observable } from 'rxjs';

import { PREDATOR_COUNT, PREY_COUNT } from './constants/constants';
import getPredator, { Predator } from './objects/predator';
import getPrey, { Prey } from './objects/prey';
import { Rays } from './objects/rays';
import { Background } from './screens/background';
import { SimulationState } from './types/simulationState';
import addDebugListener, { isDebugModeEnabled } from './utils/addDebugListener';
import { generatePredators, generatePreys } from './utils/generateObjects';

@Component({
    selector: 'app-pixi',
    templateUrl: './pixi.component.html',
    styleUrls: ['./pixi.component.scss'],
})
export class PixiComponent implements AfterViewInit {
    @ViewChild('canvasWrapper')
    canvasWrapper!: ElementRef<HTMLDivElement>;

    app!: PIXI.Application;

    spriteSheet!: PIXI.Spritesheet;

    preys: Array<Prey> = [];
    predators: Array<Predator> = [];

    background = new Background();
    rays = new Rays();

    resizeOberserver$!: Observable<Event>;

    destroyPreyObserver$!: Observable<CustomEvent>;
    destroyPredatorObserver$!: Observable<CustomEvent>;

    createPreyObserver$!: Observable<CustomEvent>;
    createPredatorObserver$!: Observable<CustomEvent>;

    simulationState = SimulationState.initial;

    async ngAfterViewInit(): Promise<void> {
        this.initListener();

        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        this.canvasWrapper.nativeElement.appendChild(this.app.view);

        await new Promise((res) => {
            PIXI.Loader.shared.add('/assets/spritesheet.json').load(() => {
                this.spriteSheet = PIXI.Loader.shared.resources[
                    '/assets/spritesheet.json'
                ].spritesheet as PIXI.Spritesheet;

                res(true);
            });
        });

        this.initGameLoop();

        this.background.update(this.app.view.width, this.app.view.height);
    }

    initListener() {
        addDebugListener();

        this.resizeOberserver$ = fromEvent(window, 'resize');
        this.resizeOberserver$.subscribe(() => {
            this.app.resizeTo = window;
            this.background.update(this.app.view.width, this.app.view.height);
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

    initGameLoop() {
        this.app.stage.addChild(this.background);
        this.app.stage.addChild(this.rays);

        this.generateObjects();

        const { width, height } = this.app.view;

        this.app.ticker.add((deltaTime) => {
            this.preys.forEach((prey) => {
                prey.update(deltaTime, width, height, this.predators);
            });

            this.predators.forEach((predator) => {
                predator.update(deltaTime, width, height, this.preys);
            });

            if (isDebugModeEnabled) {
                this.rays.clearDrawing();
                this.rays.update(this.preys, this.predators);
                this.rays.update(this.predators, this.preys);
            } else {
                this.rays.clearDrawing();
            }
        });
    }

    generateObjects() {
        if (this.simulationState === SimulationState.running) {
            this.preys = generatePreys(
                PREY_COUNT,
                this.app.view.width,
                this.app.view.height,
                this.spriteSheet
            );

            this.predators = generatePredators(
                PREDATOR_COUNT,
                this.app.view.width,
                this.app.view.height,
                this.spriteSheet
            );

            this.preys.forEach((prey) => {
                this.app.stage.addChild(prey);
            });

            this.predators.forEach((predator) => {
                this.app.stage.addChild(predator);
            });
        }
    }

    createPrey({ x, y }: { x: number; y: number }) {
        const prey = getPrey(x, y, this.spriteSheet);
        this.preys.push(prey);

        this.app.stage.addChild(prey);
    }

    createPredator({ x, y }: { x: number; y: number }) {
        const predator = getPredator(x, y, this.spriteSheet);
        this.predators.push(predator);

        this.app.stage.addChild(predator);
    }

    destroyPrey(prey: Prey) {
        this.app.stage.removeChild(prey);

        this.preys = this.preys.filter((current) => current !== prey);
    }

    destroyPredator(predator: Predator) {
        this.app.stage.removeChild(predator);

        this.predators = this.predators.filter(
            (current) => current !== predator
        );
    }
}
