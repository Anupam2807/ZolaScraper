export interface ZoningDetails {
  lists: string[];
  lot: {
    'Building Class': string;
    'Building Info': string;
    'Gross Floor Area': string;
    'Housing Info': string;
    'Land Use': string;
    'Lot Area': string;
    'Lot Depth': string;
    'Lot Frontage': string;
    'Number of Buildings': string;
    'Number of Floors': string;
    Owner: string;
    'Property Records': string;
    'Residential Units': string;
    'Total # of Units': string;
    'Year Built': string;
  };
  neighborhood: {
    'City Council District': string;
    'Community District': string;
    'Fire Company': string;
    'Police Precinct': string;
    'Sanitation Borough': string;
    'Sanitation District': string;
    'Sanitation Subsection': string;
    'School District': string;
  };
  paragraphs: string[];
  title: string;
  zoningDetails: string[];
}

export interface SearchHistoryItem {
  address: string;
  timestamp: number;
}