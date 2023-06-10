export class Genre {
    id: string;
    genreName: string;
    slug: string;
    description: string;

    constructor(data: any) {
        this.id = data.id;
        this.genreName = data.name;
        this.slug = data.slug;
        this.description = data.description
      }

}
