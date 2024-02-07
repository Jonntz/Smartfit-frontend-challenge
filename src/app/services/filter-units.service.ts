import { Injectable } from '@angular/core';
import { Location } from '../types/location.interface';

const OPENING_HOURS = {
  morning: {
    first: '06',
    last: '12'
  },

  evening: {
    first: '12',
    last: '18'
  },

  night: {
    first: '18',
    last: '23'
  }
}

type HOUR_INDEXES = 'morning' | 'evening' | 'night';

@Injectable({
  providedIn: 'root'
})
export class FilterUnitsService {

  constructor() { }

  transformWeekDay(weekday: number) {
    switch (weekday) {
      case 0:
        return "Dom."
      case 6:
        return "Sab."
      default:
        return "Seg. à Sex."
    }
  }

  filterUnits(unit: Location, openHour: string, closeHour: string) {
    let openHourFilter = parseInt(openHour, 10);
    let closeHourFilter = parseInt(closeHour, 10);
    let todaysWeekDay = this.transformWeekDay(new Date().getDay());
   
    for (let i = 0; i < unit.schedules.length; i++) {
      let schedulesHour = unit.schedules[i].hour;
      let schedulesWeekDay = unit.schedules[i].weekdays;

      if (todaysWeekDay == schedulesWeekDay) {
        if (schedulesHour != 'Fechada' && schedulesHour != "*Unidade fechará de 1h em 1h para limpeza.") {
          let [unitOpenHour, unitCloseHour] = schedulesHour.split(' às ');
          let unitOpenHourInt = parseInt(unitOpenHour.replace('h', ''), 10);
          let unitCloseHourInt = parseInt(unitCloseHour.replace('h', ''), 10);


          if (unitOpenHourInt <= openHourFilter && unitCloseHourInt >= closeHourFilter) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
    
    return false;
  }

  filter(results: Location[], showClosed: boolean, hour: string){
    let intermediateResults = results;

    if (!showClosed) {
      intermediateResults = results.filter(location => location.opened === true);
    }

    if (hour) {
      const OPEN_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].first;
      const CLOSE_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].last;

      return intermediateResults.filter(location => this.filterUnits(location, OPEN_HOUR, CLOSE_HOUR));
    } else {
      return intermediateResults;
    }
  }
}
