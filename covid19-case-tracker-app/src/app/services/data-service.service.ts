import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { DateWiseData } from "../models/date-wise-data";
import { GlobalDataSummary } from "../models/global-data";

@Injectable({
  providedIn: "root",
})
export class DataServiceService {
  private baseUrl =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";
  private globalDataUrl = "";
  private datewiseDataUrl =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

  private ext = ".csv";

  month: any;
  date: any;
  year: any;

  constructor(private http: HttpClient) {
    let now = new Date();
    this.month = now.getMonth() + 1;
    this.date = now.getDate();
    this.year = now.getFullYear();

    this.globalDataUrl = `${this.baseUrl}${this.getDate(
      this.month
    )}-${this.getDate(this.date)}-${this.year}${this.ext}`;
  }

  getDate(date: number) {
    if (date < 10) {
      return "0" + date;
    }
    return date;
  }

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

        return <GlobalDataSummary[]>Object.values(raw);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.date = this.date - 1;
          this.globalDataUrl = `${this.baseUrl}${this.getDate(
            this.month
          )}-${this.getDate(this.date)}-${this.year}${this.ext}`;
          return this.getGlobalData();
        }
      })
    );
  }

  getDateWiseData() {
    return this.http.get(this.datewiseDataUrl, { responseType: "text" }).pipe(
      map((result) => {
        let mainData = {};
        let rows = result.split("\n");

        // removing the header of the table
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);

        // remove unwanted cols from the table
        dates.splice(0, 4);
        rows.splice(0, 1);

        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0, 4);

          // mapping dates to the header
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index])),
            };
            mainData[con].push(dw);
          });
        });
        return mainData;
      })
    );
  }
}
