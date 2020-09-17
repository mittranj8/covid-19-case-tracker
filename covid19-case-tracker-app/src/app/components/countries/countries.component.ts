import { Component, OnInit } from "@angular/core";
import { DataServiceService } from "src/app/services/data-service.service";
import { GlobalDataSummary } from "src/app/models/global-data";
import { DateWiseData } from "src/app/models/date-wise-data";
import { merge } from "rxjs";
import { map } from "rxjs/operators";

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
  selectedConData: DateWiseData[];
  dateWiseData;
  loading = true;

  chart = {
    LineChart: "LineChart",
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: "out",
      },
      is3D: true,
    },
  };

  // options: {
  //   height: 500;
  //   animation: {
  //     duration: 1000;
  //     easing: "out";
  //   };
  // };

  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    // setting default country by merging subscriptions
    merge(
      this.service.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map((result: any) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues("US");
        this.loading = false;
      },
    });
  }

  updateValues(country: string) {
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
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
  }
}
