import { ChartData, CurrentState, ProvidersActivities, UsersSummary } from "./stats.model";
import { UsersActivities } from "./stats.model";

export interface DashBoardData {
    currentState: CurrentState;
    usersActivity: UsersActivities;
    providersActivity: ProvidersActivities;
    protocolsActivity: ChartData;
    failureActivity: ChartData;
    usersSummary: UsersSummary;
}