export class User {

    public id: string;
    public sex: string;
    public licenseSup: string;
    public name: string;
    public lastName: string;
    public phone: string;
    public taxpayer: string;
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
