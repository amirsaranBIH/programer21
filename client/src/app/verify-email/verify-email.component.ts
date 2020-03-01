import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  public emailVerifiedStatus;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.emailVerifiedStatus = this.route.snapshot.data.emailVerified;
  }

}
