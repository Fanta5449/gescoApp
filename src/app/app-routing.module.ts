import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { EditNoteComponent } from './edit-note/edit-note.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route pour la page Login
  { path: 'admin', component: AdminComponent }, // Route pour la page Admin
  { path: 'notes', component: EditNoteComponent }, // Route pour la page Notes
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut vers Login
  { path: '**', redirectTo: '/login' } // Redirection pour les routes non trouvées
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}