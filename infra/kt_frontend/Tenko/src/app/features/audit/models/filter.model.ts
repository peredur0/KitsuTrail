export interface TimeRangeFilter {
    start: string;
    end: string;
}

export interface QueryFilter {
    time_range: TimeRangeFilter;
    trace_id?: string[];
    action?: string[];
    result?: string[];
    user_id?: string[];
    provider_id?: number[];
    provider_name?: string[];
    provider_type?: string[];
    provider_protocol?: string[];
}

export interface AuditFilter {
    filter: QueryFilter;
    per_page?: number;
    page?: number;
}