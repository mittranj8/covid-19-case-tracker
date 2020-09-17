import { Component, OnInit } from "@angular/core";
import { GlobalDataSummary } from "src/app/models/global-data";
import { DataServiceService } from "src/app/services/data-service.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  loading = true;
  tableData = [];

  //adding charts to show data
  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: "out",
      },
      is3D: true,
    },
  };

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        this.globalData = result;

        // displaying all cases in the component
        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        });
        this.initChart("c");
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }

  initChart(caseType: string) {
    // clearing chart data
    this.tableData = [];

    this.globalData.forEach((cs) => {
      let value: number;
      // returning values based on selected case type with countries with more than 2000 cases
      if (caseType == "c") if (cs.confirmed > 2000) value = cs.confirmed;

      if (caseType == "r") if (cs.recovered > 2000) value = cs.recovered;

      if (caseType == "d") if (cs.deaths > 2000) value = cs.deaths;

      if (caseType == "a") if (cs.active > 2000) value = cs.active;

      this.tableData.push([cs.country, value]);
    });
  }
}
