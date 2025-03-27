export class Truck {

    public id: number;
    public brand: string;
    public model: string;
    public paint: string;
    public year: number;
    public plate: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
