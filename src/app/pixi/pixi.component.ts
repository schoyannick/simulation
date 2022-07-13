import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { fromEvent, Observable } from 'rxjs';
import { Predator } from './objects/predator';
import getPrey, { Prey } from './objects/prey';
import { Rays } from './objects/rays';
import { Background } from './screens/background';

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

        this.generateObjects();

        this.initGameLoop();

        this.background.update(this.app.view.width, this.app.view.height);
    }

    initListener() {
        this.resizeOberserver$ = fromEvent(window, 'resize');
        this.resizeOberserver$.subscribe(() => {
            this.app.resizeTo = window;
            this.background.update(this.app.view.width, this.app.view.height);
        });
    }

    initGameLoop() {
        this.app.stage.addChild(this.background);
        this.app.stage.addChild(this.rays);

        const { width, height } = this.app.view;

        this.preys.push(getPrey());

        this.preys.forEach((prey) => {
            this.app.stage.addChild(prey);

            this.app.ticker.add((deltaTime: number) =>
                prey.update(deltaTime, width, height, this.predators)
            );
        });

        // let time = 0;
        // this.app.ticker.add((deltaTime: number) => {
        //     time += deltaTime;
        //     if (time > 5) {
        //         this.rays.update(this.preys);
        //         time = 0;
        //     }
        // });
    }

    generateObjects() {}
}
