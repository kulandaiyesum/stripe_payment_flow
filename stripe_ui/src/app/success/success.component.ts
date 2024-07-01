import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
})
export class SuccessComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private session_id: string = '';
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.session_id = params['session_id'];
      console.log('session_id: ', this.session_id);
    });
  }
}
