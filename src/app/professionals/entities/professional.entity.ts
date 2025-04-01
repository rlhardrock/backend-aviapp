export class Professional {

    public id: string;
    public sex: string;
    public license: string;
    public name: string;
    public lastName: string;
    public phone: string;
    public taxpayer: string;
    public email: string;
    public role: string;
    public status: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
