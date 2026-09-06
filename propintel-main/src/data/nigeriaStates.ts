// Centralised list of all 36 Nigerian states + the FCT.
// Import this everywhere a state list is needed (search filters, listing
// wizard, professional registration, user profiles, location forms) instead
// of hard-coding state arrays in individual components.

export interface NigerianState {
  name: string
  /** Short code used in mock verification-provider lookups etc. */
  code: string
  capital: string
  geopoliticalZone: 'North Central' | 'North East' | 'North West' | 'South East' | 'South South' | 'South West'
}

export const NIGERIAN_STATES: NigerianState[] = [
  { name: 'Abia', code: 'AB', capital: 'Umuahia', geopoliticalZone: 'South East' },
  { name: 'Adamawa', code: 'AD', capital: 'Yola', geopoliticalZone: 'North East' },
  { name: 'Akwa Ibom', code: 'AK', capital: 'Uyo', geopoliticalZone: 'South South' },
  { name: 'Anambra', code: 'AN', capital: 'Awka', geopoliticalZone: 'South East' },
  { name: 'Bauchi', code: 'BA', capital: 'Bauchi', geopoliticalZone: 'North East' },
  { name: 'Bayelsa', code: 'BY', capital: 'Yenagoa', geopoliticalZone: 'South South' },
  { name: 'Benue', code: 'BE', capital: 'Makurdi', geopoliticalZone: 'North Central' },
  { name: 'Borno', code: 'BO', capital: 'Maiduguri', geopoliticalZone: 'North East' },
  { name: 'Cross River', code: 'CR', capital: 'Calabar', geopoliticalZone: 'South South' },
  { name: 'Delta', code: 'DE', capital: 'Asaba', geopoliticalZone: 'South South' },
  { name: 'Ebonyi', code: 'EB', capital: 'Abakaliki', geopoliticalZone: 'South East' },
  { name: 'Edo', code: 'ED', capital: 'Benin City', geopoliticalZone: 'South South' },
  { name: 'Ekiti', code: 'EK', capital: 'Ado-Ekiti', geopoliticalZone: 'South West' },
  { name: 'Enugu', code: 'EN', capital: 'Enugu', geopoliticalZone: 'South East' },
  { name: 'Gombe', code: 'GO', capital: 'Gombe', geopoliticalZone: 'North East' },
  { name: 'Imo', code: 'IM', capital: 'Owerri', geopoliticalZone: 'South East' },
  { name: 'Jigawa', code: 'JI', capital: 'Dutse', geopoliticalZone: 'North West' },
  { name: 'Kaduna', code: 'KD', capital: 'Kaduna', geopoliticalZone: 'North West' },
  { name: 'Kano', code: 'KN', capital: 'Kano', geopoliticalZone: 'North West' },
  { name: 'Katsina', code: 'KT', capital: 'Katsina', geopoliticalZone: 'North West' },
  { name: 'Kebbi', code: 'KE', capital: 'Birnin Kebbi', geopoliticalZone: 'North West' },
  { name: 'Kogi', code: 'KO', capital: 'Lokoja', geopoliticalZone: 'North Central' },
  { name: 'Kwara', code: 'KW', capital: 'Ilorin', geopoliticalZone: 'North Central' },
  { name: 'Lagos', code: 'LA', capital: 'Ikeja', geopoliticalZone: 'South West' },
  { name: 'Nasarawa', code: 'NA', capital: 'Lafia', geopoliticalZone: 'North Central' },
  { name: 'Niger', code: 'NI', capital: 'Minna', geopoliticalZone: 'North Central' },
  { name: 'Ogun', code: 'OG', capital: 'Abeokuta', geopoliticalZone: 'South West' },
  { name: 'Ondo', code: 'ON', capital: 'Akure', geopoliticalZone: 'South West' },
  { name: 'Osun', code: 'OS', capital: 'Osogbo', geopoliticalZone: 'South West' },
  { name: 'Oyo', code: 'OY', capital: 'Ibadan', geopoliticalZone: 'South West' },
  { name: 'Plateau', code: 'PL', capital: 'Jos', geopoliticalZone: 'North Central' },
  { name: 'Rivers', code: 'RI', capital: 'Port Harcourt', geopoliticalZone: 'South South' },
  { name: 'Sokoto', code: 'SO', capital: 'Sokoto', geopoliticalZone: 'North West' },
  { name: 'Taraba', code: 'TA', capital: 'Jalingo', geopoliticalZone: 'North East' },
  { name: 'Yobe', code: 'YO', capital: 'Damaturu', geopoliticalZone: 'North East' },
  { name: 'Zamfara', code: 'ZA', capital: 'Gusau', geopoliticalZone: 'North West' },
  { name: 'FCT', code: 'FC', capital: 'Abuja', geopoliticalZone: 'North Central' },
]

export const NIGERIAN_STATE_NAMES: string[] = NIGERIAN_STATES.map((s) => s.name)

export const getStateByName = (name: string): NigerianState | undefined =>
  NIGERIAN_STATES.find((s) => s.name.toLowerCase() === name.toLowerCase())
