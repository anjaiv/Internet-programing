import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

interface RoutineStep {
  step: number;
  product: string;
  description: string;
}

@Component({
  selector: 'app-routine-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './routine-builder.component.html'
})
export class RoutineBuilderComponent {
  private toastService = inject(ToastService);

  skinType = '';
  goal = '';
  budget = '';

  morningRoutine: RoutineStep[] = [];
  eveningRoutine: RoutineStep[] = [];

  activeTab: 'morning' | 'evening' = 'morning';
  showResults = false;

  generateRoutine(): void {
    if (!this.skinType || !this.goal || !this.budget) {
      alert('Please fill all fields');
      return;
    }

    this.morningRoutine = this.getMorningRoutine();
    this.eveningRoutine = this.getEveningRoutine();
    this.showResults = true;
    this.toastService.show('Routine generated ✨');
  }

  getMorningRoutine(): RoutineStep[] {
    const base: RoutineStep[] = [
      { step: 1, product: 'Cleanser', description: `Gentle ${this.skinType.toLowerCase()} skin cleanser` },
      { step: 2, product: 'Serum', description: this.getSerumForGoal() },
      { step: 3, product: 'Moisturizer', description: `Hydrating cream for ${this.skinType.toLowerCase()} skin` },
      { step: 4, product: 'SPF', description: 'Broad spectrum SPF 30+' }
    ];
    return base;
  }

  getEveningRoutine(): RoutineStep[] {
    const base: RoutineStep[] = [
      { step: 1, product: 'Cleanser', description: `Gentle ${this.skinType.toLowerCase()} skin cleanser` },
      { step: 2, product: 'Treatment', description: this.getTreatmentForGoal() },
      { step: 3, product: 'Serum', description: this.getSerumForGoal() },
      { step: 4, product: 'Night Cream', description: `Nourishing night cream for ${this.skinType.toLowerCase()} skin` }
    ];
    return base;
  }

  getSerumForGoal(): string {
    const serums: Record<string, string> = {
      'hydration': 'Hyaluronic Acid for deep hydration',
      'acne': 'Niacinamide 10% for blemish control',
      'anti-aging': 'Vitamin C for brightness and anti-aging',
      'brightening': 'Vitamin C and Alpha Arbutin for radiance',
      'texture': 'Niacinamide for texture refinement'
    };
    return serums[this.goal] || 'Multi-benefit serum';
  }

  getTreatmentForGoal(): string {
    const treatments: Record<string, string> = {
      'hydration': 'Hydrating essence',
      'acne': 'Salicylic Acid 2% for acne treatment',
      'anti-aging': 'Retinol 0.5% for anti-aging',
      'brightening': 'Alpha Arbutin for brightening',
      'texture': 'Lactic Acid 5% for gentle exfoliation'
    };
    return treatments[this.goal] || 'Treatment serum';
  }
}
