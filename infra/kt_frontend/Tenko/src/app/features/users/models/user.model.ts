export class User {
    
    email?: string;
    id: string;
    createdAt: Date;
    
    constructor(
        public firstname: string,
        public lastname: string,
        public login: string,
    ) {
        this.id = crypto.randomUUID().substring(0,8);
        this.createdAt = new Date;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    withEmail(email: string): User {
        this.setEmail(email);
        return this;
    }
}
