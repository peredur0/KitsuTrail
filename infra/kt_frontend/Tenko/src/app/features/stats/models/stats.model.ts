export class CurrentState {
    active_sessions!: number;
    active_users!: number;
    total_users!: number;
    total_idp!: number;
    total_sp!: number;
}

export class BaseIntData {
    data!: number[];
}

export class BaseStrData {
    data!: string[];
}

export class UsersActivities {
    authentications!: BaseIntData;
    access!: BaseIntData;
    labels!: BaseStrData;
}