import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard-card",
  templateUrl: "./dashboard-card.component.html",
  styleUrls: ["./dashboard-card.component.css"],
})
export class DashboardCardComponent implements OnInit {
  @Input("totalConfirmed")
  totalConfirmed = 0;
  @Input("totalDeaths")
  totalDeaths = 0;
  @Input("totalRecovered")
  totalRecovered = 0;
  @Input("totalActive")
  totalActive = 0;

  constructor() {}

  ngOnInit(): void {}
}
