export class Company {

    public id: string;
    public name: string;
    public business: string;
    public phone: string;
    public email: string;
    public city: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
