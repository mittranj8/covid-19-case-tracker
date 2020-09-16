import { Component, OnInit } from "@angular/core";
import { GoogleChartInterface } from "ng2-google-charts";
import { DateWiseData } from "src/app/models/date-wise-data";
import { GlobalDataSummary } from "src/app/models/global-data";
import { DataServiceService } from "src/app/services/data-service.service";

@Component({
  selector: "app-countries",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.css"],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dateWiseData: {};
  selectedConData: DateWiseData[];
  lineChart: GoogleChartInterface = {
    chartType: "LineChart",
  };

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getDateWiseData().subscribe((result) => {
      this.dateWiseData = result;
      this.updateChart();
    });

    this.dataService.getGlobalData().subscribe((result) => {
      this.data = result;
      this.data.forEach((cs) => {
        this.countries.push(cs.country);
      });
    });
  }

  updateValues(country: string) {
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalRecovered = cs.recovered;
        this.totalDeaths = cs.deaths;
        this.totalConfirmed = cs.confirmed;
      }
    });
    this.selectedConData = this.dateWiseData[country];
    this.updateChart();
  }

  updateChart() {
    let dataTable = [];
    dataTable.push(["Date", "Cases"]);
    this.selectedConData.forEach((cs) => {
      dataTable.push([cs.date, cs.cases]);
    });

    this.lineChart = {
      chartType: "LineChart",
      dataTable: dataTable,
      options: {
        height: 500,
      },
    };
  }
}
