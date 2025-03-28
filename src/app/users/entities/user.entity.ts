export class User {

    public id: number;
    public sex: string;
    public licenseId: string;
    public name: string;
    public lastName: string;
    public phone: string;
    public taxpayerId: string;
    public email: string;
    public password: string;
    public role: string;
    public status: string;
    public dateBirth: Date;
    public createdAt: Date;
    public updatedAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
