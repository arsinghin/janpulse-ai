export interface LocationOption {
  state: string;
  districts: {
    name: string;
    localities: string[];
    coordinates: { lat: number; lng: number };
  }[];
}

export const INDIAN_LOCATIONS: LocationOption[] = [
  {
    state: 'Uttar Pradesh',
    districts: [
      {
        name: 'Varanasi',
        localities: ['Sigra', 'Godowlia', 'Assi Ghat Ward', 'Shivpur', 'Lanka', 'Manduadih'],
        coordinates: { lat: 25.3176, lng: 82.9739 },
      },
      {
        name: 'Lucknow',
        localities: ['Hazratganj', 'Alambagh', 'Gomti Nagar', 'Indira Nagar', 'Aminabad'],
        coordinates: { lat: 26.8467, lng: 80.9462 },
      },
      {
        name: 'Kanpur',
        localities: ['Kalyanpur', 'Civil Lines', 'Govind Nagar', 'Kakadeo', 'Shuklaganj Border'],
        coordinates: { lat: 26.4499, lng: 80.3319 },
      },
      {
        name: 'Prayagraj',
        localities: ['Civil Lines', 'Katra', 'Naini Industrial Area', 'Daraganj', 'Jhalwa'],
        coordinates: { lat: 25.4358, lng: 81.8463 },
      },
      {
        name: 'Gorakhpur',
        localities: ['Golghar', 'Mohaddipur', 'Medical College Road', 'Bashratpur'],
        coordinates: { lat: 26.7606, lng: 83.3732 },
      },
    ],
  },
  {
    state: 'Bihar',
    districts: [
      {
        name: 'Patna',
        localities: ['Kankarbagh', 'Boring Road', 'Rajendra Nagar', 'Danapur', 'Patna City'],
        coordinates: { lat: 25.5941, lng: 85.1376 },
      },
      {
        name: 'Gaya',
        localities: ['Bodhgaya Road', 'Civil Lines', 'Rampur', 'Manpur'],
        coordinates: { lat: 24.7955, lng: 85.0002 },
      },
      {
        name: 'Muzaffarpur',
        localities: ['Brahmpura', 'Mithanpura', 'Ahiyapur', 'Zero Mile'],
        coordinates: { lat: 26.1209, lng: 85.3647 },
      },
      {
        name: 'Bhagalpur',
        localities: ['Tilkamanjhi', 'Adampur', 'Sabour Rural', 'Mirjanhat'],
        coordinates: { lat: 25.2425, lng: 86.9842 },
      },
    ],
  },
  {
    state: 'Maharashtra',
    districts: [
      {
        name: 'Pune',
        localities: ['Hadapsar', 'Hinjawadi', 'Kothrud', 'Wagholi', 'Katraj', 'Kharadi'],
        coordinates: { lat: 18.5204, lng: 73.8567 },
      },
      {
        name: 'Nagpur',
        localities: ['Dharampeth', 'Sitabuldi', 'Manish Nagar', 'Wardhaman Nagar'],
        coordinates: { lat: 21.1458, lng: 79.0882 },
      },
      {
        name: 'Nashik',
        localities: ['Panchavati', 'Satpur MIDC', 'CIDCO Colony', 'Indira Nagar'],
        coordinates: { lat: 19.9975, lng: 73.7898 },
      },
      {
        name: 'Thane',
        localities: ['Ghodbunder Road', 'Naupada', 'Kopri', 'Wagle Estate'],
        coordinates: { lat: 19.2183, lng: 72.9781 },
      },
    ],
  },
  {
    state: 'Telangana',
    districts: [
      {
        name: 'Hyderabad',
        localities: ['Kukatpally', 'Charminar Ward', 'Uppal', 'Gachibowli Old Village', 'Secunderabad Station'],
        coordinates: { lat: 17.3850, lng: 78.4867 },
      },
      {
        name: 'Warangal',
        localities: ['Hanamkonda', 'Kazipet', 'Subedari', 'Hunter Road'],
        coordinates: { lat: 17.9689, lng: 79.5941 },
      },
      {
        name: 'Nizamabad',
        localities: ['Khaleelwadi', 'Bodhan Road', 'Armoor Junction'],
        coordinates: { lat: 18.6725, lng: 78.0941 },
      },
    ],
  },
  {
    state: 'Tamil Nadu',
    districts: [
      {
        name: 'Chennai',
        localities: ['Velachery', 'Tambaram', 'T. Nagar', 'Ambattur Industrial', 'Perambur', 'Madipakkam'],
        coordinates: { lat: 13.0827, lng: 80.2707 },
      },
      {
        name: 'Coimbatore',
        localities: ['Gandhipuram', 'Peelamedu', 'R.S. Puram', 'Singanallur'],
        coordinates: { lat: 11.0168, lng: 76.9558 },
      },
      {
        name: 'Madurai',
        localities: ['Goripalayam', 'Anna Nagar', 'Villapuram', 'Simmakkal'],
        coordinates: { lat: 9.9252, lng: 78.1198 },
      },
    ],
  },
  {
    state: 'Karnataka',
    districts: [
      {
        name: 'Bengaluru Urban',
        localities: ['Bellandur', 'Whitefield Outer', 'Hebbal', 'BTM Layout', 'Peenya Industrial', 'Kengeri'],
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
      {
        name: 'Mysuru',
        localities: ['Vijayanagar', 'Kuvempunagar', 'Hebbal 1st Stage', 'Saraswathipuram'],
        coordinates: { lat: 12.2958, lng: 76.6394 },
      },
      {
        name: 'Hubballi-Dharwad',
        localities: ['Vidyanagar', 'Gokul Road', 'Navanagar', 'Old Hubballi'],
        coordinates: { lat: 15.3647, lng: 75.1240 },
      },
    ],
  },
  {
    state: 'West Bengal',
    districts: [
      {
        name: 'Kolkata',
        localities: ['Behala', 'Salt Lake Sector V', 'Dum Dum Cantonment', 'Gariahat', 'Kasba', 'Barabazar'],
        coordinates: { lat: 22.5726, lng: 88.3639 },
      },
      {
        name: 'Howrah',
        localities: ['Shibpur', 'Bally', 'Liluah', 'Santragachi'],
        coordinates: { lat: 22.5958, lng: 88.2636 },
      },
      {
        name: 'Siliguri',
        localities: ['Pradhan Nagar', 'Sevoke Road', 'Hakim Para', 'Matigara'],
        coordinates: { lat: 26.7271, lng: 88.3953 },
      },
    ],
  },
  {
    state: 'Rajasthan',
    districts: [
      {
        name: 'Jaipur',
        localities: ['Mansarovar', 'Vaishali Nagar', 'Sanganer', 'Jagatpura', 'Malviya Nagar'],
        coordinates: { lat: 26.9124, lng: 75.7873 },
      },
      {
        name: 'Jodhpur',
        localities: ['Sardarpura', 'Shastri Nagar', 'Ratanada', 'Mandore Road'],
        coordinates: { lat: 26.2389, lng: 73.0243 },
      },
      {
        name: 'Kota',
        localities: ['Vigyan Nagar', 'Talwandi', 'Mahaveer Nagar', 'Kunhari'],
        coordinates: { lat: 25.2138, lng: 75.8648 },
      },
    ],
  },
  {
    state: 'Gujarat',
    districts: [
      {
        name: 'Ahmedabad',
        localities: ['Maninagar', 'Bopal', 'Naroda GIDC', 'Navrangpura', 'Vastral'],
        coordinates: { lat: 23.0225, lng: 72.5714 },
      },
      {
        name: 'Surat',
        localities: ['Varachha', 'Athwa Lines', 'Katargam', 'Udhna Industrial'],
        coordinates: { lat: 21.1702, lng: 72.8311 },
      },
      {
        name: 'Vadodara',
        localities: ['Alkapuri', 'Makarpura', 'Fatehgunj', 'Manjalpur'],
        coordinates: { lat: 22.3072, lng: 73.1812 },
      },
    ],
  },
  {
    state: 'Assam',
    districts: [
      {
        name: 'Kamrup Metro (Guwahati)',
        localities: ['Dispur Capital Zone', 'Paltan Bazar', 'Jalukbari', 'Hatigaon', 'Six Mile'],
        coordinates: { lat: 26.1445, lng: 91.7362 },
      },
      {
        name: 'Dibrugarh',
        localities: ['Graham Bazar', 'Chowkidinghee', 'Milan Nagar', 'Naliapool'],
        coordinates: { lat: 27.4728, lng: 94.9120 },
      },
      {
        name: 'Silchar',
        localities: ['Tarapur', 'Rangirkhari', 'Ambicapatty', 'Meherpur'],
        coordinates: { lat: 24.8333, lng: 92.7789 },
      },
    ],
  },
];

export const DEFAULT_FALLBACK_LOCATION = {
  state: 'Location not known',
  district: 'Unspecified District',
  locality: 'General Area',
  coordinates: { lat: 20.5937, lng: 78.9629 }, // Center of India
};

export function findDistrictCoordinates(state: string, district: string) {
  const foundState = INDIAN_LOCATIONS.find((s) => s.state === state);
  if (!foundState) return DEFAULT_FALLBACK_LOCATION.coordinates;
  const foundDistrict = foundState.districts.find((d) => d.name === district);
  return foundDistrict ? foundDistrict.coordinates : DEFAULT_FALLBACK_LOCATION.coordinates;
}
