import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CountriesComponent } from "./components/countries/countries.component";
import { HomeComponent } from "./components/home/home.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "countries",
    component: CountriesComponent,
  },
  // redirect to `first-component`
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  // Wildcard route for a 404 page
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
