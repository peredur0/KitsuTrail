import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { Provider } from "../models/providers.model";

@Injectable({
    providedIn: 'root'
})
export class ProvidersService {
    private providers: Provider[] = [
        new Provider(1, 'idp', 'SAML', 'Kitsu SSO'),
        new Provider(2, 'idp', 'Internal', 'Kitsu repository'),
        new Provider(3, 'idp', 'LDAP', 'Kitsu AD'),
        new Provider(4, 'sp', 'SAML', 'Atlassian'),
        new Provider(5, 'sp', 'OIDC', 'Entra App'),
        new Provider(6, 'sp', 'SAML', 'Skyline'),
        new Provider(7, 'sp', 'OAuth2', 'Slock'),
        new Provider(8, 'sp', 'OAuth2', 'Pastaman')
    ]

    getProviders(type: 'idp'|'sp'): Observable<Provider[]> {
        const filteredProviders = this.providers.filter(provider => provider.type === type);
        return of(filteredProviders);
    }
}