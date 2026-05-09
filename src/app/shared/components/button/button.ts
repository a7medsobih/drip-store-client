import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  template: '<button type="button"><ng-content /></button>',
})
export class Button {}
