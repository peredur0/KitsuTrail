export class AuditColumn<T> {
    constructor(
        public columnDef: string,
        public header: string,
        public accessor: keyof T | ((row: T) => string)
    ) {}

    getValue(row: T): string {
        if (typeof this.accessor === 'function') {
            return this.accessor(row);
        }
        return String(row[this.accessor])
    }
}