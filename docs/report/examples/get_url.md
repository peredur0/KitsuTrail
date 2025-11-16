```ts
export class HeaderComponent implements OnInit, OnDestroy {

  private routerSubscription!: Subscription;

  constructor(
    //...
    private router: Router
  ){}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const segments = event.urlAfterRedirects.split('/');
      this.headerService.setTitle(
        this.menuService.getLabel('title', segments[1])
      );
    });
  }

  ngOnDestroy(): void {
    if( this.routerSubscription ){
      this.routerSubscription.unsubscribe()
    }
  }
} 
```
