import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  activeTab: string = 'user-metrics';

  userMetricsAge = [
    { age: '18-25', count: 120 },
    { age: '26-35', count: 200 },
    { age: '36-50', count: 80 }
  ];
  userMetricsGoals = [
    { label: 'Perte de poids', value: '60%' },
    { label: 'Prise de masse', value: '25%' },
    { label: 'Remise en forme', value: '15%' }
  ];
  userMetricsProgress = 70;

  nutritionData = [
    { nutriment: 'Calories', value: '2100 kcal' },
    { nutriment: 'Protéines', value: '90 g' },
    { nutriment: 'Glucides', value: '250 g' },
    { nutriment: 'Lipides', value: '70 g' }
  ];
  nutritionAdvice = 'Encouragez les utilisateurs à équilibrer leurs apports pour de meilleurs résultats santé.';

  fitnessStats = [
    { label: 'Nombre moyen de séances/semaine', value: '3,5' },
    { label: 'Durée moyenne d\'une séance', value: '45 min' },
    { label: 'Activité la plus pratiquée', value: 'Cardio' }
  ];
  fitnessProgress = 55;
  fitnessTip = 'Astuce : Proposez des défis mensuels pour motiver les utilisateurs !';

  kpiData = [
    { label: 'Taux de rétention mensuel', value: '82%' },
    { label: 'Nombre d\'abonnés premium', value: '320' },
    { label: 'Revenu mensuel récurrent (MRR)', value: '4 800 €' }
  ];
  kpiAdvice = 'Le taux de conversion des essais gratuits reste stable à 12%. Envisagez une campagne marketing ciblée.';
}
