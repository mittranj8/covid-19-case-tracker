import { Component, OnInit } from "@angular/core";
import { merge } from "rxjs";
import { DateWiseData } from "src/app/models/date-wise-data";
import { GlobalDataSummary } from "src/app/models/global-data";
import { DataServiceService } from "src/app/services/data-service.service";
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
  dateWiseData;
  selectedConData: DateWiseData[];
  loading = true;
  options: {
    height: 500;
    animation: {
      duration: 1000;
      easing: "out";
    };
  };

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    // setting default country by merging subscriptions
    merge(this.dataService.getDateWiseData()).pipe(
      map((result) => {
        this.dateWiseData = result;
      })
    ),
      this.dataService
        .getGlobalData()
        .pipe(
          map((result) => {
            this.data = result;
            this.data.forEach((cs) => {
              this.countries.push(cs.country);
            });
          })
        )
        .subscribe({
          complete: () => {
            this.updateValues("US");
            this.loading = false;
            // this.selectedConData = this.dateWiseData["US"];
            // this.updateChart();
          },
        });

    // this.dataService.getDateWiseData().subscribe((result) => {
    //   this.dateWiseData = result;
    //   this.updateChart();
    // });

    // this.dataService.getGlobalData().subscribe((result) => {
    // this.data = result;
    // this.data.forEach((cs) => {
    //   this.countries.push(cs.country);
    //   });
    // });
  }

  updateValues(country: string) {
    console.log(country);

    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalRecovered = cs.recovered;
        this.totalDeaths = cs.deaths;
        this.totalConfirmed = cs.confirmed;
      }
    });

    console.log();
    this.selectedConData = this.dateWiseData[country];
    console.log(this.selectedConData);

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
