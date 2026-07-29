// [src/shared/geo/mapData.ts] - Shared Geographic District Maps and Area Constants

import { districtsPart1 } from "./districts1";
import { districtsPart2 } from "./districts2";

export interface MapDistrict {
  name: string;
  styleUrl: string;
  coordinates: [number, number][]; // [lat, lon] array
}

export const MAP_DISTRICTS: MapDistrict[] = [
  ...districtsPart1,
  ...districtsPart2
];

export const GOTEBORG_AREAS = [
  "Tjörn & Stenungsund",
  "Kungälv",
  "Gråbo & Olofstorp",
  "Angered & Hjällbo",
  "Kortedala Norra",
  "Bergsjön & Gärdsås",
  "Kortedala & Bellevue",
  "Utby & Utbynäs",
  "Hisingen",
  "Sävedalen / Partille Norra",
  "Furulund / Partille Södra",
  "Kålltorp / Olskroken & Bagaregården",
  "Landvetter & Härryda"
];

export const AREA_TO_DISTRICT_MAP: Record<string, string> = {
  "Tjörn & Stenungsund": "Tjörn/Stenungsund",
  "Kungälv": "Kungälv",
  "Gråbo & Olofstorp": "Gråbo/Olofstorp",
  "Angered & Hjällbo": "Angered/Hjällbo",
  "Kortedala Norra": "Kortedala norra",
  "Bergsjön & Gärdsås": "Bergsjön",
  "Kortedala & Bellevue": "Kortedala/Bellevue",
  "Utby & Utbynäs": "Utby/Utbynäs",
  "Hisingen": "Hisingen",
  "Sävedalen / Partille Norra": "Partille Norra",
  "Furulund / Partille Södra": "Partille Södra",
  "Kålltorp / Olskroken & Bagaregården": "Östra Centrum 1",
  "Landvetter & Härryda": "Landvetter/Härryda"
};

export const DISTRICT_NAME_MAPPING: Record<string, string> = {
  "Tjörn/Stenungsund": "Tjörn & Stenungsund",
  "Kungälv": "Kungälv",
  "Gråbo/Olofstorp": "Gråbo & Olofstorp",
  "Angered/Hjällbo": "Angered & Hjällbo",
  "Kortedala norra": "Kortedala Norra",
  "Bergsjön": "Bergsjön & Gärdsås",
  "Kortedala/Bellevue": "Kortedala & Bellevue",
  "Utby/Utbynäs": "Utby & Utbynäs",
  "Hisingen": "Hisingen",
  "Partille Norra": "Sävedalen / Partille Norra",
  "Partille Södra": "Furulund / Partille Södra",
  "Östra Centrum 1": "Kålltorp / Olskroken & Bagaregården",
  "Östra Centrum 2": "Kålltorp / Olskroken & Bagaregården",
  "Landvetter/Härryda": "Landvetter & Härryda"
};
