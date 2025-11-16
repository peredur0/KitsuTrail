## Signaux
```ts
//-- define in service
export class HeaderService {
    title = signal<string>('');
    subtitle = signal<string>('');

    setTitle(newTitle: string): void {
        this.title.set(newTitle);
    }

    setSubtitle(newSub: string): void {
        this.subtitle.set(newSub);
    }
}

//-- Create in component
title = computed(() => this.headerService.title());
//...
this.headerService.setTitle("NEW title")
```
```html
<h3>{{ title() }} </h3>
```

// Observable
```ts
// define a service
@Injectable({
    providedIn: 'root'
})
export class ProvidersService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);

    getProviders(type: 'idp'|'sp'): Observable<Provider[]> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<Provider[]>(`${config.apiUrl}/api/v1/providers/${type}`)
            )
        );
    }
}

// use in component
export class ServicesListComponent implements OnInit {
  private headerService = inject(HeaderService);
  private providersService = inject(ProvidersService);

  spList$!: Observable<Provider[]>;

  ngOnInit(): void {
    this.headerService.setSubtitle("Services");
    this.spList$ = this.providersService.getProviders('sp');
  }
}
```
```html
 <app-provider-card *ngFor="let sp of spList$ | async" [provider]="sp"/>
```
Le async permet de se désabonner automatiquement 


// Promises
```ts
  async onAddUser(): Promise<void> {
    const login = this.userForm.get('login')?.value;
    if (!login) return;
    
    try {
      await firstValueFrom(this.usersService.getUserFromIdentifier('login', login));
      this.userForm.get('login')?.setErrors({ loginTaken: true });
    } catch (error: any) {
      if (error?.status === 404) {
        try {
          await firstValueFrom(this.usersService.addNewUser(this.userForm.value));
          this.usersService.notifyUsersChanged();
          this.dialogRef.close();
        } catch (postError: any) {
          console.error('Failed to add user', postError);
          alert("Echec du POST de l'utilisateur");
        }
      } else {
        console.error('Failed to create user', error);
        alert("Echec de la création de l'utilisateur");
      }
    }
  }
```