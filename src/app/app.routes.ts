import { Routes } from '@angular/router';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { NotesComponent } from './pages/notes/notes.component';
import { RoutineBuilderComponent } from './pages/routine-builder/routine-builder.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { OffersComponent } from './pages/offers/offers.component';

export const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'routine-builder', component: RoutineBuilderComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'offers', component: OffersComponent },
  { path: '**', redirectTo: '' }
];
