export class Transporter {

    public id: string;
    public name: string;
    public lastName: string;
    public phone: string;
    public taxpayer: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
