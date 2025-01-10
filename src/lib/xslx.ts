import { DurationByUser, User, UserBody } from "@/types";

export const mapData = (data: string[][]): User[] => {
  return sortDataByCitizenshipNumber(
    data
      .slice(1)
      .filter((row) => row.length === 5)
      .map((row) => {
        const citizenshipNumber = row[0].toString();
        const requestTime = new Date(row[3]);
        if (typeof row[3] === "object") {
          // eğer tarih obje olarak gelmişse, saat dilimini düzelt
          requestTime.setHours(requestTime.getHours() - 3);
        }

        return {
          citizenshipNumber,
          correlationId: row[1],
          requestBody: JSON.parse(row[2]) as UserBody,
          requestTime,
          processType: row[4],
        };
      })
      .filter((user) => user.processType !== "NULL")
  );
};

const sortDataByCitizenshipNumber = (data: User[]): User[] => {
  return data.sort((a, b) => {
    return parseInt(a.citizenshipNumber) - parseInt(b.citizenshipNumber);
  });
};

export const readableDate = (date: Date): string => {
  // YYYY-MM-DD HH:MM:SSTZD
  return date.toLocaleString("en-GB");
};

export const calculateDurationsByUser = (data: User[]): DurationByUser[] => {
  // Group by citizenshipNumber
  const groupedByCitizenshipNumber = data.reduce((acc, item) => {
    const { citizenshipNumber } = item;
    if (!acc[citizenshipNumber]) {
      acc[citizenshipNumber] = [];
    }
    acc[citizenshipNumber].push(item);
    return acc;
  }, {} as Record<string, User[]>);

  // Calculate durations for each citizenshipNumber
  const durations: DurationByUser[] = [];

  for (const [citizenshipNumber, events] of Object.entries(
    groupedByCitizenshipNumber
  )) {
    // Group each user's events by correlationId
    const groupedByCorrelationId = events.reduce((acc, event) => {
      const { correlationId } = event;
      if (!acc[correlationId]) {
        acc[correlationId] = [];
      }
      acc[correlationId].push(event);
      return acc;
    }, {} as Record<string, User[]>);

    for (const [correlationId, correlationEvents] of Object.entries(
      groupedByCorrelationId
    )) {
      const connectingEvent = correlationEvents.find(
        (e) =>
          e.requestBody.onboardingProcessStateDefinitionCode ===
          "ONBOARDING_CONNECTING"
      );
      const ocrEvent = correlationEvents.find(
        (e) =>
          e.requestBody.onboardingProcessStateDefinitionCode ===
          "ONBOARDING_OCR"
      );

      if (connectingEvent && ocrEvent) {
        const duration =
          (new Date(ocrEvent.requestTime).getTime() -
            new Date(connectingEvent.requestTime).getTime()) /
          1000;

        if (duration < 0) {
          console.error(
            `Duration is negative for citizenshipNumber: ${citizenshipNumber}, correlationId: ${correlationId}`
          );
          continue;
        }
        const index = durations.length + 1;
        durations.push({
          index,
          citizenshipNumber,
          correlationId,
          durationInSeconds: duration,
          connectingEvent,
          ocrEvent,
        });
      }
    }
  }

  return durations;
};
