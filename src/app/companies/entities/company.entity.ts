export class Company {

    public id: number;
    public name: string;
    public businessId: string;
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
