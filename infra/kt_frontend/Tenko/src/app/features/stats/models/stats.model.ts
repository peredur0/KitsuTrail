export class CurrentState {
    active_sessions!: number;
    active_users!: number;
    total_users!: number;
    total_idp!: number;
    total_sp!: number;
}

export class BaseIntData {
    data: number[] = [];
}

export class BaseStrData {
    data: string[] = [];
}

export class UsersActivities {
    authentications!: BaseIntData;
    access!: BaseIntData;
    labels!: BaseStrData;
}

export class ActivitiesResults {
    success!: BaseIntData;
    failure!: BaseIntData;
    labels!: BaseStrData;
}

export class ProvidersActivities {
    idp!: ActivitiesResults;
    sp!: ActivitiesResults;
}

export class SerieInt {
    name: string = '';
    data: number[] = [];
}

export class ChartData {
    series!: SerieInt[];
    categories!: string[];
}

export class UsersSummary {
    login!: string;
    authentication: number = 0;
    access: number = 0;
    failure: number = 0;
    events: number = 0;
}
