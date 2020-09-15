import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { GlobalDataSummary } from "../models/global-data";

@Injectable({
  providedIn: "root",
})
export class DataServiceService {
  private globalDataUrl =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/09-14-2020.csv";
  constructor(private http: HttpClient) {}

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: "text" }).pipe(
      map((result) => {
        let data: GlobalDataSummary[] = [];
        let raw = {};

        // splitting csv data into rows using new line character
        let rows = result.split("\n");

        // ignoring 0th index to remove column name data
        rows.splice(0, 1);

        // splitting csv row data into column using comma
        rows.forEach((row) => {
          // let cols = row.split(",");

          // using regex to make equal no. of cols
          let cols = row.split(/,(?=\S)/);

          let cs = {
            // `+` operator to convert string data to number type
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          // merging records with same country name together
          let temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
        });

        return Object.values(raw);
      })
    );
  }
}
