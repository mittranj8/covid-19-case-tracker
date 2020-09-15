import { Component, OnInit } from "@angular/core";
import { GlobalDataSummary } from "src/app/models/global-data";
import { DataServiceService } from "src/app/services/data-service.service";
import { GoogleChartInterface } from "ng2-google-charts";

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

  //adding charts to show data
  pieChart: GoogleChartInterface = {
    chartType: "PieChart",
  };

  columnChart: GoogleChartInterface = {
    chartType: "ColumnChart",
  };

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);
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
    });
  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }

  initChart(caseType: string) {
    let tableData = [];
    tableData.push(["Country", "Cases"]);

    this.globalData.forEach((cs) => {
      let value: number;
      // returning values based on selected case type with countries with more than 2000 cases
      if (caseType == "c") if (cs.confirmed > 2000) value = cs.confirmed;

      if (caseType == "r") if (cs.recovered > 2000) value = cs.recovered;

      if (caseType == "d") if (cs.deaths > 2000) value = cs.deaths;

      if (caseType == "a") if (cs.active > 2000) value = cs.active;

      tableData.push([cs.country, value]);
    });

    this.pieChart = {
      chartType: "PieChart",
      dataTable: tableData,
      options: {
        height: 500,
      },
    };

    this.columnChart = {
      chartType: "ColumnChart",
      dataTable: tableData,
      options: {
        height: 500,
      },
    };
  }
}
