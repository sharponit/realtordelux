export interface BusinessVerificationInput {
  country: string;
  registrationNumber?: string;
  vatNumber?: string;
  firmName?: string;
  professionType?: string;
}

export interface BusinessVerificationResult {
  legal_name: string;
  registration_number: string;
  address: string;
  country: string;
  vat_number: string | null;
  status: 'active' | 'inactive' | 'not_found' | 'pending';
  matched: boolean;
  source: string;
  raw_payload: Record<string, unknown>;
}

interface RegistryProvider {
  country: string;
  verify(input: BusinessVerificationInput): Promise<BusinessVerificationResult>;
}

function mockResult(input: BusinessVerificationInput, source: string): BusinessVerificationResult {
  return {
    legal_name: input.firmName || 'Viyra Professional Entity',
    registration_number: input.registrationNumber || 'PENDING-REGISTRY-NUMBER',
    address: 'Registry address pending live provider integration',
    country: input.country,
    vat_number: input.vatNumber || null,
    status: input.registrationNumber ? 'active' : 'pending',
    matched: Boolean(input.registrationNumber || input.vatNumber),
    source,
    raw_payload: {
      provider: source,
      profession_type: input.professionType,
      todo: 'TODO: Add official registry credentials and API mapping for this country.'
    }
  };
}

const providers: RegistryProvider[] = [
  'Spain',
  'Netherlands',
  'UAE',
  'Portugal',
  'France',
  'Belgium',
  'Germany'
].map((country) => ({
  country,
  verify: async (input) => mockResult(input, `${country} mock registry provider`)
}));

export async function verifyBusinessRegistration(input: BusinessVerificationInput) {
  const provider =
    providers.find((item) => item.country.toLowerCase() === input.country.toLowerCase()) || providers[0];

  return provider.verify(input);
}
