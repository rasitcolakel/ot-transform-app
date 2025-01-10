export type RawUser = {
  CitizenshipNumber: number;
  CorrelationId: string;
  RequestBody: string;
  RequestTime: string;
  ProcessType: string;
};

export type User = {
  citizenshipNumber: string;
  correlationId: string;
  requestBody: UserBody;
  requestTime: Date;
  processType: string;
};

export type UserBody = {
  citizenshipNumber: number;
  onboardingProcessStateDefinitionCode: string;
};

export type DurationByUser = {
  citizenshipNumber: string;
  correlationId: string;
  durationInSeconds: number;
  connectingEvent: User;
  ocrEvent: User;
};
