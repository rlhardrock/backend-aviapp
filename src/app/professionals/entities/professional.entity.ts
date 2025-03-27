export class Professional {

    public id: number;
    public sex: string;
    public professionalLicense: string;
    public name: string;
    public lastName: string;
    public phone: string;
    public taxpayerId: string;
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
