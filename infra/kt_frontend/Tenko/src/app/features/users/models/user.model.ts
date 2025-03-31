export class User {
    
    email?: string;
    id: string;
    
    constructor(
        public firstname: string,
        public lastname: string,
        public login: string,
        public createdAt: Date
    ) {
        this.id = crypto.randomUUID().substring(0,8);
    }

    setEmail(email: string): void {
        this.email = email;
    }

    withEmail(email: string): User {
        this.email = email;
        return this
    }
}