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

  initChart() {
    let tableData = [];
    tableData.push(["Country", "Cases"]);

    this.globalData.forEach((cs) => {
      // display countries with more than 2000 cases
      if (cs.confirmed > 2000) {
        tableData.push([cs.country, cs.confirmed]);
      }
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
        this.initChart();
      },
    });
  }
}
