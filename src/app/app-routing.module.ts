import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreyVsPredatorComponent } from './prey-vs-predator/prey-vs-predator.component';

const routes: Routes = [
    { path: '', component: PreyVsPredatorComponent },

    { path: 'prey', component: PreyVsPredatorComponent },
    { path: 'predator', component: PreyVsPredatorComponent },
    { path: 'preyvspredator', component: PreyVsPredatorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
