import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'school-recommendation-system';
  form: FormGroup;

  currentStep = 0;
  showError = false;
  editing = true;
  loading = false;
  steps = [
    { complete: false, controls: ['firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber', 'email', 'nationality', 'state'] },
    { complete: false, controls: ['highSchool', 'gpa', 'classRank', 'standardizedTests', 'academicHonors', 'englishProficiency', 'otherLanguageProficiency'] },
    { complete: false, controls: ['desiredCareerPath', 'industryInterests', 'longTermGoals'] },
    { complete: false, controls: ['preferredDestinations'] },
    { complete: false, controls: ['essay'] },
    { complete: false, controls: [] },
  ];

  constructor() {
    this.form = new FormGroup({
      // Personal Information
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      nationality: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
    
      // Academic Background
      highSchool: new FormControl('', Validators.required),
      jambScore: new FormControl('', [Validators.required, Validators.min(0), Validators.max(400)]),
      jambSubjects: new FormControl('', Validators.required),
      waecScores: new FormControl('', Validators.required),
      standardizedTests: new FormControl('', Validators.required),
      academicHonors: new FormControl('', Validators.required),
      englishProficiency: new FormControl('', Validators.required),
      otherLanguageProficiency: new FormControl('', Validators.required),
    
      // Career Aspirations
      desiredCareerPath: new FormControl('', Validators.required),
      industryInterests: new FormControl('', Validators.required),
      longTermGoals: new FormControl('', Validators.required),
    
      // Study Abroad Preferences
      preferredDestinations: new FormControl('', Validators.required),
    
      // Personal Statement
      essay: new FormControl('', Validators.required),
    });    
  }

  nextStep() {
    const currentControls = this.steps[this.currentStep].controls;
    let isValid = true;
    for (const control of currentControls) {
      if (this.form.get(control)?.invalid) {
        isValid = false;
        this.form.get(control)?.markAsTouched();
      }
    }

    if (isValid) {
      this.steps[this.currentStep].complete = true;
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    } else {
      this.showError = true;

      setTimeout(() => {
        this.showError = false;
      }, 3000);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.steps[this.currentStep].complete = false;
      this.currentStep--;
    }
  }

  handleSubmit() {
    this.loading = true;
  }
}
