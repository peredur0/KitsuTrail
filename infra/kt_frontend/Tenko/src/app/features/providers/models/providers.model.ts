export class Provider {
    constructor(
        public id: number,
        public type: 'idp' | 'sp',
        public protocol: 'OIDC' | 'SAML' | 'LDAP' | 'Kerberos' | 'OAuth2' | 'Internal',
        public name: string
    ){}
}