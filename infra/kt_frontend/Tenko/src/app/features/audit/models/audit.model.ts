export class AuditEntry {
    timestamp?: Date;
    audit_id?: string;
    user_id?: string;
    user_login?: string;
    provider_type?: string;
    provider_id?: number;
    provider_name?: string;
    provider_protocol?: string;
    trace_id?: string;
    source_ip?: string;
    source_admin?: string;
    category?: string;
    action?: string;
    result?: string;
    reason?: string;
    info?: string;
}