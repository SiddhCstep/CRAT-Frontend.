import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, Data } from '@angular/router';
import { AuthserviceService } from '../service/authservice.service';
import { HttpHeaders } from '@angular/common/http';
import * as L from 'leaflet';
import 'leaflet.polylinemeasure';
import { FeatureCollection, GeoJsonObject, Feature } from 'geojson';
import { distinctUntilChanged } from 'rxjs';


interface GeoJsonFeature {
  properties: {
    Flood_his: string;
    District: string;
  };
}


interface GeoJsonFeatureforheatwavehi {
  properties: {
    poc_hw_fu: number;
    poc_hw_hi: number;
    District: string;
    Drought_hi: string | null;
  };
}

interface District {
  district_id: number;
  district_name: string;
  vulnerability_index: number;
}

interface ScaleValue {
  label: number;
  color: string;
}

var Data: District[];

interface GeoJsonFeatureforSealeavel {
  properties: {
    poc_slr_fu: number;
    poc_slr_hi: number;
    District: string;
  };
}

interface GeoJsondataSealeavel {
  features: GeoJsonFeatureforSealeavel[];
}

interface GeoJsonDataforheatwavehi {
  features: GeoJsonFeatureforheatwavehi[];
}

interface GeoJsonFeaturefordroughthi {
  properties: {
    poc_dro_fu: number;
    poc_dro_hi: number;
    District: string;
    Drought_hi: string | null;
  };
}

interface GeoJsonDatafordrought {
  features: GeoJsonFeaturefordroughthi[];
}

interface GeoJsonData {
  features: GeoJsonFeature[];
}

interface FloodHiMap {
  [floodHiValue: string]: Set<string>;
}


type DataObject = {
  [key: string]: string[];
};

type ResultObject = {
  [key: string]: {
    variableArray: string[];
    eArray: string[];
  };
};


interface DataItem {
  District: string;
  poc_dro_hi: string;
}



type DistrictData = {
  [key: string]: {
    "2yr": number;
    "5yr": number;
    "10yr": number;
    "25yr": number;
    "50yr": number;
    "100yr": number;
  };
};

type FloodData = {
  History: DistrictData;
  Future: DistrictData;
};


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {


  cartoDBPositro = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 100,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
  });

  optionsDisone = {
    layers: [
      this.cartoDBPositro
    ],
    zoom: 11,
    center: L.latLng(11.9416, 79.8083),
    attributionControl: false,
  };

  optionsDistwo = {
    layers: [
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd'
      })
    ],
    zoom: 12,
    center: L.latLng(10.9337, 79.7961),
    attributionControl: false,
  };

  optionsDisthree = {
    layers: [
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd'
      })
    ],
    zoom: 13,
    center: L.latLng(16.7143, 82.2638),
    attributionControl: false,
  };



  optionsDisfour = {
    layers: [
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd'
      })
    ],
    zoom: 13.2,
    center: L.latLng(11.7361, 75.5223),
    attributionControl: false,
  };



  layersControlone = {
    baseLayers: {

      'Google Satellite': L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),
      'Google Roads': L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),

      'Default Map': L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    },
    overlays: {
      // You can add overlays here if needed
    }
  }



  layersControltwo = {
    baseLayers: {
      'Google Satellite': L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),
      'Google Roads': L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),

      'Default Map': L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    },
    overlays: {

    },

    options: {
      position: 'bottomleft'  // Set position to bottom-left
    }

  }


  layersControlthree = {
    baseLayers: {
      'Google Satellite': L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),
      'Google Roads': L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),

      'Default Map': L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    },
    overlays: {

    },

    options: {
      position: 'bottomleft'  // Set position to bottom-left
    }

  }

  layersControlfour = {
    baseLayers: {
      'Google Satellite': L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),
      'Google Roads': L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: 'Map data © Google'
      }),

      'Default Map': L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    },
    overlays: {

    }

  }


  valueofpercentage: number = 10
  // layersControl: any;
  hazardgeoJSONDATA: any;
  isOpen = false;
  selectedOption: any;
  showRCP: boolean = false;
  isHazardsContentVisible: boolean = false;
  isVulnerabilityContentVisible = false;
  isExposureContentVisible: boolean = false;
  radioForm!: FormGroup;
  radioFormRCP!: FormGroup;
  radioFormhazardtogel!: FormGroup;
  checkboxForm: FormGroup;
  checkboxFormVulnerability: FormGroup;
  vulnerabilities: any[] = [];
  expandedBox: string = '';
  map: any;
  isButtonDisabled: boolean = true;
  VulnerabilitValue: boolean = false;
  Exposurevalue: boolean = false;
  Hazardsvalue: boolean = false;
  showlegend: boolean = false;
  mapscale: boolean = true;
  valueofSubhazard: any;
  geoJSONDATA: any;
  droughtvalueshow: boolean = false;
  heatwavevalueshow: boolean = false;
  floodoptionhundred: boolean = false;
  activemenu: any;
  floodSubOption: boolean = false;
  droughtoption: string = ''
  optionsofeffectedfield: any;
  testvar: boolean = false;
  timestamp: string = "";
  timestampforexposure: string = "Historical"
  Vulnerabilityoptions: any;
  selectedOptionofsector: any;
  vulnerability: string = ''
  vulnerabilitysecond: string = ''
  vulnerabilityseconddata: any
  UserName: string = ''
  expandedBoxchangepassword: boolean = false
  passworderror: string = ''
  lodershow: boolean = false;
  expandedYes: boolean = true;





  exposureindicators: any;




  typeOfHazard: string = "Probability of Occurrence"
  droughtBox: boolean = false;
  HeatwaveBOX: boolean = false;
  sealeavelriseBox: boolean = false;
  floodBox: boolean = false;
  nameoflegend: string = "";
  sealeavelrisecomment: boolean = false;
  numberbox: boolean = true;
  selectionname: string = "Sector"
  PleaseselectsectorExpouser: boolean = true;
  isexposureoptionvisible: boolean = false;
  floodSlidervaluetoshownonselectedindicator: any = 2;



  colorBoxes: string[] = [];
  numberBoxes: any[] = [];
  NumberBoxForHazardFlood: number[] = [];
  NumberBoxForHazard: number[] = [];
  NumberBOXforShowRiskValnarbility: number[] = [];
  NumberBOXforShowRiskExposure: number[] = [];
  NumberBOXforShowRiskFive: number[] = [];



  hazard: string[] = [];
  exposure: any[] = [];
  vulnerabilityAdaptive: any[] = [];
  vulnerabilitySensitivity: any[] = [];





  boxName: string | null = null;
  selectedOptions: any;
  selectedLayersControl: any;
  districtName: string = '';


  optionsoftime = [
    { label: 'Historical', value: 'Historical' },
    { label: 'Future', value: 'Future' }
  ];

  futureTooltip = `
    <strong>RCP 4.5:</strong>
    Representative Concentration Pathway (RCP) 4.5 is a scenario described by the Intergovernmental Panel on Climate Change (IPCC) in which greenhouse gas emissions peak around 2040 and then decline, stabilizing radiative forcing at 4.5 watts/m² by 2100 without exceeding that value. This moderate scenario is simulated using the Global Change Assessment Model (GCAM).
    <br>
   
    <br>
    <strong>SSP 2:</strong>
    The Shared Socioeconomic Pathway (SSP) 2, 'Middle of the Road,' represents moderate challenges for both mitigating and adapting to climate change. This scenario follows a trajectory where social, economic, and technological trends largely continue along historical patterns.
    `;





  optionsoftypeoftime = [
    { label: 'RCP 4.5', value: 'RCP 4.5' },
    { label: 'RCP 8.5', value: 'RCP 8.5' }
  ];



  // hazardoptions = [
  //   {
  //     label: 'Drought',
  //     value: 'Drought',
  //     tooltip: 'This data assesses the probability of drought occurrence using 30 years of monthly precipitation data (1991-2022). Only severe and extreme drought cases as defined by the Standardized Precipitation Index (SPI) are considered.',
  //   },
  //   {
  //     label: 'Heatwave',
  //     value: 'Heatwave',
  //     tooltip: 'The probability of heatwave events is calculated based on 30 years of daily temperature data (1991-2022). This measure considers the number of years in which at least one heatwave event has occurred. A heatwave event is defined as two consecutive days of ≥ 37°C for the coastal districts of Puducherry, Karaikal, and Yanam and ≥ 32°C for the hilly district of Mahe.',
  //   },
  //   {
  //     label: 'Sea level rise',
  //     value: 'Sea level rise',
  //     tooltip: 'The probability of sea level rise is assessed using historical data from the closest tide stations for each district over specified periods. For Pondicherry and Karaikal districts, data from the Chennai tide station (1968-2012) was used. For Yanam and Mahe, data from the Visakhapatnam tide station (1972-2021) and the Kochi tide station (1977-2021) was used, respectively.',
  //   },
  //   {
  //     label: 'Flood (Return period) years',
  //     value: 'Flood',
  //     tooltip: `To calculate the probability of occurrence of floods, return periods have been calculated using 30 years of historical rainfall data (1991-2022). Return periods provide a statistical measure of how often a flood of a certain magnitude or severity can be expected to occur.
  //       <br>
  //       <br>
  //       <strong>Return Period 2:</strong> A 2-year return period indicates a 50% probability of a flood occurring each year. Such a flood is relatively frequent and has a lower magnitude compared to floods with longer return periods.
  //       <br>
  //       <br>
  //       <strong>Return Period 5:</strong> A 5-year return period indicates a 20% probability of a flood occurring each year. Such a flood is moderately frequent and has a moderate magnitude compared to floods with longer return periods.
  //       <br>
  //       <br>
  //       <strong>Return Period 10: </strong>A 10-year return period indicates a 10% probability of a flood occurring each year. Such a flood is less frequent and has a higher magnitude compared to floods with shorter return periods.
  //       <br>
  //       <br>
  //       <strong>Return Period 50:</strong> A 50-year return period indicates a 2% probability of a flood occurring each year. Such a flood is rare and has a high magnitude compared to floods with shorter return periods.
  //       <br>
  //       <br>
  //       <strong>Return Period 100:</strong> A 100-year return period indicates a 1% probability of a flood occurring each year. Such a flood is rare and has a high magnitude compared to floods with shorter return periods.`,
  //   },
  // ];



  hazardoptions = [
    {
      label: 'Drought',
      value: 'Drought',
      tooltip: ''
    },
    {
      label: 'Heatwave',
      value: 'Heatwave',
      tooltip: ''
    },
    {
      label: 'Sea level rise',
      value: 'Sea level rise',
      tooltip: ''
    },
    {
      label: 'Flood (Return period) years',
      value: 'Flood',
      tooltip: ''
    }
  ];

  getUpdatedHazardOptions() {
    const isHistorical = this.timestampforexposure === 'Historical';
    const isFuture = this.timestampforexposure === 'Future';
    const isProbability = this.typeOfHazard === 'Probability of Occurrence';
    const isSpatial = this.typeOfHazard === 'Spatial Extent';

    return this.hazardoptions.map(option => {
      let newTooltip = option.tooltip;

      if (isProbability) {
        if (isHistorical) {
          console.log(option.value);
          switch (option.value) {
            
            case 'Drought':
              newTooltip = 'This data assesses the probability of drought occurrence using 30 years of monthly precipitation data (1991-2022). Only severe and extreme droughtDrought cases as defined by the Standardized Precipitation Index (SPI) are cwere considered';
              break;
            case 'Heatwave':
              newTooltip = 'The probability of heatwave events is calculated based on 30 years of daily temperature data (1991-2022). This measure considers the number of years in which at least one heatwave event has occurred. A heatwave event is defined as two consecutive days of ≥ 37°C for the coastal districts of Puducherry, Karaikal and Yanam and ≥ 32°C for the hilly district of Mahe. ';
              break;
            case 'Sea level rise':
              newTooltip = 'The probability of exceedance sea level rise is assessed using historical data from the closest tide stations for each district over specified periods. For Pondicherry and Karaikal districts, data from the Chennai tide gauge station (1968-2012) was used to compute the probability of occurrence exceedences of sea level rise in the region. For Yanam and Mahe, data from the Visakhapatnam tide gauge station (1972-2021) and the Kochi tide gauge station (1977-2021) was used, respectively. ';
              break;
            case 'Flood':
              newTooltip = 'To calculate the probability of occurrence of floods, return periods have been calculated using 30 years of historical rainfall data (1991-2022). Return periods provide a statistical measure of how often a flood of a certain magnitude or severity can be expected to occur. ';
              break;
          }
        } else if (isFuture) {
          switch (option.value) {
            case 'Drought':
              newTooltip = 'Droughts: The Representative Concentration Pathway (RCP) 4.5 scenario is used to forecastproject  future droughts. The Intergovernmental Panel on Climate Change (IPCC) describes this scenario in which greenhouse gas emissions peak around 2040 and then decline, stabilizing radiative forcing at 4.5 watts/m2 by the year 2100 without exceeding that value. This moderate scenario is simulated using the Global Change Assessment Model (GCAM).';
              break;
            case 'Heatwave':
              newTooltip = 'The Representative Concentration Pathway (RCP) 4.5 scenario is used to forecastproject future heatwaves. The Intergovernmental Panel on Climate Change (IPCC) describes this scenario in which greenhouse gas emissions peak around 2040 and then decline, stabilizing radiative forcing at 4.5 watts/m2 by the year 2100 without exceeding that value. This moderate scenario is simulated using the Global Change Assessment Model (GCAM)';
              break;
            case 'Sea level rise':
              newTooltip = 'The Shared Socioeconomic Pathways (SSPs) 2-4.5 is used to forecast future sea-level rise. SSP 2-4.5 is characterized as a "Middle of the Road," which represents a scenario with moderate challenges for both mitigating and adapting to climate change. In this scenario, global development follows a trajectory where social, economic, and technological trends largely continue along historical patterns and emissions are at the current levels till 2050 followed by a reduction, but never reaching net-zero by 2100. ';
              break;
            case 'Flood':
              newTooltip = 'The Representative Concentration Pathway (RCP) 4.5 scenario is used to forecast future floods. The Intergovernmental Panel on Climate Change (IPCC) describes this scenario in which greenhouse gas emissions peak around 2040 and then decline, stabilizing radiative forcing at 4.5 watts/m2 by the year 2100 without exceeding that value. This moderate scenario is simulated using the Global Change Assessment Model (GCAM). ';
              break;
          }
        }
      } else if (isSpatial) {
        if (isHistorical) {
          switch (option.value) {
            case 'Drought':
              newTooltip = 'This data presents the spatial extent of drought. The extent appears uniform across Given the limited geographical area of each region within Puducherry U.T, due to limitations of IMD rainfall gridded data resolution (re-girdded to 0.25° X 0.25°)the. spatial extent of droughts is uniform over each region';
              break;
            case 'Heatwave':
              newTooltip = 'This data presents the spatial extent of heatwave events. Given the limited geographical area of each region within Puducherry U.T, the spatial extent of heatwaves is uniform over each region. The extent appears uniform across  area of each region within Puducherry U.T, due to limitations of IMD rainfall grid data resolution (0.25° x 0.25°).The extent appears uniform across area of each region within Puducherry U.T, due to limitations of IMD rainfall temperature gridded data resolution (re-girddedgirdded to 0.25° X 0.25°)';
              break;
            case 'Sea level rise':
              newTooltip = 'Sea levelLR inundation mapping for the four regions of Puducherry UT employed a comprehensive methodology integrating an GISelevation-based flow-bathtub model';
              break;
            case 'Flood':
              newTooltip = 'The spatial extent of flood for return periods 2, 5, 10, 50, and 100 years was derived through a multi-tier process by using the HEC–RAS 2D hydraulic model';
              break;
          }
        } else if (isFuture) {
          switch (option.value) {
            case 'Drought':
              newTooltip = 'This data presents the spatial extent of drought based on the IPCC RCP 4.5 scenario. Given the limited geographical area of each region within Puducherry U.T, the spatial extent of droughts is uniform over each region.(re-girdded re-girdded to 0.25° X 0.25°)To maintain uniformity, CMIP-5 model outputs with varied resolutions were re-gridded to 0.25° × 0.25°.';
              break;
            case 'Heatwave':
              newTooltip = 'This data presents the spatial extent of heatwave based on the IPCC RCP 4.5 scenario.  Given the limited geographical area of each region within Puducherry U.T, the spatial extent of droughts is uniform over each region.Due to the coarse resolution of Seismic 5 gridded data(downscaled re-girdded re-girdded to 0.25° X 0.25°), the spatial extent of drought appears uniform across each region within Puducherry U.T. To maintain uniformity, CMIP-5 model outputs with varied resolutions were re-gridded to 0.25° × 0.25°.';
              break;
            case 'Sea level rise':
              newTooltip = 'SLR induced inundation mapping for the four regions of Puducherry UT employed a comprehensive methodology integrating an GISelevation-based bathflowtub model using the IPCC SSP2-4.5 scenario';
              break;
            case 'Flood':
              newTooltip = 'The spatial extent of flood for return periods 2, 5, 10, 50, and 100 years was derived through a multi-tier process by using the HEC–RAS 2D hydraulic model for the IPCC RCP 4.5 scenario..';
              break;
          }
        }
      }

      return { ...option, tooltip: newTooltip };
    });
  }







  optionsofhazardtogel = [
    { label: 'Probability of Occurrence', value: 'Probability of Occurrence' },
    { label: 'Spatial Extent ', value: 'Spatial Extent' }
  ];

  floodSubOptions = [
    { label: '2 Years', value: '2' },
    { label: '5 Years', value: '5' },
    { label: '10 Years', value: '10' },
    { label: '25 Years', value: '25' },
    { label: '50 Years', value: '50' },
    { label: '100 Years', value: '100' },
  ];

  optionofscale = [
    { label: 50, color: "nan" },
    { label: 40, color: "nan" },
    { label: 30, color: "nan" },
    { label: 20, color: "nan" },
    { label: 10, color: "nan" },
    { label: 0, color: "nan" },
  ]

  Exposureoptions = [
    { value: 'Agriculture Area', label: 'Agriculture Area' },
    { value: 'Storage Units', label: 'Storage Units' },
    { value: 'Irrigation Networks', label: 'Irrigation Networks' },
    { value: 'Polyhouses and Greenhouses ', label: 'Polyhouses and Greenhouses ' },
    { value: "Agriculture Markets (Mandi's)", label: "Agriculture Markets (Mandi's)" },
  ];
  maps: any[] = [];


  registerForm: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  emailError: string = "";
  successMessage: string = "";
  PoCmmshow: boolean = false;
  layers: any;



  constructor(private fb: FormBuilder, private router: Router, private authservice: AuthserviceService) {

    this.radioForm = this.fb.group({
      selectedOption: 'Historical'
    });
    this.checkboxForm = this.fb.group({
      selectedOptionsForExposure: this.fb.array(this.Exposureoptions.map(() => new FormControl(false)))
    });
    this.checkboxFormVulnerability = this.fb.group({
      selectedOptionsforVulnerability: this.fb.array([])
    });

    this.registerForm = this.fb.group({
      oldpassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.optionsMap = {
      'Drought': { historical: 'Drought_hi', future: 'Dro_ssp4_5' },
      'Heatwave': { historical: 'Heatwave_h', future: 'HW_ssp4_5' },
      'Sea level rise': { historical: 'slr', future: 'slr' },
      'Flood': {
        historical: `Flood_his${this.floodslidervalue ?? ''}`,
        future: `Flood_fut${this.floodslidervalue ?? ''}`
      }
    };

    this.droughtOptionsMap = {
      'Drought': 'Moderate drought',
      'Heatwave': ' ',
      'Sea level rise': this.timestampforexposure === 'Historical' ? 'SLR_historical' : 'SLR_4_5',
      'Flood': (this.floodslidervalue ?? '').toString()
    };
  }

  resistationerror: string = ''
  sucessmassege: string = ''













  onSubmitRegister() {
    if (this.registerForm.valid) {
      this.expandedBoxchangepassword = false;
      this.lodershow = true;

      this.passworderror = ''
      this.sucessmassege = "";
      // //console.log(this.registerForm.value);


      const token = sessionStorage.getItem('jwtToken');

      const headers = new HttpHeaders({
        'Authorization': `JWT ${token}`
      });

      // console.log(headers);

      const value = {
        "new_password": this.registerForm.value.password,
        "re_new_password": this.registerForm.value.confirmPassword,
        "current_password": this.registerForm.value.oldpassword,
      }

      this.authservice.updatePassword(value, headers).subscribe((data: any) => {
        this.lodershow = false;
        this.expandedBoxchangepassword = true;
        this.sucessmassege = 'Password has been changed successfully'
      }, (error: { error: { current_password: string[]; }; message: string; status: number; }) => {
        this.expandedBoxchangepassword = true;
        this.lodershow = false;
        if (error.error.
          current_password[0]
        ) {
          this.passworderror = error.error.
            current_password[0];

        } else {
          this.resistationerror = error.message;
        }

        if (error.status === 401) {
          alert("You need to login again");
          sessionStorage.removeItem('jwtToken');
          this.router.navigate(['']);
        }

      });
    }
  }

  togglePasswordVisibility(type: string) {
    if (type === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (type === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }


  onSelectionChangehazardtogel(value: string) {
    this.hazardoptions = this.getUpdatedHazardOptions();

    console.log(value);
    this.typeOfHazard = value;

    console.log(this.droughtoption);

    if (this.droughtoption) {
      this.onSelectionChangeHazards(this.droughtoption)
    }

    if (value === "Spatial Extent") {
      // this.onSelectionChangeHazards(this.droughtoption)
      // //console.log(this.floodvalue);

      // this.floodslidervalue = 
    }

  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  get registerPassword() {
    return this.registerForm.get('password');
  }

  get registerConfirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  isPopupVisible = false;

  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  changePassword() {
    // alert('Change Password Clicked');
    this.isPopupVisible = false;
    this.expandedBoxchangepassword = true;
    this.registerForm.reset();
    this.sucessmassege = ""
    this.resistationerror = ""
  }

  logout() {
    sessionStorage.removeItem('jwtToken')
    this.router.navigate(['']);
  }


  setMapOptions(name: string | null) {
    switch (name) {
      case 'one':
        this.selectedOptions = this.optionsDisone;
        this.selectedLayersControl = this.layersControlone;
        break;
      case 'two':
        this.selectedOptions = this.optionsDistwo;
        this.selectedLayersControl = this.layersControltwo;
        break;
      case 'three':
        this.selectedOptions = this.optionsDisthree;
        this.selectedLayersControl = this.layersControlthree;
        break;
      case 'four':
        this.selectedOptions = this.optionsDisfour;
        this.selectedLayersControl = this.layersControlfour;
        break;
      default:
        this.selectedOptions = this.optionsDisone;
        this.selectedLayersControl = this.layersControlone;
    }
  }


  setDistrictName(name: string | null) {
    switch (name) {
      case 'one':
        this.districtName = 'Puducherry';
        break;
      case 'two':
        this.districtName = 'Karaikal';
        break;
      case 'three':
        this.districtName = 'Yanam';
        break;
      case 'four':
        this.districtName = 'Mahe';
        break;
      default:
        this.districtName = 'Puducherry';
    }
  }



 







  ngOnInit(): void {
    this.hazardoptions = this.getUpdatedHazardOptions();
    this.authservice.boxName$.subscribe((name) => {
      this.boxName = name;
      this.setMapOptions(name);
      this.setDistrictName(name);
      

      // console.log(name);

    });

    // this.authservice.selectedOption$.subscribe(value => {
    //   this.selectedOption = value;
    //   console.log('Updated Value:', this.selectedOption);
    // });

    // this.authservice.selectedOption$.subscribe(value => {
    //   this.selectedOption = value;
    //   console.log('Updated Value:', this.selectedOption);

    //   if (this.selectedOption !== null) {
    //     this.selectOption(this.selectedOption)
    //   }
    // });


    this.authservice.selectedOption$.pipe(distinctUntilChanged()).subscribe(value => {
      if ((this.selectedOption = value ?? null) !== null) {
        console.log('Updated Value:', this.selectedOption);
        console.log("calling map component");

        this.selectOption(this.selectedOption)
      }
    });

    this.authservice.selectedOptionVulnerabilityoptionsformap$.pipe(distinctUntilChanged()).subscribe(value => {
      if ((this.selectedOption = value ?? null) !== null) {

        // this.optionsofeffectedfield = this.selectedOption
        console.log('Updated Value:', this.selectedOption);
        console.log("calling map component");
        this.onSelectionChangeVulnerabilityoptions(this.selectedOption)
      }
    });


    const token = sessionStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`
    });

    // //console.log(this.optionsofeffectedfield);

    this.authservice.getSectorname(headers).subscribe((data: { id: number; sector_name: string; }[]) => {
      //console.log(data);
      data.unshift({ id: 0, sector_name: 'Select Sector' });
      this.optionsofeffectedfield = data;
      this.selectedOptionofsector = this.optionsofeffectedfield[0];
    }, (error: { status: number; }) => {
      console.log(error);

      if (error.status === 401) {
        alert("You need to login again");
        sessionStorage.removeItem('jwtToken');
        this.router.navigate(['']);
      }

    });

    headers

    this.authservice.getUserDetails(headers).subscribe((data: { name: string; }) => {

      this.UserName = data.name;
    }, (error: { status: number; }) => {
      console.log(error);
      if (error.status === 401) {
        alert("You need to login again");
        sessionStorage.removeItem('jwtToken');
        this.router.navigate(['']);
      }
    });

    this.radioForm = this.fb.group({
      selectedOption: ['Historical']
    });


    this.radioFormhazardtogel = this.fb.group({
      selectedOption: ['Probability of Occurrence']
    })


    this.radioFormRCP = this.fb.group({
      selectedOption: ['RCP 4.5']
    });

    // this.readExcel()


    this.loadHazard();
    this.loadExposure();
    this.loadVulnerabilityAdaptive();
    this.loadVulnerabilitySensitivity();

  }



  originalmap: any;


 








  onMapReady(map: any) {
    this.map = map;
    map.options.minZoom = 11;
    map.options.maxZoom = 15;

    const layersControl = L.control.layers(
      this.selectedLayersControl.baseLayers,
      this.selectedLayersControl.overlays,
      { position: 'bottomleft' }
    ).addTo(map);

    const polylineMeasure = L.control.polylineMeasure({
      position: 'topleft',
      unit: 'metres',
      showBearings: false,
      clearMeasurementsOnStop: true,
      showMeasurementsClearControl: true
    });

    polylineMeasure.addTo(map);
    this.maps.push(map);
    this.loadGeoJsonData();
  }


  resetSlider(): void {
    this.sliderControlforopacity.setValue(0); // Resets slider value to 0
  }


  // resetsecondslider(): void {
  //   this.sliderControlForLayerOpacity.setValue(0)
  // }
 // initialOpacityIndex = this.opacityStops.findIndex(stop => stop.value === 100);
  //sliderControlforopacity = new FormControl<number>(0);
  // Default at 50%

 

  opacityStops = [  
    { value: 0, label: '0%' },
    { value: 5, label: '5%' },
    { value: 10, label: '10%' },
    { value: 20, label: '20%' },
    { value: 100, label: '100%' },
  ];

  initialOpacityIndex = this.opacityStops.findIndex(stop => stop.value === 100);

  
  sliderControlforopacity = new FormControl<number>(this.initialOpacityIndex);
  sliderControlForLayerOpacity = new FormControl(this.initialOpacityIndex); 

  selectedLayerOpacity :number = 1 // 0.5
  selectedOpacity: number = 1;


  onSliderChangeforopicty(event: Event): void {
    const sliderValue = (event.target as HTMLInputElement).valueAsNumber;
    const selectedStop = this.opacityStops[sliderValue];
    this.selectedOpacity = selectedStop.value / 100; // Convert to 0-1 scale
    console.log('Selected Stop:', selectedStop);
    console.log('selectedOpacity', this.selectedOpacity);


    this.updateGeoJsonOpacityforhazard();
  }

  onSliderChangeForLayerOpacity(event: Event): void {
    const sliderValue = (event.target as HTMLInputElement).valueAsNumber;
    const selectedStop = this.opacityStops[sliderValue];
    this.selectedLayerOpacity = selectedStop.value / 100;
    this.updateGeoJsonOpacity();
  }



  updateGeoJsonOpacity(): void {
    this.exposureLayers.forEach((layer) => {
      // Cast 'layer' to 'L.GeoJSON' to access 'setStyle'
      (layer as L.GeoJSON).setStyle({
        fillOpacity: this.selectedLayerOpacity, // Update layer opacity
      });
    });
  }

  updateGeoJsonOpacityforhazard(): void {
    this.layers.forEach((layer: L.GeoJSON) => {
      layer.setStyle({
        fillOpacity: this.selectedOpacity
      });
    });
  }


  // earely gesojson = crat:a_01_CRAT_Hazards

  
  isPrintMode: boolean = false;

  printMap() {
    this.isPrintMode = true; // Show log data before printing
  
    console.log(this.typeOfHazard, this.hazard, this.floodSlidervaluetoshownonselectedindicator, this.exposure);
    console.log(this.vulnerabilityAdaptive);
    console.log(this.vulnerabilitySensitivity);
  
    setTimeout(() => {
      window.print();
      this.isPrintMode = false; // Hide logs after printing
    }, 500);
  }




  loadGeoJsonData(): Promise<void> {
    return this.authservice.loadGeoJsonData()
      .then((data: any) => {
        this.geoJSONDATA = data;

        // Define color mapping
        const colorMapping: { [key: string]: string; } = {
          '2': '#ff0000',
          '5': '#ffad00',
          '10': '#ffd900',
          '25': '#ffff00',
          '50': '#ffff00',
          '100': '#ffff00',
          '5.63': '#ff9500',
          '7.61': '#ff6500',
          '10.14': '#ff0000',
          '46.67': '#ffad00',
          '53.33': '#ff9500',
          '0': '#ffff00',
        };

        const getColor = (type: string) => colorMapping[type] || '#ffffff00';

        // Define style function
        const style = ({ properties }: any) => ({
          fillColor: getColor(this.valueofSubhazard),
          weight: 1,
          opacity: 1,
          color: '#284b47',
          fillOpacity: 0,
        });

        // Initialize layers for each map
        this.layers = [];
        this.maps.forEach((map) => {
          const layer = L.geoJSON(data, { style }).addTo(map);
          this.layers.push(layer);
        });
      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
      });
  }







  removeGeoJsonLayer(): void {
    if (this.layers && this.layers.length > 0) {
      this.layers.forEach((layer: any, index: number) => {
        if (typeof layer === 'object' && layer.map && layer.layer) {
          // Handle case where layers are stored as { map, layer }
          layer.map.removeLayer(layer.layer);
        } else if (this.maps[index] && layer) {
          // Handle case where layers are directly stored in an array
          this.maps[index].removeLayer(layer);
        }
      });
      this.layers = []; // Clear the reference to avoid memory leaks
      console.log('All GeoJSON layers removed.');
    } else {
      console.log('No layers to remove.');
    }
  }




  // await this.loadGeoJsonData();




  colorlesendtext: string = ""

  floodSubOptionValue: string | undefined


  exposurepercentagevaluenewpercentage: Record<string, any> = {}; // Fix TypeScript error



  dataforfloodinmm: {
    History: Record<string, Record<string, number>>;
    Future: Record<string, Record<string, number>>;
  } = {
      History: {
        Karaikal: {
          "2yr": 145.48,
          "5yr": 202.33,
          "10yr": 259.67,
          "25yr": 361.15,
          "50yr": 463.51,
          "100yr": 594.88,
        },
        Mahe: {
          "2yr": 127.28,
          "5yr": 177.02,
          "10yr": 227.19,
          "25yr": 315.97,
          "50yr": 405.53,
          "100yr": 520.47,
        },
        Puducherry: {
          "2yr": 148.57,
          "5yr": 195.57,
          "10yr": 240.78,
          "25yr": 316.95,
          "50yr": 390.22,
          "100yr": 480.41,
        },
        Yanam: {
          "2yr": 150.95,
          "5yr": 191.91,
          "10yr": 230.13,
          "25yr": 292.57,
          "50yr": 350.83,
          "100yr": 420.70,
        },
      },
      Future: {
        Karaikal: {
          "2yr": 132.39,
          "5yr": 168.01,
          "10yr": 201.18,
          "25yr": 255.30,
          "50yr": 305.72,
          "100yr": 366.09,
        },
        Mahe: {
          "2yr": 122.24,
          "5yr": 160.91,
          "10yr": 198.10,
          "25yr": 260.78,
          "50yr": 321.06,
          "100yr": 395.27,
        },
        Puducherry: {
          "2yr": 151.26,
          "5yr": 199.12,
          "10yr": 245.15,
          "25yr": 322.71,
          "50yr": 397.30,
          "100yr": 489.13,
        },
        Yanam: {
          "2yr": 145.79,
          "5yr": 176.07,
          "10yr": 203.10,
          "25yr": 245.29,
          "50yr": 282.94,
          "100yr": 326.37,
        },
      },
    };






  getFloodData(year: string, type: "Historical" | "Future") {
    const key = "2yr";
    const data = this.dataforfloodinmm["Historical" as keyof typeof this.dataforfloodinmm];

    const result: Record<string, Record<string, number>> = {};

    for (const location in data) {
      if (data.hasOwnProperty(location)) {
        result[location] = {
          [key]: data[location][key],
        };
      }
    }
    return result;
  }



  

  onSelectionChangeHazardsuboption(option: string) {
    this.lodershow = true;
    this.floodSubOptionValue = option;
    this.valueofSubhazard = option;
    this.floodSlidervaluetoshownonselectedindicator = option
    this.callExposureindicator()
    this.updateAllMaps();

    this.PoCmmshow = true;
    if (option === "0") {
      this.floodoptionhundred = true;
    }

    if (this.timestamp === "") {
      this.timestamp = "Historical"
    }


    console.log(this.timestamp);


    // Generate all six color and number boxes
    const colorArray = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
    const valuesArray = ['50', '20', '10', '4', '2', '1'];

    // Set all colors and numbers regardless of the option
    this.colorBoxes = colorArray;
    this.numberBoxes = valuesArray.map(value => Number(value));

    this.NumberBoxForHazardFlood = []; // This will be the array we fill



    if (option === "2") {
      this.NumberBoxForHazardFlood = new Array(4).fill(50); // Creates an array of length 4 with each element as 50

      console.log("POC 2");
      if (this.timestamp === "Historical") {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "2yr": 145.48
          },
          "Mahe": {
            "2yr": 127.28
          },
          "Puducherry": {
            "2yr": 148.57
          },
          "Yanam": {
            "2yr": 150.95
          }
        }

      } else {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "2yr": 132.39
          },
          "Mahe": {
            "2yr": 122.24
          },
          "Puducherry": {
            "2yr": 151.26
          },
          "Yanam": {
            "2yr": 145.79
          }
        }
      }


    } else if (option === "5") {
      this.NumberBoxForHazardFlood = new Array(4).fill(25);
      console.log("POC 5");


      if (this.timestamp === "Historical") {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "5yr": 202.33
          },
          "Mahe": {
            "5yr": 177.02
          },
          "Puducherry": {
            "5yr": 195.57
          },
          "Yanam": {
            "5yr": 191.91
          }
        }

      } else {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "5yr": 168.01
          },
          "Mahe": {
            "5yr": 160.91
          },
          "Puducherry": {
            "5yr": 199.12
          },
          "Yanam": {
            "5yr": 176.07
          }
        }
      }


    } else if (option === "10") {
      this.NumberBoxForHazardFlood = new Array(4).fill(10);

      if (this.timestamp === "Historical") {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "10yr": 259.67
          },
          "Mahe": {
            "10yr": 227.19
          },
          "Puducherry": {
            "10yr": 240.78
          },
          "Yanam": {
            "10yr": 230.13
          }
        }

      } else {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "10yr": 201.18
          },
          "Mahe": {
            "10yr": 198.10
          },
          "Puducherry": {
            "10yr": 245.15
          },
          "Yanam": {
            "10yr": 203.10
          }
        }
      }

      console.log("POC 10");
    } else if (option === "25") {
      this.NumberBoxForHazardFlood = new Array(4).fill(4);
      if (this.timestamp === "Historical") {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "25yr": 361.15
          },
          "Mahe": {
            "25yr": 315.97
          },
          "Puducherry": {
            "25yr": 316.95
          },
          "Yanam": {
            "25yr": 292.57
          }
        }

      } else {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "25yr": 255.30
          },
          "Mahe": {
            "25yr": 260.78
          },
          "Puducherry": {
            "25yr": 322.71
          },
          "Yanam": {
            "25yr": 245.29
          }
        }
      }
      console.log("POC 25");
    } else if (option === "50") {
      this.NumberBoxForHazardFlood = new Array(4).fill(2);
      if (this.timestamp === "Historical") {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "50yr": 463.51
          },
          "Mahe": {
            "50yr": 405.53
          },
          "Puducherry": {
            "50yr": 390.22
          },
          "Yanam": {
            "50yr": 350.83
          }
        }

      } else {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "50yr": 305.72
          },
          "Mahe": {
            "50yr": 321.06
          },
          "Puducherry": {
            "50yr": 397.30
          },
          "Yanam": {
            "50yr": 282.94
          }
        }
      }
      console.log("POC 50");
    } else if (option === "100") {
      this.NumberBoxForHazardFlood = new Array(4).fill(1);
      if (this.timestamp === "Historical") {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "100yr": 594.88
          },
          "Mahe": {
            "100yr": 520.47
          },
          "Puducherry": {
            "100yr": 480.41
          },
          "Yanam": {
            "100yr": 420.70
          }
        }

      } else {
        this.exposurepercentagevaluenewpercentage = {
          "Karaikal": {
            "100yr": 366.09
          },
          "Mahe": {
            "100yr": 395.27
          },
          "Puducherry": {
            "100yr": 489.13
          },
          "Yanam": {
            "100yr": 326.37
          }
        }
      }
      console.log("POC 100");
    } else {
      //console.log("Value is not supported"); // Handle unexpected values
    }

    //console.log(this.NumberBoxForHazardFlood);

    this.showriskbuttonactive(2)

  }





  getColor(type: string) {
    this.HeatwaveBOX = true;
    const colorArray = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
    const valuesArray = ['2', '5', '10', '25', '50', '100'];

    const index = valuesArray.indexOf(type);
    return index !== -1 ? colorArray[index] : '#ffff00'; // Default to yellow if not found
  }



  updateAllMaps() {
    this.maps.forEach(map => {
      map.eachLayer((layer: any) => {

        if (layer.setStyle) {
          this.lodershow = false;
          //console.log("updating map based on value of subhazard.");

          layer.setStyle({
            fillColor: this.getColor(this.valueofSubhazard),
            weight: 0.5,
            opacity: 1,
            color: '#284b47',
            fillOpacity: 0.5
          });
        }
      });
    });
  }








  
  resetOpacityTo100(): void {
    const resetIndex = this.opacityStops.findIndex(stop => stop.value === 100);
    this.sliderControlforopacity.setValue(resetIndex);
    this.onSliderChangeforopicty({ target: { valueAsNumber: resetIndex } } as unknown as Event);
  }






  resetOpacityTo100forexposure(): void {
    const resetIndex = this.opacityStops.findIndex(stop => stop.value === 100);
    this.sliderControlForLayerOpacity.setValue(resetIndex);
    this.onSliderChangeForLayerOpacity({ target: { valueAsNumber: resetIndex } } as unknown as Event);
  }








  onSelectionChangeHazards(option: any) {
    //this.resetSlider()
    this.resetOpacityTo100()
    this.showlegend = true
    this.selectedOption = option;
    this.droughtoption = option;
    this.lodershow = true;
    this.PleaseselectsectorExpouser = false;
    this.isexposureoptionvisible = true;
    this.callExposureindicator()
    const districts = ["Karaikal", "Mahe", "Puducherry", "Yanam"];
    districts.forEach(district => {
      this.removeLayer(district)
    });
    // this.loadGeoJsonData();

    this.loadHazard()





    this.exposurepercentagevalue = {}


    this.loadGeoJsonData().then(() => {
      if (this.typeOfHazard === "Probability of Occurrence") {


        this.colorlesendtext = this.typeOfHazard + "(%)";

        this.activemenu = option;
        this.droughtoption = option;
        // //console.log(this.activemenu, "funtion get called selection changed hazard.");

        if (option === "Flood") {
          this.floodSubOption = true;
          this.onSelectionChangeHazardsuboption(this.floodslidervalue)
        } else {
          this.floodSubOption = false;
        }
        const getFloodHiValues = (features: GeoJsonFeaturefordroughthi[]): FloodHiMap => {
          const floodHiMap: FloodHiMap = {};

          // //console.log("extracting flood value function");

          features?.forEach((feature) => {
            let floodHiValue
            if (this.timestamp === "Future") {
              floodHiValue = feature.properties.poc_dro_fu;
            } else {
              floodHiValue = feature.properties.poc_dro_hi;
            }

            const district = feature.properties.District;
            const droughtHi = feature.properties.Drought_hi;

            if (droughtHi) {
              if (!floodHiMap[floodHiValue]) {
                floodHiMap[floodHiValue] = new Set<string>();
              }

              floodHiMap[floodHiValue].add(district);
            }
          });

          return floodHiMap;
        };

        const getHeatwaveValues = (features: GeoJsonFeatureforheatwavehi[]): FloodHiMap => {
          const heatwaveMap: FloodHiMap = {};
          // //console.log("extracting heatwave value function");
          features?.forEach((feature) => {

            let heatwaveValue
            if (this.timestamp === "Future") {
              heatwaveValue = feature.properties.poc_hw_fu;
            } else {
              heatwaveValue = feature.properties.poc_hw_hi;
            }

            const district = feature.properties.District;
            const droughtHi = feature.properties.Drought_hi;

            if (droughtHi) {
              if (!heatwaveMap[heatwaveValue]) {
                heatwaveMap[heatwaveValue] = new Set<string>();
              }
            }

            heatwaveMap[heatwaveValue]?.add(district);
          });

          return heatwaveMap;
        };

        const getSeaLeavelValues = (features: GeoJsonFeatureforSealeavel[]): FloodHiMap => {
          const heatwaveMap: FloodHiMap = {};

          features?.forEach((feature) => {
            let sealeavelvalue
            if (this.timestamp === "Future") {
              sealeavelvalue = feature.properties.poc_slr_fu;
            } else {
              sealeavelvalue = feature.properties.poc_slr_hi;
            }


            const district = feature.properties.District;

            if (sealeavelvalue !== null && sealeavelvalue !== 0) {
              if (!heatwaveMap[sealeavelvalue]) {
                heatwaveMap[sealeavelvalue] = new Set<string>();
              }
              heatwaveMap[sealeavelvalue].add(district);
            }
          });

          return heatwaveMap;
        };

        const hasValueAssigned = (variable: string) => {
          return !!variable;
        };


        this.Hazardsvalue = hasValueAssigned(option);
        this.showlegend = this.Hazardsvalue;



        //01 dec 2024 commented line start. 

        // this.showriskbuttonactive(3);

        // 01 dec 2024 commented line end.


        if (option === "Heatwave") {
          this.HeatwaveBOX = false;
          this.PoCmmshow = false;
          this.nameoflegend = ""
          //console.log("calling");

          this.droughtoption = option;
          const heatwaveValues = getHeatwaveValues(this.geoJSONDATA?.features);


          const resultArray: { District: string; poc_dro_hi: string; }[] = [];

          Object.keys(heatwaveValues).forEach(floodHiValue => {
            const districts = Array.from(heatwaveValues[floodHiValue]);
            const pocDroHiValue = floodHiValue; // Assuming floodHiValue is used for poc_dro_hi

            districts.forEach(district => {
              resultArray.push({
                District: district,
                poc_dro_hi: pocDroHiValue
              });
            });
          });

          //console.log(resultArray);


          // Define the order of districts
          const order: string[] = ['Puducherry', 'Karaikal', 'Yanam', 'Mahe'];

          // Create a map of districts to poc_dro_hi values
          const districtMap: { [key: string]: string } = resultArray.reduce((map, item) => {
            map[item.District] = item.poc_dro_hi;
            return map;
          }, {} as { [key: string]: string });

          // Generate the reordered poc_dro_hi array and convert values to numbers
          const reorderedPocDroHi: number[] = order.map(district => Number(districtMap[district]));

          //console.log(reorderedPocDroHi);

          this.NumberBoxForHazardFlood = reorderedPocDroHi

          this.showriskbuttonactive(4)
          //console.log(this.NumberBoxForHazardFlood);





          this.updateMapColors(heatwaveValues);
          // Sort and process the heatwave values
          const values = Object.keys(heatwaveValues)
            .map(value => parseFloat(value)) // Convert to numbers for sorting
            .sort((a, b) => a - b); // Sort in ascending order

          Object.entries(heatwaveValues).forEach(([heatwaveValue, districts]) => {
            const heatwaveValueStr = heatwaveValue.toString();
            districts.forEach(district => {
              let color = '';
              if (this.selectedOption === "Heatwave") {
                color = this.getColorforhazard(Number(heatwaveValueStr), values); // Pass values array here
              }
              if (color) {
                //console.log(district, color);
                this.updateMap(district, color, 1);
              }
            });
          });
        }




        if (option === "Sea level rise") {
          this.nameoflegend = ""
          this.PoCmmshow = false;
          this.sealeavelrisecomment = false
          this.numberbox = true;
          const sealeavelvalues = getSeaLeavelValues(this.geoJSONDATA?.features);


          const resultArray: { District: string; poc_dro_hi: string; }[] = [];

          Object.keys(sealeavelvalues).forEach(floodHiValue => {
            const districts = Array.from(sealeavelvalues[floodHiValue]);
            const pocDroHiValue = floodHiValue; // Assuming floodHiValue is used for poc_dro_hi

            districts.forEach(district => {
              resultArray.push({
                District: district,
                poc_dro_hi: pocDroHiValue
              });
            });
          });

          //console.log(resultArray);


          // Define the order of districts
          const order: string[] = ['Puducherry', 'Karaikal', 'Yanam', 'Mahe'];

          // Create a map of districts to poc_dro_hi values
          const districtMap: { [key: string]: string } = resultArray.reduce((map, item) => {
            map[item.District] = item.poc_dro_hi;
            return map;
          }, {} as { [key: string]: string });

          // Generate the reordered poc_dro_hi array and convert values to numbers
          const reorderedPocDroHi: number[] = order.map(district => Number(districtMap[district]));

          //console.log(reorderedPocDroHi);

          this.NumberBoxForHazardFlood = reorderedPocDroHi
          this.showriskbuttonactive(5)

          //console.log(this.NumberBoxForHazardFlood);


          // Sort and process the sea level rise values
          this.updateMapColors(sealeavelvalues);

          const values = Object.keys(sealeavelvalues)
            .map(value => parseFloat(value)) // Convert to numbers for sorting
            .sort((a, b) => a - b); // Sort in ascending order

          Object.entries(sealeavelvalues).forEach(([sealeavelvalue, districts]) => {
            const sealeavelvalueStr = sealeavelvalue.toString();
            districts.forEach(district => {
              let color = '';
              if (this.selectedOption === "Sea level rise") {
                color = this.getColorforhazard(Number(sealeavelvalueStr), values); // Pass values array here
              }
              if (color) {
                //console.log(district, color);
                this.updateMap(district, color, 1);
              }
            });
          });
        }



        if (option === "Drought") {
          this.droughtBox = false;
          this.droughtoption = "Drought";
          this.PoCmmshow = false;

          const floodHiValues = getFloodHiValues(this.geoJSONDATA?.features);

          const resultArray: { District: string; poc_dro_hi: string; }[] = [];

          Object.keys(floodHiValues).forEach(floodHiValue => {
            const districts = Array.from(floodHiValues[floodHiValue]);
            const pocDroHiValue = floodHiValue; // Assuming floodHiValue is used for poc_dro_hi

            districts.forEach(district => {
              resultArray.push({
                District: district,
                poc_dro_hi: pocDroHiValue
              });
            });
          });

          //console.log(resultArray);


          // Define the order of districts
          const order: string[] = ['Puducherry', 'Karaikal', 'Yanam', 'Mahe'];

          // Create a map of districts to poc_dro_hi values
          const districtMap: { [key: string]: string } = resultArray.reduce((map, item) => {
            map[item.District] = item.poc_dro_hi;
            return map;
          }, {} as { [key: string]: string });

          // Generate the reordered poc_dro_hi array and convert values to numbers
          const reorderedPocDroHi: number[] = order.map(district => Number(districtMap[district]));

          //console.log(reorderedPocDroHi);

          this.NumberBoxForHazardFlood = reorderedPocDroHi


          //console.log(this.NumberBoxForHazardFlood);

          this.showriskbuttonactive(6)


          this.updateMapColors(floodHiValues);
          this.droughtvalueshow = true;
        }
      }
    }).catch((error) => {
      console.error('Error running loadGeoJsonData:', error);
    });

    if (this.typeOfHazard === "Spatial Extent") {

      //console.log(this.selectedOption);
      //console.log(option);


      if (this.timestamp === "") {
        this.timestamp = "Historical"
      }

      if (option === "Flood") {
        this.floodSubOption = true;
      } else {
        this.floodSubOption = false;
        this.PoCmmshow = false;
      }
      this.plotHazardSpatialExtentData(option, this.timestamp, this.floodslidervalue)
      //console.log(this.floodslidervalue);

      //console.log(this.timestamp);

    }

    this.floodSlidervaluetoshownonselectedindicator = this.floodslidervalue

  }


  getColorforhazard(value: number, values?: number[], colorArray: string[] = ['#ffff00', '#ffad00', '#ff6500', '#ff0000']) {
    if (values && values.length > 0) {
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      if (minValue === maxValue) {
        // If there's only one unique value, return the last color
        return colorArray[colorArray.length - 1];
      }

      const range = maxValue - minValue;
      const normalizedValue = (value - minValue) / range;
      const index = Math.floor(normalizedValue * (colorArray.length - 1));

      //console.log(`Value: ${value}, Min: ${minValue}, Max: ${maxValue}, Index: ${index}, Color: ${colorArray[index]}`);

      return colorArray[index];
    } else {
      // If no values array is provided, or if it's empty, return the default first color
      return colorArray[0];
    }
  }


  // comment 12th feb changing the legend 

  // updateMapColors(floodHiValues: FloodHiMap) {

  //   console.log( this.boxName);

  //   this.HeatwaveBOX = true;
  //   console.log(floodHiValues);

  //   const values = Object.keys(floodHiValues)
  //     .map(value => parseFloat(value)) // Convert to numbers for sorting
  //     .sort((a, b) => a - b); // Sort in ascending order

  //   this.numberBoxes = []; // Reset arrays
  //   this.colorBoxes = [];

  //   values.forEach(value => {
  //     const valueStr = value.toFixed(2); // Convert back to string with 2 decimal places
  //     const color = this.getColorforhazard(value, values); // Pass the sorted values array

  //     // Only add the unique value (avoid duplicates)
  //     if (!this.numberBoxes.includes(Number(valueStr))) {
  //       this.numberBoxes.push(Number(valueStr));

  //       console.log(Number(valueStr));

  //       this.colorBoxes.push(color);
  //     }
  //   });


  //   this.droughtvalueshow = true; // Assuming this triggers the display logic

  //   Object.entries(floodHiValues).forEach(([floodHiValue, districts]) => {
  //     const floodHiValueStr = floodHiValue.toString();
  //     districts.forEach(district => {
  //       let color = '';
  //       if (this.selectedOption === "Drought") {
  //         color = this.getColorforhazard(Number(floodHiValueStr), values); // Pass values array here too
  //       }
  //       if (color) {
  //         //console.log(district, color);
  //         this.updateMap(district, color, 1);
  //       }
  //     });
  //   });
  // }




  updateMapColors(floodHiValues: FloodHiMap) {
    console.log(this.boxName);

    this.HeatwaveBOX = true;
    console.log(floodHiValues);

    const values = Object.keys(floodHiValues)
      .map(value => parseFloat(value)) // Convert to numbers for sorting
      .sort((a, b) => a - b); // Sort in ascending order

    this.numberBoxes = []; // Reset arrays
    this.colorBoxes = [];

    // Define a mapping for boxName to corresponding district
    const boxMapping: { [key: string]: string } = {
      "one": "Puducherry",
      "two": "Karaikal",
      "three": "Yanam",
      "four": "Mahe",
    };

    // Ensure boxName is a string and fallback to "1" if it's null
    const selectedBox = this.boxName !== null ? String(this.boxName) : "one";
    const selectedDistrict = boxMapping[selectedBox];

    let selectedValue: number | null = null;

    // Find the corresponding floodHiValue dynamically
    Object.entries(floodHiValues).forEach(([floodHiValue, districts]) => {
      if (districts.has(selectedDistrict)) {
        selectedValue = parseFloat(floodHiValue);
      }
    });

    if (selectedValue !== null) {
      const color = this.getColorforhazard(selectedValue, values);
      this.numberBoxes.push(selectedValue);
      this.colorBoxes.push(color);
    }

    this.droughtvalueshow = true; // Assuming this triggers the display logic

    Object.entries(floodHiValues).forEach(([floodHiValue, districts]) => {
      const floodHiValueStr = floodHiValue.toString();
      districts.forEach(district => {
        let color = '';
        if (this.selectedOption === "Drought") {
          color = this.getColorforhazard(Number(floodHiValueStr), values);
        }
        if (color) {
          this.updateMap(district, color, 1);
        }
      });
    });
  }


































  // end




  updateMap(district: string, color: string, opacity: number) {
    //console.log("update map function.");

    this.maps.forEach(map => {
      map.eachLayer((layer: any) => {
        if (layer.feature && layer.feature.properties && layer.feature.properties.District === district) {
          if (typeof layer.setStyle === 'function') {
            layer.setStyle({ fillColor: color, fillOpacity: opacity });
            this.lodershow = false;
          } else {
            console.warn("Layer does not support setStyle:", layer);
          }
        }
      });
    });
  }






  expandBox(boxName: string) {

    // this.router.navigateByUrl('home/map')

  }




  shrinkBox(event: Event) {
    this.authservice.updateSelectedOption(this.selectedOption);
    this.router.navigateByUrl('home')
    this.authservice.updateVulnerabilityoptionsformap(this.Vulnerabilityoptionsformap)

  }



  isExpanded(boxName: string) {
    return this.expandedBox === boxName;
  }


  toggleHazardsContent() {
    this.isHazardsContentVisible = !this.isHazardsContentVisible;
    if (this.isVulnerabilityContentVisible) {
      this.isVulnerabilityContentVisible = false;
    }
    if (this.isExposureContentVisible) {
      this.isExposureContentVisible = false;
    }
  }

  toggleExposureContent() {
    this.isExposureContentVisible = !this.isExposureContentVisible;
    if (this.isVulnerabilityContentVisible) {
      this.isVulnerabilityContentVisible = false;
    }
    if (this.isHazardsContentVisible) {
      this.isHazardsContentVisible = false;
    }
  }

  toggleVulnerabilityContent() {
    //console.log(this.isVulnerabilityContentVisible);

    this.isVulnerabilityContentVisible = !this.isVulnerabilityContentVisible;
    if (this.isExposureContentVisible) {
      this.isExposureContentVisible = false;
    }
    if (this.isHazardsContentVisible) {
      this.isHazardsContentVisible = false;
    }
  }

  get selectedOptionsForExposure(): FormArray {
    return this.checkboxForm.get('selectedOptionsForExposure') as FormArray;
  }






  // Handle changes in the time selection radio buttons

  onSelectionChange(value: string) {
    this.hazardoptions = this.getUpdatedHazardOptions();
    // //console.log(value);
    // this.showRCP = value === "Future";
    if (value === "Future") {
      this.showRCP = true;
    }
    if (value === "Historical") {
      this.showRCP = false;
    }

    this.callExposureindicator()
    this.timestamp = value;
    this.timestampforexposure = value;

    // this.droughtoption

    if (this.floodSubOptionValue) {
      if (this.typeOfHazard === "Probability of Occurrence") {
        this.onSelectionChangeHazardsuboption(this.floodSubOptionValue)
        //console.log("this" );
      }



    } if (this.droughtoption) {
      this.onSelectionChangeHazards(this.droughtoption)
      //console.log("this");

    }

    //console.log(this.droughtoption);

  }







  getTooltip(indicatorName: string): string {
    const tooltips: { [key: string]: string } = {



      // Add more definitions here...



      "Cropping intensity": "Cropping intensity is defined as a ratio between net sown area (NSA) and gross cropped area (GCA). Higher the percentage, greater is the efficiency of land use.",


      "Percentage area under cluster-based farming": "Cluster-based farming (CbF) refers to the practice of organizing small groups or clusters of farmers to collectively engage in organic farming. Measured as the proportion of land in cluster-based farming to the net sown area (NSA). Cluster initiatives improve collective productivity by pooling resources and facilitating access to funds and certifications.",

      "Percentage of gross cropped area insured": "Gross crop area (GCA) represents the cumulative area sown once and/or more than once in a particular year. Insured gross crop area is the proportion of insured land to the total gross cropped area.",

      "Access to agricultural inputs": "Average number of agriculture input stores and seed processing units available per farmer, along with the number of tractors and tillers per net sown area.",

      "Percentage of workforce primarily employed in Agriculture": "Proportion of the total workforce that is engaged mainly in agricultural activities, including farming, livestock, forestry, and fishing.",

      "Percentage of small and marginal farmers": "Percentage of farmers with limited landholdings—1-2 hectares for small farmers and less than 1 hectare for marginal farmers—relative to the total landed agricultural farmers in a specified region.",
      "Percentage of net sown area that is solely rainfed": "Proportion of the total net sown area (NSA) that relies exclusively on rainfall, without supplemental irrigation from other sources.",

      "Yield variability": "Yield variability refers to the fluctuations in the production levels of primary crops over a specific period (2017-2022). This variability can be influenced by factors such as weather conditions, pest and disease outbreaks, soil fertility, farming practices, and access to agricultural inputs.",

      "Agricultural Dependence Disparity Index": "The Agriculture Dependence Disparity Index measures the difference between the percentage of the workforce dependent on agriculture and the share of agriculture in the district's domestic product (DDP). This index highlights the disparity between the agricultural sector's contribution to employment and its economic output within a district.",

      "Average soil moisture": "Average soil moisture is the mean water content in soil, expressed as a percentage, over each district for a specific time period. This value is essential for understanding soil water retention, which impacts plant growth, agriculture, and water management.",

      "Average Evapotranspiration": "Average evapotranspiration is defined as the mean rate at which water is transferred from land to the atmosphere through evaporation and plant transpiration over each district for a specific time period, usually expressed in mm per unit time. This measurement is critical for assessing water availability and agricultural productivity.",





      "Veterinary hospital burden": "Livestock population burden on a veterinary hospital refers to the ratio of the total number of livestock animals to the total number of veterinary hospitals. Higher the ratio, greater is the strain placed on veterinary services by the livestock population, affecting the hospital's ability to provide adequate care and treatment.",
      "Variation in livestock productivity": "Measured by the average productivity (for a period of 10 years) of livestock products such as milk, eggs, and meat. It reflects how productivity has increased, decreased, or fluctuated due to factors like breeding practices, feed quality, disease management, and environmental conditions.",
      "Livestock dependence disparity Index": "The Livestock Dependence Disparity Index measures the difference between the percentage of the workforce dependent on livestock and the share of livestock in the district's domestic product (DDP). This index highlights the disparity between the livestock sector's contribution to employment and its economic output within a district.",
      "Livestock to human ratio": "This indicator represents the number of livestock animals per farmer, calculated using data from the Livestock Census 2019 and the Census 2011, respectively. Higher the ratio, the greater the density of livestock in relation to the human population within a specific area.",
      "Female literacy rates": "Female literacy rate is the percentage of literate females over the age of six, calculated by dividing the number of literate females by the total female population above the age six. It measures the ability to at least comprehend simple information.",
      "Percentage of insured livestock": "Proportion of the total cattle population that is covered by insurance (for past 3-5 years) against prevalent bovine diseases (Babesiosis, Tetanus, Anthrax, Rabies). This indicator reflects the extent to which livestock owners have opted for financial protection to mitigate potential losses.",
      "Percentage of local breeds to total cattle population": "The proportion of indigenous or local breeds within the total cattle population of a specified region or area provides insight into the preservation and prevalence of traditional livestock breeds relative to introduced or hybrid varieties. Traditional livestock breeds are known to be more resilient than hybrid varieties.",
      "Percentage of livestock vaccinated": "This indicator represents the percentage of the total livestock population that has received necessary vaccinations. It measures the extent to which livestock owners have implemented preventive healthcare measures to protect their animals from contagious diseases and improve overall herd health.",


      "Access to essential infrastructure and financial support systems": "This indicator measures the availability of key infrastructure, such as harbours, cold storage facilities, processing units, work shelters, and co-operative societies, along with access to financial support, including loans, grants, and subsidies. It is quantified as the ratio of these assets and financial support to the total number of fisherfolk in the district.",
      "Involvement of female fisherfolk": "Proportion of working women participating in either the harvesting (catch) or commercial activities (sale) within the fishing industry. It highlights the role and contribution of females in the fisheries sector, providing insights into gender distribution.",
      "Percentage motorised vessels to total vessels": "Vessel motorisation is represented as the proportion of motorized boats within the entire fleet of vessels in each district. A higher proportion of motorised vessels can suggest better economic outcomes and improved livelihoods for fisherfolk.",
      "Average distance of coastal villages from the high tide line": "Average distance of coastal fishing villages from the High Tide Line (HTL) represents the proximity of these villages to the sea, increasing their susceptibility to coastal erosion, storm surges, and other impacts.",
      "Wetland density": "Wetland density refers to the concentration or number of wetlands within a specific area, measured as the area of freshwater and coastal wetlands per total coastal area. It indicates how densely wetlands are distributed in a given region or ecosystem, reflecting their spatial coverage and ecological significance within the landscape.",
      "Ratio of marine to inland fisherfolk": "This indicator measures the ratio of fisherfolk engaged in marine fishing compared to those involved in inland (freshwater-based) fishing activities within each district. High ratio indicates a greater reliance on marine resources.",
      "Fisheries Dependence Disparity Index": "The Fisheries Dependence Disparity Index measures the difference between the percentage of the workforce dependent on fisheries and the share of fisheries in the district's domestic product (DDP). This index highlights the disparity between the fisheries sector's contribution to employment and its economic output within a district.",
      "Fish yield variability": "Fish yield variability refers to the fluctuation in the number of fish caught or harvested over a specific period (2018-2022), encompassing both marine and inland fisheries. It reflects changes in fishery productivity.",

      "Infant mortality rates": "The infant mortality rate is the number of deaths of infants under one year of age per 1,000 live births in a given year.",
      "Population burden on medical facilities": "Ratio of the population to available medical facilities and institutions, such as hospitals, primary health care units (PHCs), and other healthcare providers. It reflects the demand for medical services relative to the capacity of healthcare infrastructure.",
      "Percentage of sensitive population": "Physically sensitive population includes the percentage of individuals below 6 years old, above 60 years old, disabled, or chronically ill, relative to the total population.",
      "Percentage of BPL households": "The percentage of households living below the poverty line (BPL) is computed as the percentage of the total number of households with BPL cards (issued to those identified as below the poverty line) to the total number of households. This metric indicates the proportion of households living below the poverty line within a given population.",
      "Diseases prevalence rate": "Disease prevalence is defined as the average number of reported cases of diseases such as dengue, typhoid, and tuberculosis over a particular period (past 3 years) per 1,000 individuals. This metric indicates the frequency of diseases within a population, allowing for comparisons across different populations for targeted action.",
      "Percentage of total population with health insurance coverage": "This metric reflects the extent to which individuals in a given area are protected against medical costs and have access to medical services through insurance coverage.",

      // "Female literacy rates": "Female literacy rate is the percentage of literate females over the age of six, calculated by dividing the number of literate females by the total female population above the age six. It measures the ability to at least comprehend simple information.",
      "Availability of reliable healthcare services": "Reliable healthcare services refer to the accessibility and quality of healthcare services within a population, encompassing factors such as availability of trained healthcare professionals, medical equipment, medications, and the reliability of service delivery.",

      "Ground water quality": "Ground water (GW) quality index measures the overall condition of ground water by assessing various parameters such as Total Dissolved Solids (TDS), pH, Total Alkalinity (TA), Total Hardness (TH), Nitrate (NO3), Chloride (Cl), Iron (Fe), and Sulphate (SO4), to determine the health and safety of groundwater for human consumption, and other uses.",
      "Disease prevalence rate": "Disease prevalence is defined as the average number of reported cases of diseases such as dengue, typhoid and tuberculosis over a particular period (past 3 years) per 1,000 individuals. This metric indicates the frequency and prevalence of diseases within a population, which can negatively affect tourism in those regions.",
      "Variation in tourists": "This indicator measures the changes in the influx of tourists (domestic and international) in a specific area over a definite period (average of 3 years).",
      "Tourist burden on hotels": "Tourist burden on hotels can be defined as the impact of tourist influx on hotel capacity and resources. Quantified as the number of hotels per 1,000 tourists.",
      "Tourist burden on police stations": "This indicator measures the number of police stations available per 1,000 tourists in each district. It reflects the level of law enforcement presence and potential capacity to ensure safety and security for tourists.",
      "Road density": "Road density is typically represented as the total length of the roads per unit area (sq. km). This metric reflects the extent of road infrastructure within a given area, influencing transportation accessibility and connectivity.",
      "Streetlight density": "Streetlight density refers to the number of streetlights per unit area (sq. km). This indicator reflects the level of street illumination and infrastructure in a particular area, contributing to safety, visibility, and urban planning.",
      "Surface water quality": "Surface water (SW) quality measures the condition of water in rivers, lakes, reservoirs, and other surface water bodies. It assesses parameters such as chemical composition, biological content, and physical characteristics to determine the health and safety of the water for ecosystems, human consumption, and other uses.",

      "Percentage of homes with basic amenities": "Basic amenities include access to drinking water within the house, a latrine within the premises, indoor cooking facilities, households (HH) that receive water from a treated source, and wastewater connected to a closed drain. This metric represents the standard of living for individuals residing in an area.",
      "Green and blue area density": "Green/blue area density measures the proportion of urban land covered by green spaces (such as parks, gardens, and forests) and blue spaces (such as lakes, rivers, and ponds). It represents the amount of natural and semi-natural areas within urban environments that provide essential ecosystem services.",
      "Percentage of homes in good liveable condition": "Proportion of residential households that meet acceptable standards of habitability and comfort. Pucca homes with structurally sound roofs and walls have been considered.",
      // "Surface water quality": "Surface water (SW) quality measures the condition of water in rivers, lakes, reservoirs, and other surface water bodies. It assesses parameters such as chemical composition, biological content, and physical characteristics to determine the health and safety of the water for ecosystems, human consumption, and other uses.",
      "Physically sensitive population density": "Population density is the number of individuals residing per square kilometre. A higher density indicates greater concentration of people in an area, influencing resource distribution and the overall liveability of the area.",
      "Economically vulnerable population": "Economically vulnerable population includes individuals or households classified as economically vulnerable due to being below the poverty line (BPL), having no income, relying on daily or irregular wages, or belonging to marginalized workforce groups.",
      "Percentage of slum households": "The urban slum population refers to the proportion of the urban population residing in slum households. A slum household (HH) is characterized by inadequate living conditions, typically lacking one or more of the following: access to improved water sources, improved sanitation facilities, sufficient living area, durable housing structures, and secure tenure.",
      "Population density": "Population density is a measure of the total population residing per unit of area.",
      "Percentage of households with a domestic water source": "Percentage of households equipped with bore wells, tube wells, open wells, and rainwater harvesting (RWH) systems. It reflects the accessibility and utilization of various water sources for domestic use within a specified area.",
      "Water harvesting potential": "Water harvesting (WH) potential measures the effectiveness of existing water harvesting systems (WHS) by calculating the number of such systems per 1,000 households. It reflects the capacity and utilization of water harvesting infrastructure within each district.",
      "Percentage of irrigated net sown area": "Irrigation potential refers to the percentage of the net irrigated area (NIA) to the total net sown area (NSA). This metric reflects the extent and utilization of irrigation infrastructure in agricultural practices.",
      // "Surface water quality": "Surface water (SW) quality measures the condition of water in rivers, lakes, reservoirs, and other surface water bodies. It assesses parameters such as chemical composition, biological content, and physical characteristics to determine the health and safety of the water for ecosystems, human consumption, and other uses.",
      "Percentage of homes connected to poor drainage": "This indicator represents the percentage of households (HH) that are connected to inadequate drainage systems, including those with open drains or no drainage facilities at all. It reflects the prevalence of substandard drainage infrastructure in each area.",
      // "Ground water quality": "Ground water (GW) quality index measures the overall condition of ground water by assessing various parameters such as Total Dissolved Solids (TDS), pH, Total Alkalinity (TA), Total Hardness (TH), Nitrate (NO3), Chloride (Cl), Iron (Fe), and Sulphate (SO4), to determine the health and safety of groundwater for human consumption, and other uses."




    };
    return tooltips[indicatorName] || "No additional information available.";
  }


















  sectoroption: number | undefined;

  Pleaseselectsector: boolean = true;

  // Toggle the dropdown menu
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  sectorname: string = '';
  valnerbalitydata: any
  valnerbality: boolean = false;
  // Select an option from the dropdown
  selectOption(option: any) {
    this.selectedOption = option;
    // //console.log(option);

    this.selectedOptionofsector = option
    //console.log(this.selectedOptionofsector.sector_name);
    this.sectorname = this.selectedOptionofsector.sector_name;

    this.sectoroption = option.id;

    const token = sessionStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`
    });

    this.resetHazardSelection();


    if (option.id === 0) {





    } else {
      this.authservice.getVulnerabilitiesIndicators(option.id, headers).subscribe((data: {
        vulnerability_name: string; indicators: any;
      }[]) => {
        // //console.log(data);

        this.valnerbalitydata = data;

        this.vulnerabilities = data[0].indicators
        this.vulnerability = data[0].vulnerability_name
        this.vulnerabilitysecond = data[1].vulnerability_name
        this.vulnerabilityseconddata = data[1].indicators

        if (this.logleselectall) {
          this.selectall()
        }

        this.valnerbality = true;
        // this.isVulnerabilityContentVisible = false;
        this.Pleaseselectsector = false
        this.selectionname = "Hazard SPS"
      }, (error: { status: number; }) => {
        // //console.log(error);
        if (error.status === 401) {
          alert("You need to login again");
          sessionStorage.removeItem('jwtToken');
          this.router.navigate(['']);
        }
      });

      this.callExposureindicator()

    }

    // console.log(this.sectoroption);


    // this.addCheckboxes();
  }


  /////////////////// commenting it for applyig the select all button in exposure ////////////////

  //     exposureIndicators: any

  ///////////////////////////////////////////////////////////////////////////////////////////// adding billow line/


  exposureIndicators: any[] = [];








  callExposureindicator() {

    if (this.timestamp === "") {
      this.timestamp = "Historical"
    }



    let var1: any | null = this.sectoroption;
    let var2: string | null = this.timestamp;
    let var3: string | null = this.droughtoption;
    let var4: string | null = this.valueofSubhazard


    function checkVars(var1: string | null, var2: string | null, var3: string | null, var4?: string | null): boolean {
      return !!(var1 && var2 && var3);
    }

    if (checkVars(var1, var2, var3, var4)) {


      function getInitials(inputString: string) {
        let words = inputString.split(' ');
        let initials = words.map(word => word[0].toLowerCase()).join('');
        return initials;
      }

      var timestamp = getInitials(this.timestamp);
      var hazardoption = getInitials(this.droughtoption);


      var noDataValue = `${hazardoption}_${timestamp}`

      if (this.droughtoption === "Flood") {
        noDataValue = `${hazardoption}${timestamp}_${this.valueofSubhazard}`
      }


      //  console.log(noDataValue);


      const token = sessionStorage.getItem('jwtToken');
      const headers = new HttpHeaders({
        'Authorization': `JWT ${token}`
      });



      this.authservice.getExposureIndicator(this.sectoroption, headers, noDataValue).subscribe((data: any[]) => {
        // console.log(data);
        //  console.log(this.addCheckedProperty(data));
        this.exposureIndicators = this.addCheckedProperty(data)

        // this.exposureLayers.forEach(layer => {
        //   this.maps.forEach(map => map.removeLayer(layer));
        // });

        this.deselectSelectAll();


      }, (error: { status: number; }) => {
        //console.log(error);
        if (error.status === 401) {
          alert("You need to login again");
          sessionStorage.removeItem('jwtToken');
          this.router.navigate(['']);
        }
      });



    } else {
      //  console.log("False: var1, var2, or var3 is missing (var4 is optional)");
    }




    // const noDataValue = "fh_2";


  }

  resetHazardSelection() {
    this.lodershow = true;
    this.radioForm.reset();
    console.log(this.timestamp, "kjfsdkk");
    if (this.timestamp === "") {
      this.timestamp = 'Historical'
    }

    this.showlegend = false;
    this.radioForm = this.fb.group({


      selectedOption: [this.timestamp]
    });


    this.removeGeoJsonLayer();

    this.loadGeoJsonData()

    this.droughtoption = ""
    this.lodershow = false;
  }




  // Color mapping for indicators and sub-indicators
  colorMap: { [key: string]: string } = {
    "Agriculture markets": "#156082",
    "Food processing units": "#E97132",
    "Net Sown Area": "#196B24",
    "Storage Godown": "#0F9ED5",



    "Essential infrastructure": "#156082",
    "Cold storage": "#E97132",
    'Community hall': "#196B24",
    'Diesel bunk': "#0F9ED5",
    'Fish auction hall': "#A02B93",
    'Fish curing yard': "#92D050",
    'Fish drying platform': "#663300",
    'Net mending sheds': "#7030A0",
    'Work shelters': "#0070C0",
    'Mangroves': "#669900",




    'Anganwadi': "#156082",
    'Medical facilities': "#E97132",
    'Diagnostic Centre': "#196B24",
    'Government hospital': "#0F9ED5",
    'Nursing Home': "#A02B93",
    'Pharmacy': "#92D050",
    'Private Hospital': "#996633",
    'Old Age Home': "#7030A0",





    
    'Cattle': "#156082",
    'Dairy Booth': "#E97132",
    'Dairy Farm': "#196B24",
    'Key village unit': "#0F9ED5",
    'Livestock population': "#A02B93",
    // 'Cattle' : '#92D050',
    'Chicken': '#E0416F',
    'Sheep': '#7030A0',
    'Medical facilities for Livestock': '#0070C0',
    'Poultry farm': '#669900',
    'Slaughterhouse': '#663300',
    'Veterinary dispensary': '#009999',
    'Slaughter house': '#009999',

    'Bus stand': '#156082',
    'Church': '#E97132',
    'Guesthouse': '#196B24',
    'Hotels, lodges and restaurants': '#0F9ED5',
    'Monument': '#A02B93',
    'Mosque': '#92D050',
    'Railway Station': '#996633',
    'Resort': '#7030A0',
    'Temple': '#0070C0',
    'Tourist Facility Centre': '#669900',



    'Green Space': '#156082',
    'Municipal urban area': '#E97132',
    'Railway line': '#196B24',
    // 'Railway Station': '#0F9ED5',
    'Road network': '#A02B93',




    'Canal': '#156082',
    'Check dam': '#156082',
    'Drainage Network': '#196B24',
    'River': '#A02B93',
    'Sewage Treatment Plant': '#92D050',
    'Waterbody': '#E0416F',
    'Water Pumping Station': '#7030A0',
    'Water Treatment Plant': '#0070C0',
  };



  // Function to get the background color based on the checked state and name
  getBackgroundColor(isChecked: boolean, name: string): string {
    return isChecked ? this.colorMap[name] || 'white' : 'white';
  }




  isAllSelected: boolean = false;







  onIndicatorChange(indicator: { checked: boolean; sub_indicators: any[]; }) {
    if (!indicator) {
      console.error('Indicator is null or undefined.');
      return;
    }
    this.PoCmmshow = false;
    // Toggle the parent indicator
    indicator.checked = !indicator.checked;

    // Check if `sub_indicators` exists and is an array
    if (Array.isArray(indicator.sub_indicators) && indicator.sub_indicators.length > 0) {
      indicator.sub_indicators.forEach(subIndicator => {
        // Ensure subIndicator is a valid object and not disabled
        if (subIndicator && !subIndicator.disable) {
          subIndicator.checked = indicator.checked;
        }
      });
    } else {
      console.warn('No valid sub_indicators found for the given indicator:', indicator);
    }

    this.updateSelectAllState();
    this.logSelected();
  }

  onSubIndicatorChange(indicator: { sub_indicators: any[]; checked: boolean; }, subIndicator: { checked: boolean; }) {
    // Toggle the child sub-indicator
    subIndicator.checked = !subIndicator.checked;
    this.PoCmmshow = false;
    // If all child sub-indicators are selected, check the parent indicator
    if (indicator.sub_indicators.every(sub => sub.checked || sub.disable)) {
      indicator.checked = true;
    } else {
      indicator.checked = false;
    }

    this.updateSelectAllState();
    this.logSelected();
  }


  // Method to deselect "Select All" programmatically
  deselectSelectAll() {
    this.isAllSelected = false; // Uncheck the "Select All" checkbox
    this.exposureIndicators.forEach(indicator => {
      indicator.checked = false; // Uncheck all parent indicators
      indicator.sub_indicators.forEach((sub: { checked: boolean; }) => {
        sub.checked = false; // Uncheck all sub-indicators
      });
    });
    this.logSelected();
  }

  // Handler for "Select All" checkbox change
  onSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isAllSelected = isChecked;
    this.exposureIndicators.forEach(indicator => {
      if (!indicator.disable) {
        indicator.checked = isChecked;
        indicator.sub_indicators.forEach((sub: { disable: any; checked: boolean; }) => {
          if (!sub.disable) {
            sub.checked = isChecked;
          }
        });
      }
    });

    this.logSelected();
  }



  updateSelectAllState() {
    this.isAllSelected = this.exposureIndicators.every(indicator =>
      indicator.checked || indicator.disable
    );
  }


  selectedIndicatorsforupdate: any

  exposurepercentagevaluenew: any




  // Log selected indicators and sub-indicators
  logSelected() {

    console.log(this.isAllSelected);
    this.showriskbuttonactive(10)
    const selectedIndicators = this.exposureIndicators
      .filter((indicator: { checked: any; sub_indicators: any[]; }) => indicator.checked || indicator.sub_indicators.some(sub => sub.checked))
      .map((indicator: { indicator_name: any; sub_indicators: any[]; }) => ({
        indicator_name: indicator.indicator_name,
        sub_indicators: indicator.sub_indicators
          .filter(sub => sub.checked)
          .map(sub => sub.sub_indicator_name)
      }));

    //  console.log('Selected Indicators and Sub-Indicators:', selectedIndicators);


    this.selectedIndicatorsforupdate = selectedIndicators;

    const token = sessionStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`
    });

    const selectedindicatorandsubindicator = this.exposureIndicators
      .filter((indicator: { checked: any; sub_indicators: any[]; }) => indicator.checked || indicator.sub_indicators.some(sub => sub.checked))
      .map((indicator: { indicator_name: any; indicator_id: any; sub_indicators: any[]; }) => ({
        indicator_name: indicator.indicator_name,
        indicator_id: indicator.indicator_id, // Include indicator_id
        sub_indicators: indicator.sub_indicators
          .filter(sub => sub.checked)
          .map(sub => ({
            sub_indicator_name: sub.sub_indicator_name,
            id: sub.id // Include id for sub-indicator
          }))
      }));



    // Step 2: Create separate arrays for indicator_ids and sub-indicator ids
    const indicatorIds = selectedindicatorandsubindicator.map((indicator: { indicator_id: any; }) => indicator.indicator_id);
    const subIndicatorIds = selectedindicatorandsubindicator
      .flatMap((indicator: { sub_indicators: { id: any; }[]; }) => indicator.sub_indicators.map((sub: { id: any; }) => sub.id)); // Flatten the sub-indicator id arrays

    // console.log('Indicator IDs:', indicatorIds);
    // console.log('Sub-Indicator IDs:', subIndicatorIds);






















    var cheksectorname = this.sectorname


    this.loadExposure()






    var firstVariable
    var secondIndicator



    function processIndicators(data: any[]) {
      let firstVariableIndicators: any[] = [];
      let firstVariableSubIndicators: any[] = [];
      let secondIndicatorIndicators: any[] = [];

      data.forEach(item => {
        if (item.sub_indicators && item.sub_indicators.length > 0) {
          firstVariableIndicators.push(item.indicator_name);
          firstVariableSubIndicators.push(...item.sub_indicators);
        } else {
          secondIndicatorIndicators.push(item.indicator_name);
        }
      });

      if (firstVariableIndicators.length > 0) {
        firstVariable = `Indicator IN (${firstVariableIndicators.map(ind => `'${ind}'`).join(', ')}) AND Sub_indica IN (${firstVariableSubIndicators.map(sub => `'${sub}'`).join(', ')})`;
        //  console.log("1. var firstVariable =", firstVariable);
      }

      if (secondIndicatorIndicators.length > 0) {
        secondIndicator = `Indicator IN (${secondIndicatorIndicators.map(ind => `'${ind}'`).join(', ')})`;
        //  console.log("2. var secondIndicator =", secondIndicator);
      }
    }




    // Example usage:
    const data = selectedIndicators;

    // console.log(data);


    //  console.log(selectedIndicators);



    // const sqlQuery = createSQLQuery(data);

    processIndicators(data);
    // console.log(secondIndicator);

    if (secondIndicator !== undefined) {
      //  console.log(secondIndicator);

    }

    if (firstVariable !== undefined) {
      //  console.log(firstVariable);
    }


    // console.log(sqlQuery);




    let sector = this.sectorname === "Fisheries" ? "Coastal resources and fisheries" : this.sectorname;

    const optionsMap: { [key: string]: { historical: string, future: string } } = {
      'Drought': { historical: 'Drought_hi', future: 'Dro_ssp4_5' },
      'Heatwave': { historical: 'Heatwave_h', future: 'HW_ssp4_5' },
      'Sea level rise': { historical: 'slr', future: 'slr' },
      'Flood': {
        historical: `Flood_his${this.floodslidervalue ?? ''}`,
        future: `Flood_fut${this.floodslidervalue ?? ''}`
      }
    };

    const droughtOptionsMap: { [key: string]: string } = {
      'Drought': 'Moderate drought',
      'Heatwave': ' ',
      'Sea level rise': this.timestampforexposure === 'Historical' ? 'SLR_historical' : 'SLR_4_5',
      'Flood': (this.floodslidervalue ?? '').toString()
    };

    let hazradoption = '';
    let droughtoption = '';

    if (this.droughtoption === 'Flood') {
      hazradoption = this.timestampforexposure === 'Historical' ? 'Flood_his' : 'Flood_fut';
      droughtoption = (this.floodslidervalue ?? '').toString();
    } else {
      // Use the maps defined above
      hazradoption = optionsMap[this.droughtoption]?.[this.timestampforexposure.toLowerCase() as 'historical' | 'future'] || '';
      droughtoption = droughtOptionsMap[this.droughtoption] || '';
    }


    const operator = this.droughtoption === "Heatwave" ? "<>" : "=";
    // let urlhalfpart = `json&cql_filter=sector='${sector}'AND ${hazradoption}${operator}'${droughtoption}'${sqlQuery}`;







    if (secondIndicator !== undefined) {
      let urlhalfpart = `json&cql_filter=(sector='${sector}'AND ${hazradoption}${operator}'${droughtoption}' AND ${secondIndicator})`
      // console.log(urlhalfpart);
      this.onSelectionChangeExposureoptions(urlhalfpart);
    }

    if (firstVariable !== undefined) {
      //console.log(firstVariable);
      if (secondIndicator === undefined) {
        // let urlhalfpart = `(sector='${sector}'AND ${hazradoption}${operator}'${droughtoption}' AND ${firstVariable})`
        // console.log(urlhalfpart);

        let urlhalfpart = `json&cql_filter=sector='${sector}'AND ${hazradoption}${operator}'${droughtoption}'AND ${firstVariable}`;

        this.onSelectionChangeExposureoptions(urlhalfpart);
      } else {
        let urlhalfpart = `json&cql_filter=(sector='${sector}'AND ${hazradoption}${operator}'${droughtoption}' AND ${secondIndicator}) OR
         (sector='${sector}'AND ${hazradoption}${operator}'${droughtoption}' AND ${firstVariable})`
        //  console.log(urlhalfpart);
        this.onSelectionChangeExposureoptions(urlhalfpart);
      }

    }



    if (selectedIndicators.length === 0) {
      let urlhalfpart = ''
      //  console.log(urlhalfpart);
      this.onSelectionChangeExposureoptions(urlhalfpart);
    }













    // for percentagedata from excel

    const result = selectedIndicators.reduce((acc: any[], item: { indicator_name: any; sub_indicators: any; }) => {
      acc.push(item.indicator_name);
      acc.push(...item.sub_indicators);
      return acc;
    }, []);


    // console.log(result);

    if (droughtoption === "Moderate drought") {
      this.stringvar = "drought"
    } else if (hazradoption === "Heatwave_h" || hazradoption === "HW_ssp4_5") {
      this.stringvar = "heatwave";
    } else if (droughtoption === "SLR_historical") {
      this.stringvar = "sea_level_rise_historic";
    } else if (droughtoption === "SLR_4_5") {
      this.stringvar = "sea_level_rise_future";
    } else if (hazradoption === "Flood_his") {
      this.stringvar = "flood_historic_" + droughtoption;
    } else if (hazradoption === "Flood_fut") {
      this.stringvar = "flood_future_" + droughtoption;
    }

    // console.log(droughtoption);




    const getExposurePercentageBody = {
      "sector_id": this.sectoroption,
      "exposure_indicator_id": indicatorIds,
      "sub_indicator_id": subIndicatorIds,
      "hazard": this.stringvar
    }


    if (indicatorIds.length > 0) {
      this.authservice.getExposurePercentageValue(getExposurePercentageBody, headers).subscribe((data: any) => {
        console.log(data);
        this.exposurepercentagevaluenew = data

        console.log(this.exposurepercentagevaluenew);
        const exposurepercentagevaluenewart: { [key: string]: number[] } = {};
        console.log(this.exposurepercentagevaluenew);
        if (this.exposurepercentagevaluenew) {
          Object.keys(this.exposurepercentagevaluenew).forEach(region => {
            // Cast the result of Object.values() to number[]
            const valuesArray = Object.values(this.exposurepercentagevaluenew[region]) as number[];
            exposurepercentagevaluenewart[region] = valuesArray;
          });
        } else {
          // Handle the case where this.exposurepercentagevaluenew is null or undefined
          console.error("this.exposurepercentagevaluenew is null or undefined");
        }
        if (this.isAllSelected) {
          this.callavragefunction(exposurepercentagevaluenewart)
        }

      }, (error: { status: number; }) => {
        if (error.status === 401) {
          alert("You need to login again");
          sessionStorage.removeItem('jwtToken');
          this.router.navigate(['']);
        }
      })
    } else {
      this.exposurepercentagevaluenew = {}
    }

  }






  getColorjhbjb(category: any): string {
    // console.log(category);

    return this.colorMap[category] || '#000'; // Default color if not found
  }

















  addCheckedProperty(data: any[]): any[] {
    return data.map(indicator => {
      indicator.checked = false;
      if (indicator.sub_indicators) {
        indicator.sub_indicators = indicator.sub_indicators.map((subIndicator: { checked: boolean; }) => {
          subIndicator.checked = false;
          return subIndicator;
        });
      }
      return indicator;
    });
  }




  // toggleCheck(item: any) {
  //   item.checked = !item.checked;
  //   this.result();
  // }


  toggleCheck(item: any) {
    item.checked = !item.checked;

    // Check if all indicators are selected
    const allIndicatorsSelected =
      this.vulnerabilities.every(v => v.checked) &&
      this.vulnerabilityseconddata.every((v: { checked: any; }) => v.checked);

    this.logleselectall = allIndicatorsSelected;

    this.result();
  }


  selectedindicatorofvalnarbilitydataonetoupdate: any

  selectedindicatorofvalnarbilitydatatwotoupdate: any





  result() {

    const checkedVulnerabilities = this.vulnerabilities?.filter(item => item.checked) || [];
    const checkedVulnerabilitySecondData = this.vulnerabilityseconddata?.filter((item: { checked: any; }) => item.checked) || [];
    const allCheckedItems = [...checkedVulnerabilities, ...checkedVulnerabilitySecondData];
    const selectedIds = allCheckedItems.map(item => item.id);
    this.onSelectionChangeVulnerabilityoptions(selectedIds)


    const vulnerabilities = this.vulnerabilities
      .filter(item => item.checked === true)
      .map(item => ({ indicator_name: item.indicator_name }));

    // console.log(vulnerabilities);

    this.selectedindicatorofvalnarbilitydataonetoupdate = vulnerabilities;
    this.loadVulnerabilityAdaptive()
    const vulnerabilityseconddata = this.vulnerabilityseconddata
      .filter((item: { checked: boolean; }) => item.checked === true)
      .map((item: { indicator_name: any; }) => ({ indicator_name: item.indicator_name }));

    // console.log(vulnerabilityseconddata);

    this.selectedindicatorofvalnarbilitydatatwotoupdate = vulnerabilityseconddata
    this.loadVulnerabilitySensitivity()
  }

  selectedindicator: any;

  loadHazard() {
    // Simulating fetching hazard data from a service
    this.hazard = [this.selectedOption];
  }

  loadExposure() {
    // Simulating fetching exposure data from a service
    this.exposure = this.selectedIndicatorsforupdate

  }

  loadVulnerabilityAdaptive() {
    // Simulating fetching vulnerabilityAdaptive data from a service
    this.vulnerabilityAdaptive = this.selectedindicatorofvalnarbilitydataonetoupdate
  }

  loadVulnerabilitySensitivity() {
    // Simulating fetching vulnerabilitySensitivity data from a service
    this.vulnerabilitySensitivity = this.selectedindicatorofvalnarbilitydatatwotoupdate
  }



  logleselectall: boolean = false

  selectall() {
    if (this.logleselectall) {
      function addCheckedProperty(array: any[]) {
        array.forEach(vulnerability => {
          vulnerability.indicators.forEach((indicator: any) => {
            indicator.checked = false;
          });
        });
      }

      addCheckedProperty(this.valnerbalitydata);
      this.logleselectall = false;
      this.result()
    } else {

      function addCheckedProperty(array: any[]) {
        array.forEach(vulnerability => {
          vulnerability.indicators.forEach((indicator: any) => {
            indicator.checked = true;
          });
        });
      }

      addCheckedProperty(this.valnerbalitydata);

      this.logleselectall = true

      this.result()


    }


  }




  get selectedOptionsforVulnerability() {
    return this.checkboxFormVulnerability.get('selectedOptionsforVulnerability') as FormArray;
  }

  getIndicatorsArray(index: number): FormArray {
    return this.selectedOptionsforVulnerability.at(index) as FormArray;
  }


  savedatatopassinerror: Data | undefined


  Vulnerabilityoptionsformap: any


  onSelectionChangeVulnerabilityoptions(value: any) {
    this.PoCmmshow = false;

    this.Vulnerabilityoptionsformap = value;
    console.log(value);

    if (value.length > 0) {

    } else {
      this.NumberBOXforShowRiskValnarbility = []
      this.showriskbuttonactive(7)
    }
    this.exposurepercentagevalue = {}

    // const districts = ["Karaikal", "Mahe", "Puducherry", "Yanam"];
    // districts.forEach(district => {
    //   this.removeLayer(district)
    // });

    const selectedIndicatorsObject = { "indicator_ids": value };
    console.log('Selected Indicators:', selectedIndicatorsObject);
    this.HeatwaveBOX = true;
    this.colorlesendtext = "Vulnerability Index";

    const token = sessionStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`
    });

    // Initialize arrays for number and color boxes
    this.numberBoxes = [];
    this.colorBoxes = [];




    console.log(this.sectoroption);



    this.authservice.getVulnerabilityinduxvalue(this.sectoroption, selectedIndicatorsObject, headers, "calling from map")
      .subscribe((data: { district_name: string; vulnerability_index: number | null; }[]) => {
        // Handle the response data
        this.savedatatopassinerror = data;

        // Reset arrays
        this.numberBoxes = [];
        this.colorBoxes = [];

        // Define a mapping for district_name based on boxName
        const boxMapping: { [key: string]: string } = {
          "one": "Puducherry",
          "two": "Karaikal",
          "three": "Yanam",
          "four": "Mahe",
        };

        // Ensure `boxName` is valid, default to "one" (Puducherry) if null
        const selectedBox = this.boxName !== null ? String(this.boxName) : "one";
        const selectedDistrict = boxMapping[selectedBox];

        data.forEach((district: { district_name: string; vulnerability_index: number | null; }) => {
          if (district.district_name === selectedDistrict) {
            let color;
            let value;

            if (district.vulnerability_index !== null) {
              // If value exists, round it to three decimal places
              value = parseFloat(district.vulnerability_index.toFixed(3));
              color = getColor(district.vulnerability_index);
            } else {
              // If value is null, use yellow color and explicitly push null
              value = null;
              color = "#ffff00";
            }

            // Update the map with the district name and color
            this.updateMap(district.district_name, color, 1);

            // Push vulnerability index (null or rounded value) to numberBoxes array
            this.numberBoxes.push(value); // Explicitly pushing null

            // Push the color to colorBoxes array
            this.colorBoxes.push(color);
          }
        });

        // If no matching district was found, ensure numberBoxes is empty
        if (this.numberBoxes.length === 0) {
          console.log(`No vulnerability index found for boxName: ${this.boxName}`);
        }

        this.NumberBOXforShowRiskValnarbility = this.numberBoxes;

        this.showriskbuttonactive(8);

        console.log(this.logleselectall);

        this.showlegend = true;

      }, (error: { error: { error: string; }; status: number; }) => {
        // Handle the error
        if (error.error.error === "No indicator IDs provided") {
          var setDistrictsFillOpacity = (opacity: number) => {
            if (this.savedatatopassinerror) {
              this.savedatatopassinerror['forEach']((district: { district_name: string; }) => {
                this.updateMap(district.district_name, "#ffff00", opacity);
              });
            }
          };

          setDistrictsFillOpacity(0);
          this.showlegend = false;
        }

        if (error.status === 401) {
          alert("You need to login again");
          sessionStorage.removeItem('jwtToken');
          this.router.navigate(['']);
        }
      });


    const colors = [
      "#ffff00", "#ffee00", "#ffd900", "#ffc300", "#ffad00",
      "#ff9500", "#ff7d00", "#ff6500", "#ff4c00", "#ff3333", "#ff0000"
    ];

    function getColor(vulnerability_index: number) {
      let index = Math.round(vulnerability_index * 10);
      index = Math.min(Math.max(index, 0), colors.length - 1);
      return colors[index];
    }


  }



  sliderControl = new FormControl<number>(0);

  stops = [
    { value: 2, label: '2' },
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];

  shrinkBoxchangepassword() {
    this.expandedBoxchangepassword = !this.expandedBoxchangepassword;
    this.isPopupVisible = !this.isPopupVisible;
  }

  floodslidervalue: string = "2";
  floodvalue: string = ""

  onSliderChange(event: Event): void {
    //this.resetSlider()

    this.resetOpacityTo100()
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = Number(inputElement.value);
    this.sliderControl.setValue(selectedValue);
    //console.log('Selected Stop:', this.stops[selectedValue].label);

    this.floodslidervalue = this.stops[selectedValue].label;
    //console.log(this.floodslidervalue);


    if (this.typeOfHazard === "Probability of Occurrence") {
      this.onSelectionChangeHazardsuboption(this.stops[selectedValue].label)
      //console.log(this.stops[selectedValue].label);

    }

    if (this.typeOfHazard === "Spatial Extent") {
      this.floodslidervalue = this.stops[selectedValue].label;
      this.floodvalue = this.stops[selectedValue].label;
      this.onSelectionChangeHazards("Flood")
    }
  }


  stringvar: string = ""



  // Store previously added layers
  private exposureLayers: L.Layer[] = [];



  subindicator: any;
  arrayforreadexcel: string[] = [];




  optionsMap: { [key: string]: { historical: string, future: string } };
  droughtOptionsMap: { [key: string]: string };





  toggleCheckforexposuresubindicator(event: Event, parentItem: any, subItem: any) {
    event.stopPropagation();
    subItem.checked = !subItem.checked;

    const checkSubIndicators = this.exposureindicators
      .flatMap((indicator: { sub_indicators: any[]; }) =>
        indicator.sub_indicators.filter(sub => sub.checked).map(sub => `'${sub.sub_indicator_name}'`)
      );

    this.subindicator = checkSubIndicators.join(',');

    let sector = this.sectorname === "Fisheries" ? "Coastal resources and fisheries" : this.sectorname;

    let hazradoption = '';
    let droughtoption = '';

    if (this.droughtoption === 'Flood') {
      hazradoption = this.timestampforexposure === 'Historical' ? 'Flood_his' : 'Flood_fut';
      droughtoption = (this.floodslidervalue ?? '').toString();
    } else {
      hazradoption = this.optionsMap[this.droughtoption]?.[this.timestampforexposure.toLowerCase() as 'historical' | 'future'] || '';
      droughtoption = this.droughtOptionsMap[this.droughtoption] || '';
    }

    const operator = this.droughtoption === "Heatwave" ? "<>" : "=";
    let urlhalfpart = `json&cql_filter=sector='${sector}'AND ${hazradoption}${operator}'${droughtoption}'AND Indicator IN (${this.selectedindicator})`;

    if (checkSubIndicators.length) {
      urlhalfpart += ` AND Sub_indica IN (${this.subindicator})`;
    }

    //console.log(urlhalfpart);


    this.onSelectionChangeExposureoptions(urlhalfpart);
  }



  geoJsonDatatocheck: any

  exposurepercentagevalue: any;




  callavragefunction(exposurepercentagevaluenewart: any) {
    console.log("from where 9 no is geting called ");
    console.log(exposurepercentagevaluenewart);
    const puducherry = exposurepercentagevaluenewart?.Puducherry?.map(Number);
    const karaikal = exposurepercentagevaluenewart?.Karaikal?.map(Number);
    const yanam = exposurepercentagevaluenewart?.Yanam?.map(Number);
    const mahe = exposurepercentagevaluenewart?.Mahe?.map(Number);

    console.log(puducherry, karaikal, yanam, mahe);

    function calculateAverage(arr: any[]) {
      if (arr?.length === 0) return 1; // Return 1 for empty arrays
      const sum = arr?.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      return sum / arr?.length;
    }

    // Calculate the averages
    const puducherryAvg = calculateAverage(puducherry);
    const karaikalAvg = calculateAverage(karaikal);
    const yanamAvg = calculateAverage(yanam);
    const maheAvg = calculateAverage(mahe);

    const averages = [puducherryAvg, karaikalAvg, yanamAvg, maheAvg];
    console.log(averages);

    this.NumberBOXforShowRiskExposure = averages;
    console.log(this.NumberBOXforShowRiskExposure);


    this.showriskbuttonactive(9)
  }



  exposurepercentagecolorforagri: string[] = ['#156082', '#E97132', '#196B24', '#0F9ED5', '#A02B93', '#92D050', '#E0416F', '#7030A0', '#0070C0', '#669900', '#663300'];






  urlhalfparttocheck: string = '';



  arrayone: string[] = [];
  arrayonefalse: boolean = true;









  onSelectionChangeExposureoptions(urlhalfpart: any) {
   // this.resetsecondslider()
    // console.log("calling");
    this. resetOpacityTo100forexposure()
    this.urlhalfparttocheck = urlhalfpart;

    // Remove previously added layers
    this.exposureLayers.forEach(layer => {
      this.maps.forEach(map => map.removeLayer(layer));
    });

    // Clear the array for new layers
    this.exposureLayers = [];

    const polygonIndicators = [
      'Net Sown Area', 'Mangroves', 'Cattle', 'Railway Station',
      'Livestock population', 'Green Space', 'Municipal urban area', 'Waterbody', 'Canal', 'Drainage Network',

    ];

    // Add new array for polygon sub-indicators
    const polygonsubIndicators = ['Cattle', 'Chicken', 'Sheep', 'Government hospital'];

    const pointIndicators = ['Essential infrastructure', 'Key village unit', 'Agriculture markets', 'Food processing units', 'Storage Godown', 'Medical facilities', 'Anganwadi', 'Old Age Home', 'Dairy Booth', 'Dairy Farm', 'Poultry farm', 'Slaughter House', 'Veterinary dispensary', 'Bus stand', 'Church', 'Guesthouse', 'Hotels lodges and restaurants', 'Monument', 'Mosque', 'Resort', 'Temple', 'Tourist Facility Centre', 'Water Pumping Station', 'Water Treatment Plant', 'Hotels, lodges and restaurants', 'Slaughterhouse', 'Sewage Treatment Plant', 'Medical facilities for Livestock', 'Slaughter house'];




    const pointSubIndicators = ['Cold storage', 'Community hall', 'Diesel bunk', 'Fish auction hall', 'Fish curing yard', 'Fish drying platform', 'Net mending sheds', 'Work shelters', 'Diagnostic Centre', 'Government hospital', 'Nursing Home', 'Pharmacy', 'Private Hospital',];



    const lineIndicators = ['Railway line', 'Road network', 'Check dam', 'River'];

    // Extract indicators and sub-indicators from urlhalfpart
    const indicatorMatch = urlhalfpart.match(/Indicator IN \(([^)]+)\)/);
    const indicators = indicatorMatch ? indicatorMatch[1].match(/'(.*?)'/g).map((ind: string) => ind.replace(/['"]/g, '')) : [];

    const subIndicatorMatch = urlhalfpart.match(/Sub_indica IN \(([^)]+)\)/);
    const subIndicators = subIndicatorMatch ? subIndicatorMatch[1].match(/'(.*?)'/g).map((subInd: string) => subInd.replace(/['"]/g, '')) : [];

    // Filter indicators and sub-indicators based on their relevance for each API
    const polygonIndicatorsToCall = indicators.filter((indicator: string) => polygonIndicators.includes(indicator));
    const pointIndicatorsToCall = indicators.filter((indicator: string) => pointIndicators.includes(indicator));
    const lineIndicatorsToCall = indicators.filter((indicator: string) => lineIndicators.includes(indicator));
    const pointSubIndicatorsToCall = subIndicators.filter((subIndicator: string) => pointSubIndicators.includes(subIndicator));

    // Filter polygon sub-indicators for polygon API
    const polygonSubIndicatorsToCall = subIndicators.filter((subIndicator: string) => polygonsubIndicators.includes(subIndicator));

    // Create an array to store promises for API calls
    const apiPromises: Promise<any>[] = [];

    // let APIAcordingtoSector = "crat:Polygon";

    let APIAcordingtoSector = "crat:Polygon0";


    // Process Polygon API call
    if (polygonIndicatorsToCall.length > 0) {
      let polygonUrlHalfPart = urlhalfpart;

      // Remove irrelevant sub-indicators from polygon API call
      if (polygonSubIndicatorsToCall.length > 0) {
        const polygonSubIndicatorsString = polygonSubIndicatorsToCall.map((subInd: any) => `'${subInd}'`).join(', ');
        polygonUrlHalfPart = polygonUrlHalfPart.replace(/Sub_indica IN \([^)]+\)/, `Sub_indica IN (${polygonSubIndicatorsString})`);
      } else {
        polygonUrlHalfPart = polygonUrlHalfPart.replace(/AND Sub_indica IN \([^)]+\)/, ''); // Remove sub-indicators if not applicable
      }

      const polygonIndicatorsString = polygonIndicatorsToCall.map((ind: any) => `'${ind}'`).join(', ');
      polygonUrlHalfPart = polygonUrlHalfPart.replace(/Indicator IN \([^)]+\)/, `Indicator IN (${polygonIndicatorsString})`);

      this.lodershow = true;

      const polygonUrl = `https://geoservermp.cstep.in:8443/geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${APIAcordingtoSector}&outputFormat=application/${polygonUrlHalfPart}`;

      // console.log("Final Polygon API URL:", polygonUrl);

      apiPromises.push(this.authservice.getpolygonDataGeoJSON(polygonUrlHalfPart).toPromise());
    }

    // Process Point API call
    if (pointIndicatorsToCall.length > 0 || pointSubIndicatorsToCall.length > 0) {
      let pointUrlHalfPart = urlhalfpart;

      const pointIndicatorsString = pointIndicatorsToCall.map((ind: any) => `'${ind}'`).join(', ');
      if (pointIndicatorsToCall.length > 0) {
        pointUrlHalfPart = pointUrlHalfPart.replace(/Indicator IN \([^)]+\)/, `Indicator IN (${pointIndicatorsString})`);
      }

      const pointSubIndicatorsString = pointSubIndicatorsToCall.map((subInd: any) => `'${subInd}'`).join(', ');
      if (pointSubIndicatorsToCall.length > 0) {
        pointUrlHalfPart = pointUrlHalfPart.replace(/Sub_indica IN \([^)]+\)/, `Sub_indica IN (${pointSubIndicatorsString})`);
      } else {
        pointUrlHalfPart = pointUrlHalfPart.replace(/AND Sub_indica IN \([^)]+\)/, ''); // Remove sub-indicators if not present
      }

      this.lodershow = true;
      const pointUrl = `https://geoservermp.cstep.in:8443/geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:Point0&outputFormat=application/${pointUrlHalfPart}`;

      // console.log("Final Point API URL:", pointUrl);

      apiPromises.push(this.authservice.getPointDataGeoJSON(pointUrlHalfPart).toPromise());
    }

    // Process Line API call
    if (lineIndicatorsToCall.length > 0) {
      let lineUrlHalfPart = urlhalfpart;

      // Remove sub-indicator if present
      lineUrlHalfPart = lineUrlHalfPart.replace(/AND Sub_indica IN \([^)]+\)/, '');

      const lineIndicatorsString = lineIndicatorsToCall.map((ind: any) => `'${ind}'`).join(', ');
      lineUrlHalfPart = lineUrlHalfPart.replace(/Indicator IN \([^)]+\)/, `Indicator IN (${lineIndicatorsString})`);

      this.lodershow = true;

      // const lineUrl = `https://geoservermp.cstep.in:8443/geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:a_02_CRAT_EXPOSURE_POLYLINEpolylinedata&outputFormat=application/${lineUrlHalfPart}`;


      const lineUrl = `https://geoservermp.cstep.in:8443/geoserver/crat/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=crat:Polyline0&outputFormat=application/${lineUrlHalfPart}`;

      // console.log("Final Line API URL:", lineUrl);

      apiPromises.push(this.authservice.getLineDataGeoJSON(lineUrlHalfPart).toPromise());
    }

    // Process all API calls once all promises are resolved
    Promise.all(apiPromises)
      .then((responses) => {
        responses.forEach((data: any) => {
          if (this.arrayonefalse) {
            this.arrayone = Array.from(new Set(data.features.map((feature: any) => feature.properties.Indicator).filter((value: string) => value)));
          }
          this.arrayonefalse = false;
          this.processGeoJsonData(data);
          this.geoJsonDatatocheck = data;
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        this.lodershow = false; // Hide loader regardless of success or failure
      });

  }




  subIndicaValues: string[] = [];
  indicatorValues: string[] = [];



  uniqueSubIndicaValues: string[] = [];
  subIndicaToIconMap: { [key: string]: string } = {};
  indicatorValuesnew: any;

 



  // processGeoJsonData(data: any) {
  //   if (data && data.features && data.features.length > 0) {
  //     this.maps.forEach(map => {
  //       const layer = L.geoJSON(data, {
  //         pointToLayer: (feature, latlng) => this.createMarker(feature, latlng),
  //         style: (feature) => this.polylineStyle(feature),
  //       }).addTo(map);

  //       this.exposureLayers.push(layer);
  //     });
  //   } else {
  //     this.notificationpopup = true;
  //     this.notificationtext = "Selected Indicator/Sub-Indicator not Exposed";
  //     setTimeout(() => { this.notificationpopup = false; }, 5000);
  //   }

  //   this.lodershow = false;
  // }



  processGeoJsonData(data: any) {
    if (data && data.features && data.features.length > 0) {
      this.maps.forEach(map => {
        const layer = L.geoJSON(data, {
          pointToLayer: (feature, latlng) => this.createMarker(feature, latlng), // Points
          style: (feature) => this.polylineStyle(feature), // Lines & Polygons
          onEachFeature: (feature, layer) => this.attachClickEvent(feature, layer) // Click events for lines & polygons
        }).addTo(map);
  
        this.exposureLayers.push(layer);
      });
    } else {
      this.notificationpopup = true;
      this.notificationtext = "Selected Indicator/Sub-Indicator not Exposed";
      setTimeout(() => { this.notificationpopup = false; }, 5000);
    }
  
    this.lodershow = false;
  }
  
  

  
  // addFeatureClickEvent(feature: any, layer: any) {
  //   const indicator = feature.properties.Indicator || "No Indicator";
  //   const subIndica = feature.properties.Sub_indica || "No Sub-indicator";
  
  //   const tooltipContent = `<strong>Indicator:</strong> ${indicator}<br><strong>Sub-indicator:</strong> ${subIndica}`;
  
  //   // ✅ Add click event for lines and polygons
  //   layer.on('click', () => {
  //     layer.bindPopup(tooltipContent).openPopup();
  //   });
  // }
  


  // attachClickEvent(feature: any, layer: any) {
  //   console.log("getting called");
    
  //   const indicator = feature.properties?.Indicator || "No Indicator";
  //   const subIndica = feature.properties?.Sub_indica || "No Sub-indicator";
  
  //   const popupContent = `<strong>Indicator:</strong> ${indicator}<br><strong>Sub-indicator:</strong> ${subIndica}`;
  
  //   // ✅ Attach click event for polygons & lines
  //   layer.on('click', (e: { latlng: any; }) => {
  //     layer.bindPopup(popupContent).openPopup(e.latlng);
  //   });
  // }

  attachClickEvent(feature: any, layer: any) {
    const indicator = feature.properties?.Indicator || "No Indicator";
    const subIndica = feature.properties?.Sub_indica;
  
    const popupContent = `
      <strong>Indicator:</strong> ${indicator}
      ${subIndica ? `<br><strong>Sub-indicator:</strong> ${subIndica}` : ''}
    `;
  
    layer.on('click', (e: { latlng: any; }) => {
      layer.bindPopup(popupContent).openPopup(e.latlng);
    });
  }
  
  



  notificationpopup: boolean = false;
  notificationtext: string = ""





  // Define colors for point data
  pointColors: string[] = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2", "#c9a243", "#ffce81"];

  getIndicatorColor(indicatorName: string): string {
    // Find the feature with the matching indicator name
    const feature = this.findFeatureByIndicator(indicatorName);
    // //console.log(indicatorName);
    //  console.log(feature);
    //  console.log(this.polylineStyle(feature).fillColor);

    return feature ? this.polylineStyle(feature).fillColor : '#fff'; // Default color if not found
  }


  getSubIndicatorColor(subIndicatorName: string): string {
    // Find the feature with the matching sub-indicator name
    const feature = this.findFeatureBySubIndicator(subIndicatorName);
    return feature ? this.polylineStyle(feature).fillColor : '#fff'; // Default color if not found
  }

  // Helper method to find the feature by Indicator name
  findFeatureByIndicator(indicatorName: string): any {
    return this.geoJsonDatatocheck?.features.find((feature: any) => feature.properties.Indicator === indicatorName);
  }

  // Helper method to find the feature by SubIndicator name
  findFeatureBySubIndicator(subIndicatorName: string): any {
    return this.geoJsonDatatocheck?.features.find((feature: any) => feature.properties.Sub_indica === subIndicatorName);
  }


  colorArray: string[] = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2", "#c9a243", "#ffce81"];

  // subIndicaToIconMapnew: { [key: string]: string } = {};
  subIndicaToColorMap: { [key: string]: string } = {}; // Map Sub_indica to color



  iconUrlsbyname: { [key: string]: string } = {
    "Cold storage": '../../assets/image/ColdStorage.png',
    "Community hall": '../../assets/image/Communityhall.png',
    "Diesel bunk": '../../assets/image/Dieselbunk.png',
    "Fish auction hall": '../../assets/image/Fishauctionhall.png',
    "Fish curing yard": '../../assets/image/Fishcuringyard.png',
    "Fish drying platform": '../../assets/image/Fishdryingplatform.png',
    "Net mending sheds": '../../assets/image/Netmendingsheds.png',
    "Work shelters": '../../assets/image/Workshelters.png',
    "Key village unit": '../../assets/image/0F9ED5.png',





    "Agriculture markets": '../../assets/image/Agriculturemarkets.png',
    "Food processing units": '../../assets/image/E97132.png',
    "Storage Godown": '../../assets/image/0F9ED5.png',



    'Anganwadi': '../../assets/image/Agriculturemarkets.png',
    'Diagnostic Centre': '../../assets/image/Communityhall.png',
    'Government hospital': '../../assets/image/0F9ED5.png',
    'Nursing Home': '../../assets/image/A02B93.png',
    'Pharmacy': '../../assets/image/92D050.png',
    'Private Hospital': "../../assets/image/996633.png",
    'Old Age Home': '../../assets/image/7030A0.png',





    'Dairy Booth': '../../assets/image/E97132.png',
    'Dairy Farm': '../../assets/image/196B24.png',
    'Poultry farm': '../../assets/image/669900.png',
    'Slaughterhouse': '../../assets/image/663300.png',
    'Veterinary dispensary': '../../assets/image/009999.png',
    'Slaughter house': '../../assets/image/009999.png',

    'Bus stand': '../../assets/image/Agriculturemarkets.png',
    'Church': '../../assets/image/E97132.png',
    'Guesthouse': '../../assets/image/196B24.png',
    'Hotels, lodges and restaurants': '../../assets/image/0F9ED5.png',
    'Monument': '../../assets/image/A02B93.png',
    'Mosque': '../../assets/image/92D050.png',
    'Railway Station': '../../assets/image/996633.png',
    'Resort': '../../assets/image/7030A0.png',
    'Temple': '../../assets/image/0070C0.png',
    'Tourist Facility Centre': '../../assets/image/669900.png',


    'Check dam': '../../assets/image/E97132.png',
    'Sewage Treatment Plant': '../../assets/image/92D050.png',
    'Water Pumping Station': '../../assets/image/7030A0.png',
    'Water Treatment Plant': '../../assets/image/0070C0.png',



  };





  mapSubIndicaToIcons() {
    this.uniqueSubIndicaValues.forEach((subIndica) => {
      // console.log(subIndica);

      const iconUrl = this.iconUrlsbyname[subIndica] || '../../assets/image/locationicon.png';  // Use default if not found
      const color = this.colorMap[subIndica] || '#000000'; // Default color if not found
      this.subIndicaToIconMap[subIndica] = iconUrl;
      this.subIndicaToColorMap[subIndica] = color;
    });
  }






  // createMarker(feature: any, latlng: any) {
  //   const subIndica = feature.properties.Sub_indica || 'Unknown';
  //   const indicator = feature.properties.Indicator || null;

  //   // Determine icon URL based on the available properties
  //   let iconUrl = '';

  //   if (indicator && this.iconUrlsbyname[indicator]) {
  //     // If Indicator exists and has a matching icon URL, use it
  //     iconUrl = this.iconUrlsbyname[indicator];
  //   } else if (this.iconUrlsbyname[subIndica]) {
  //     // If Sub_indica exists and has a matching icon URL, use it
  //     iconUrl = this.iconUrlsbyname[subIndica];
  //   } else {
  //     // Default icon if none found
  //     iconUrl = '../../assets/image/locationicon.png';
  //   }

  //   return L.marker(latlng, {
  //     icon: L.icon({
  //       iconUrl: iconUrl,
  //       iconSize: [15, 20], // Size of the icon
  //       iconAnchor: [16, 32], // Anchor point of the icon (center at the bottom)
  //       popupAnchor: [0, -32] // Anchor point of the popup
  //     }),
  //   });
  // }



  // createMarker(feature: any, latlng: any) {
  //   const subIndica = feature.properties.Sub_indica || 'Unknown';
  //   const indicator = feature.properties.Indicator || 'Unknown';
  
  //   const iconUrl = this.iconUrlsbyname[indicator] || this.iconUrlsbyname[subIndica] || '../../assets/image/locationicon.png';
  
  //   const marker = L.marker(latlng, {
  //     icon: L.icon({
  //       iconUrl: iconUrl,
  //       iconSize: [15, 20],
  //       iconAnchor: [8, 20],
  //       popupAnchor: [0, -20]
  //     }),
  //   });
  
  //   // ✅ Add click event to display popup
  //   marker.on('click', () => {
  //     marker.bindPopup(`<strong>Indicator:</strong> ${indicator}<br><strong>Sub-indicator:</strong> ${subIndica}`).openPopup();
  //   });
  
  //   return marker;
  // }




  createMarker(feature: any, latlng: any) {
    const subIndica = feature.properties.Sub_indica;
    const indicator = feature.properties.Indicator || 'Unknown';
  
    const iconUrl = this.iconUrlsbyname[indicator] || this.iconUrlsbyname[subIndica] || '../../assets/image/locationicon.png';
  
    const marker = L.marker(latlng, {
      icon: L.icon({
        iconUrl: iconUrl,
        iconSize: [15, 20],
        iconAnchor: [8, 20],
        popupAnchor: [0, -20]
      }),
    });
  
    // ✅ Construct popup content with conditional Sub-indicator
    const popupContent = `
      <strong>Indicator:</strong> ${indicator}
      ${subIndica ? `<br><strong>Sub-indicator:</strong> ${subIndica}` : ''}
    `;
  
    marker.on('click', () => {
      marker.bindPopup(popupContent).openPopup();
    });
  
    return marker;
  }
  
  
  


  polylineStyle(feature: any) {
    const indicator = feature.properties.Indicator || 'Unknown';
    const subIndica = feature.properties.Sub_indica || 'Unknown';

    const color = this.colorMap[subIndica] || this.colorMap[indicator] || '#000000';

    console.log(this.selectedLayerOpacity);

    return {
      color: color,                      // Line color
      fillColor: color,                  // Fill color
      fillOpacity: 1,                  // Keep it fixed or dynamic if needed
      weight: 1,
      opacity: this.selectedLayerOpacity, // Layer opacity controlled by slider
    };
  }







  floodslidervalueforspatialextent: any;



  plotHazardSpatialExtentData(option: string, timestamp: string, floodslidervalue: string) {
    this.lodershow = true;
    let sector: string = '';
    this.colorlesendtext = "Spatial Extent"

    const mapping: {
      [key: string]: {
        [key: string]: any;
      }
    } = {
      "Drought": {
        "Historical": { sector: "Drought_hi", indicatorname: "Moderate drought" },
        "Future": { sector: "Dro_ssp4_5", indicatorname: "Moderate drought" }
      },
      "Heatwave": {
        "Historical": { sector: "Heatwave_h", indicatorname: '' },
        "Future": { sector: "HW_ssp4_5", indicatorname: '' }
      },
      "Flood": {
        "Historical": {
          "2": { sector: "Flood_his" },
          "5": { sector: "Flood_his" },
          "10": { sector: "Flood_his" },
          "25": { sector: "Flood_his" },
          "50": { sector: "Flood_his" },
          "100": { sector: "Flood_his" }
        },
        "Future": {
          "2": { sector: "Flood_fut" },
          "5": { sector: "Flood_fut" },
          "10": { sector: "Flood_fut" },
          "25": { sector: "Flood_fut" },
          "50": { sector: "Flood_fut" },
          "100": { sector: "Flood_fut" }
        }
      },
      "Sea level rise": {
        "Historical": { sector: "slr", indicatorname: "SLR_historical" },
        "Future": { sector: "slr", indicatorname: "SLR_4_5" }
      }
    };

    if (option === "Flood") {
      const floodMapping = mapping[option][timestamp] as { [key: string]: { sector: string } };
      ({ sector } = floodMapping[floodslidervalue] || {});
    } else {
      ({ sector } = mapping[option][timestamp] || {});
    }

    const operator = option === "Heatwave" ? "<>" : "=";
    let urlhalfpart = "";


    // }
    if (option === "Flood") {
      const floodValues = ["2", "5", "10", "25", "50", "100"];
      const selectedFloodValues = floodValues.slice(0, floodValues.indexOf(floodslidervalue) + 1);

      const formattedValues = selectedFloodValues.join(","); // Join values with commas
      urlhalfpart = `json&cql_filter=${sector} IN (${formattedValues})`;

      this.valueofSubhazard = floodslidervalue;

      this.callExposureindicator();
    }
    else {
      urlhalfpart = `json&cql_filter=${sector} ${operator} '${mapping[option][timestamp]?.indicatorname}'`;
    }


    this.authservice.exposureHazradgeoJSON(urlhalfpart)
      .subscribe((data: any) => {
        this.printHWssp45Values(data);

        if (data && data.features && data.features.length > 0) {
          // Initialize an array to store layer references
          this.layers = [];

          this.maps.forEach(map => {
            // Add GeoJSON data to the map with custom style for polylines
            const geoJsonLayer = L.geoJSON(data, {
              style: (feature) => {
                return this.polylineStyleforhazardspacelextant(feature, option, timestamp, floodslidervalue);
              },
              onEachFeature: (feature, layer) => {
                // You can bind popups or other events here if needed
                layer.on({
                  // Add your event listeners if needed
                });
              }
            }).addTo(map);

            // Store the layer reference
            this.layers.push({ map, layer: geoJsonLayer });

            this.lodershow = false;
          });
        } else {
          console.error('GeoJSON data is invalid or empty');
          this.lodershow = false;
        }
      });

  }

  printHWssp45Values(data: any) {
    // Iterate over all features in the FeatureCollection
    data.features.forEach((feature: any) => {
      // Check if the "HW_ssp4_5" property exists
      if (feature.properties && "Flood_his" in feature.properties) {
        // //console.log(feature.properties["Flood_his"]);
      }
    });
  }



  // Function to define the style for GeoJSON points
  pointStyle(feature: any) {
    return {
      radius: 8,
      fillColor: "green",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5
    };
  }





  Sealevelriselegendcomment: string = "";







  polylineStyleforhazardspacelextant(feature: any, option: string, timestamp: string, floodslidervalue: string) {
    this.PoCmmshow = false;

    // Define color arrays for different scenarios
    const droughtColors = ["#D6B36D"];
    const heatwaveHistoricalColors = ["#64460c", "#b78830", "#efcb83", "white"];
    const heatwaveFutureColors = ["#724f00", "#9d741a", "#c9a243", "#ffce81"];
    const seaLevelRiseColors = ["#0080FF"];
    const floodHistoricalColors = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
    const floodFutureColors = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];

    // Define value mapping arrays
    const heatwaveHistoricalValues = [45, 44, 39, 0];
    const heatwaveFutureValues = [87, 54, 42, 6];
    const floodHistoricalValues = [2, 5, 10, 25, 50, 100];
    const floodFutureValues = [2, 5, 10, 25, 50, 100];

    let fillColor = "#fff"; // Default color

    // Logic for different options
    if (option === "Drought") {
      fillColor = droughtColors[0];
    } else if (option === "Heatwave") {
      this.sealeavelrisecomment = false;
      this.HeatwaveBOX = true;
      this.numberbox = true;
      this.nameoflegend = "Number of events";

      if (timestamp === "Historical") {
        const value = Number(feature.properties["Heatwave_h"]);
        const index = heatwaveHistoricalValues.indexOf(value);
        fillColor = index !== -1 ? heatwaveHistoricalColors[index] : fillColor;
      } else if (timestamp === "Future") {
        const value = Number(feature.properties["HW_ssp4_5"]);
        const index = heatwaveFutureValues.indexOf(value);
        fillColor = index !== -1 ? heatwaveFutureColors[index] : fillColor;
      }
    } else if (option === "Sea level rise") {
      this.sealeavelrisecomment = true;
      this.numberbox = false;

      if (timestamp === "Historical") {
        this.Sealevelriselegendcomment = "2000-2015(7cm)";
        this.nameoflegend = "SLR Historical";
      } else if (timestamp === "Future") {
        this.Sealevelriselegendcomment = "2041-2070";
        this.nameoflegend = "SSP2-4.5";
      }
      fillColor = seaLevelRiseColors[0];
    } else if (option === "Flood") {
      this.sealeavelrisecomment = false;
      this.numberbox = true;
      this.nameoflegend = "Return period";

      // Use the color for the selected floodslidervalue for all features
      if (timestamp === "Historical") {
        const index = floodHistoricalValues.indexOf(Number(floodslidervalue));
        fillColor = index !== -1 ? floodHistoricalColors[index] : fillColor;
      } else if (timestamp === "Future") {
        const index = floodFutureValues.indexOf(Number(floodslidervalue));
        fillColor = index !== -1 ? floodFutureColors[index] : fillColor;
      }
    }

    // Update colorBoxes and numberBoxes arrays based on the current selection
    this.updateBoxes(option, timestamp, floodslidervalue);

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 0,
      fillOpacity: 1
    };
  }



  // updateBoxes(option: string, timestamp: string, floodslidervalue: string) {
  //   // Reset arrays
  //   this.colorBoxes = [];
  //   this.numberBoxes = [];

  //   // Logic to update the boxes based on the option, timestamp, and floodslidervalue
  //   if (option === "Drought") {
  //     this.droughtBox = true;
  //     this.HeatwaveBOX = false;
  //     this.colorBoxes = ["#D6B36D"];
  //     this.numberBoxes = [0];
  //   } else if (option === "Heatwave") {
  //     this.HeatwaveBOX = true;
  //     this.droughtBox = false;
  //     if (timestamp === "Historical") {
  //       this.colorBoxes = ["#64460c", "#b78830", "#efcb83", "white"];
  //       this.numberBoxes = [88, 54, 44, 0];
  //     } else if (timestamp === "Future") {
  //       this.colorBoxes = ["#724f00", "#9d741a", "#c9a243", "#ffce81"];
  //       this.numberBoxes = [74, 65, 44, 29];
  //     }
  //   } else if (option === "Sea level rise") {
  //     this.HeatwaveBOX = true;
  //     this.droughtBox = false;
  //     this.colorBoxes = ["#0080FF"];
  //     this.numberBoxes = [0];
  //   } else if (option === "Flood") {
  //     this.HeatwaveBOX = true;
  //     this.droughtBox = false;
  //     if (timestamp === "Historical") {
  //       this.colorBoxes = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
  //       this.numberBoxes = [2, 5, 10, 25, 50, 100];
  //     } else if (timestamp === "Future") {
  //       this.colorBoxes = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
  //       this.numberBoxes = [2, 5, 10, 25, 50, 100];
  //     }
  //   }
  // }








  // updateBoxes(option: string, timestamp: string, floodslidervalue: string) {
  //   // Reset arrays
  //   this.colorBoxes = [];
  //   this.numberBoxes = [];

  //   // Logic to update the boxes based on the option, timestamp, and floodslidervalue
  //   if (option === "Drought") {
  //     this.droughtBox = true;
  //     this.HeatwaveBOX = false;
  //     this.colorBoxes = ["#D6B36D"];
  //     this.numberBoxes = [0];
  //   } else if (option === "Heatwave") {
  //     this.HeatwaveBOX = true;
  //     this.droughtBox = false;

  //     console.log(this.boxName);

  //     // Define boxName mapping
  //     const boxMapping: { [key: string]: number } = {
  //       "one": 88,
  //       "two": 55,
  //       "three": 44,
  //       "four": 0,
  //     };




  //     // Ensure boxName is a valid string and default to "1" if null
  //     const selectedBox = this.boxName !== null ? String(this.boxName) : "one";
  //     console.log(selectedBox);
  //     console.log(boxMapping[selectedBox]);

  //     const selectedValue = boxMapping[selectedBox] 

  //     if (timestamp === "Historical") {
  //       this.colorBoxes = ["#64460c", "#b78830", "#efcb83", "white"];
  //       this.numberBoxes = [selectedValue]; // Assign selected value
  //     } else if (timestamp === "Future") {
  //       this.colorBoxes = ["#724f00", "#9d741a", "#c9a243", "#ffce81"];
  //       this.numberBoxes = [selectedValue]; // Assign selected value
  //     }
  //   } else if (option === "Sea level rise") {
  //     this.HeatwaveBOX = true;
  //     this.droughtBox = false;
  //     this.colorBoxes = ["#0080FF"];
  //     this.numberBoxes = [0];
  //   } else if (option === "Flood") {
  //     this.HeatwaveBOX = true;
  //     this.droughtBox = false;
  //     if (timestamp === "Historical") {
  //       this.colorBoxes = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
  //       this.numberBoxes = [2, 5, 10, 25, 50, 100];
  //     } else if (timestamp === "Future") {
  //       this.colorBoxes = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
  //       this.numberBoxes = [2, 5, 10, 25, 50, 100];
  //     }
  //   }
  // }




  updateBoxes(option: string, timestamp: string, floodslidervalue: string) {
    // Reset arrays
    this.colorBoxes = [];
    this.numberBoxes = [];

    // Logic to update the boxes based on the option, timestamp, and floodslidervalue
    if (option === "Drought") {
      this.droughtBox = true;
      this.HeatwaveBOX = false;
      this.colorBoxes = ["#D6B36D"];
      this.numberBoxes = [0];
    } else if (option === "Heatwave") {
      this.HeatwaveBOX = true;
      this.droughtBox = false;

      console.log(this.boxName);

      // Define mappings for Historical and Future
      const boxMappingHistorical: { [key: string]: number } = {
        "one": 45,
        "two": 44,
        "three": 39,
        "four": 0,
      };

      const boxMappingFuture: { [key: string]: number } = {
        "one": 87,
        "two": 54,
        "three": 42,
        "four": 6,
      };

      // Ensure boxName is a valid string and default to "one" if null
      const selectedBox = this.boxName !== null ? String(this.boxName) : "one";
      console.log(selectedBox);

      // Choose the correct mapping based on timestamp
      const selectedValue =
        timestamp === "Historical"
          ? boxMappingHistorical[selectedBox]
          : boxMappingFuture[selectedBox];

      console.log(selectedValue);

      // Assign color and number boxes based on timestamp
      if (timestamp === "Historical") {
        const colorMappingHistorical: { [key: string]: string } = {
          "one": "#64460c",
          "two": "#b78830",
          "three": "#efcb83",
          "four": "white",
        };
        this.colorBoxes = [colorMappingHistorical[selectedBox]];
        this.numberBoxes = [selectedValue];
      } else if (timestamp === "Future") {
        const colorMappingFuture: { [key: string]: string } = {
          "one": "#724f00",
          "two": "#9d741a",
          "three": "#c9a243",
          "four": "#ffce81",
        };
        this.colorBoxes = [colorMappingFuture[selectedBox]];
        this.numberBoxes = [selectedValue];
      }
    } else if (option === "Sea level rise") {
      this.HeatwaveBOX = true;
      this.droughtBox = false;
      this.colorBoxes = ["#0080FF"];
      this.numberBoxes = [0];
    } else if (option === "Flood") {
      this.HeatwaveBOX = true;
      this.droughtBox = false;
      if (timestamp === "Historical") {
        this.colorBoxes = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
        this.numberBoxes = [2, 5, 10, 25, 50, 100];
      } else if (timestamp === "Future") {
        this.colorBoxes = ["#e81315", "#f67a32", "#ffcd54", "#d5e47f", "#8db9a0", "#2b91c2"];
        this.numberBoxes = [2, 5, 10, 25, 50, 100];
      }
    }
  }




























  // Example functions to get color and opacity based on district
  getColorForDistrict(district: string): string {
    switch (district) {
      case "Karaikal":
        return "red";
      case "Mahe":
        return "blue";
      case "Puducherry":
        return "green";
      case "Yanam":
        return "yellow";
      default:
        return "grey";
    }
  }

  getOpacityForDistrict(district: string): number {
    switch (district) {
      case "Karaikal":
        return 0.8;
      case "Mahe":
        return 0.6;
      case "Puducherry":
        return 0.4;
      case "Yanam":
        return 0.2;
      default:
        return 0.5;
    }
  }



  showriskbuttonactive(variable: number) {

    console.log(variable);

    // console.log(this.NumberBOXforShowRiskValnarbility.length);

    // console.log(this.NumberBoxForHazardFlood.length);

    // console.log(this.NumberBOXforShowRiskExposure.length);

    if (this.logleselectall && this.NumberBoxForHazardFlood.length > 0 && this.isAllSelected) {

      this.isButtonDisabled = false

    } else {
      this.isButtonDisabled = true
    }
  }



  // showriskbutton() {
  //   this.isButtonDisabled = true;

  //   // Remove existing layers
  //   this.exposureLayers.forEach(layer => {
  //     this.maps.forEach(map => map.removeLayer(layer));
  //   });

  //   // Normalize values
  //   this.NumberBoxForHazardFlood = this.NumberBoxForHazardFlood.map(element => element / 100);
  //   this.NumberBOXforShowRiskExposure = this.NumberBOXforShowRiskExposure.map(element => element / 100);

  //   this.showlegend = false;
  //   this.colorlesendtext = "Risk";
  //   this.nameoflegend = "";
  //   const results = [];

  //   // Calculate cube root for each index and populate results array
  //   for (let i = 0; i < 4; i++) {
  //     const valnarbility = this.NumberBOXforShowRiskValnarbility[i];
  //     const hazardFlood = this.NumberBoxForHazardFlood[i];
  //     const exposure = this.NumberBOXforShowRiskExposure[i];

  //     const cubeRoot = Math.pow(hazardFlood * exposure * valnarbility, 1 / 3);
  //     results.push(cubeRoot);
  //   }

  //   console.log(results);

  //   // Filter out NaN values for threshold calculation
  //   const validResults = results.filter(value => !isNaN(value));

  //   // Determine lowest and highest values from valid results
  //   const lowestValue = Math.min(...validResults);
  //   const highestValue = Math.max(...validResults);

  //   // Define zones
  //   const lowThreshold = lowestValue + (highestValue - lowestValue) / 3;
  //   const mediumThreshold = lowestValue + 2 * (highestValue - lowestValue) / 3;

  //   this.showlegend = true;

  //   const districts = ['Puducherry', 'Karaikal', 'Yanam', 'Mahe'];
  //   const zoneColors = {
  //     low: '#008000', // Green for Low
  //     medium: '#FFFF00', // Yellow for Medium
  //     high: '#FF0000', // Red for High
  //     nan: '#FFFFFF' // White for NaN
  //   };

  //   // Assign colors based on zones and plot on map
  //   for (let index = 0; index < districts.length; index++) {
  //     const vulnerabilityIndex = results[index];
  //     let color;

  //     if (isNaN(vulnerabilityIndex)) {
  //       color = zoneColors.nan; // Assign white if NaN
  //     } else if (vulnerabilityIndex <= lowThreshold) {
  //       color = zoneColors.low;
  //     } else if (vulnerabilityIndex <= mediumThreshold) {
  //       color = zoneColors.medium;
  //     } else {
  //       color = zoneColors.high;
  //     }

  //     this.updateMap(districts[index], color, 1);
  //   }

  //   // Update legend
  //   const span = ['Low', 'Medium', 'High'];
  //   const colorforleasend = [zoneColors.low, zoneColors.medium, zoneColors.high];
  //   this.numberBoxes = [];
  //   this.colorBoxes = [];

  //   for (let index = 0; index < 3; index++) {
  //     this.numberBoxes[index] = span[index];
  //     this.colorBoxes[index] = colorforleasend[index];
  //   }

  // }

  showriskbutton() {
    this.isButtonDisabled = true;
    this.exposurepercentagevaluenew = {}

    // Remove existing layers
    this.exposureLayers.forEach(layer => {
      this.maps.forEach(map => map.removeLayer(layer));
    });

    // Normalize values
    this.NumberBoxForHazardFlood = this.NumberBoxForHazardFlood.map(element => element / 100);
    this.NumberBOXforShowRiskExposure = this.NumberBOXforShowRiskExposure.map(element => element / 100);

    this.showlegend = false;
    this.colorlesendtext = "Risk";
    this.nameoflegend = "";
    const results = [];

    // Calculate cube root for each index and populate results array
    for (let i = 0; i < 4; i++) {
      const valnarbility = this.NumberBOXforShowRiskValnarbility[i];
      const hazardFlood = this.NumberBoxForHazardFlood[i];
      const exposure = this.NumberBOXforShowRiskExposure[i];

      const cubeRoot = Math.pow(hazardFlood * exposure * valnarbility, 1 / 3);
      results.push(cubeRoot);
    }

    console.log(results);

    // Filter out NaN values for threshold calculation
    const validResults = results.filter(value => !isNaN(value));

    // Determine lowest and highest values from valid results
    const lowestValue = Math.min(...validResults);
    const highestValue = Math.max(...validResults);

    // Define zones
    const lowThreshold = lowestValue + (highestValue - lowestValue) / 3;
    const mediumThreshold = lowestValue + 2 * (highestValue - lowestValue) / 3;

    this.showlegend = true;

    // Map district names to boxName
    const boxMapping: { [key: string]: string } = {
      "one": "Puducherry",
      "two": "Karaikal",
      "three": "Yanam",
      "four": "Mahe",
    };

    // Ensure `boxName` is valid, default to "one" (Puducherry) if null
    const selectedBox = this.boxName !== null ? String(this.boxName) : "one";
    const selectedDistrict = boxMapping[selectedBox];

    // Define zone colors
    const zoneColors = {
      low: '#008000', // Green for Low
      medium: '#FFFF00', // Yellow for Medium
      high: '#FF0000', // Red for High
      nan: '#FFFFFF' // White for NaN
    };

    this.numberBoxes = [];
    this.colorBoxes = [];

    // Find the index of the selected district
    const districtIndex = Object.values(boxMapping).indexOf(selectedDistrict);

    if (districtIndex !== -1) {
      const vulnerabilityIndex = results[districtIndex];
      let color;
      let riskLevel = "Low"; // Default to Low

      if (isNaN(vulnerabilityIndex)) {
        color = zoneColors.nan; // Assign white if NaN
        riskLevel = "NaN"; // Show NaN
      } else if (vulnerabilityIndex <= lowThreshold) {
        color = zoneColors.low;
        riskLevel = "Low";
      } else if (vulnerabilityIndex <= mediumThreshold) {
        color = zoneColors.medium;
        riskLevel = "Medium";
      } else {
        color = zoneColors.high;
        riskLevel = "High";
      }

      // Update only the selected district on the map
      this.updateMap(selectedDistrict, color, 1);

      // Assign "Low", "Medium", or "High" to numberBoxes
      this.numberBoxes.push(riskLevel);
      this.colorBoxes.push(color);
    }

    console.log("Final numberBoxes:", this.numberBoxes);
    console.log("Final colorBoxes:", this.colorBoxes);
  }





  removeLayer(district: string) {
    this.maps.forEach(map => {
      let layersToRemove: any[] = [];

      map.eachLayer((layer: any) => {
        if (layer.feature && layer.feature.properties && layer.feature.properties.District === district) {
          layersToRemove.push(layer);
        }
      });

      layersToRemove.forEach(layer => {
        map.removeLayer(layer);
      });
    });
  }









}
