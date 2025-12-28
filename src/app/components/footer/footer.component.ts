import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__col">
          <h3>SkinCare Helper</h3>
          <p class="muted">Your personal skincare companion</p>
        </div>

        <div class="footer__col">
          <h4>Pages</h4>
          <ul>
            <li><a routerLink="/">Shop</a></li>
            <li><a routerLink="/categories">Categories</a></li>
            <li><a routerLink="/brands">Brands</a></li>
            <li><a routerLink="/routine-builder">Routine Builder</a></li>
            <li><a routerLink="/notes">Notes</a></li>
            <li><a routerLink="/offers">Offers</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@skincarehelper.com">hello&#64;skincarehelper.com</a></li>
            <li><a href="#stores">Find Stores</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div class="container footer__bottom">
        <small>© 2025 SkinCare Helper. All rights reserved.</small>
      </div>
    </footer>
  `
})
export class FooterComponent {}
