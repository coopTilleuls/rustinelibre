import {Repairer} from "@interfaces/Repairer";

export interface RepairerExceptionalClosure {
    '@id': string;
    '@type': string;
    id: string;
    repairer: Repairer;
    startDate: string;
    endDate: string;
}
