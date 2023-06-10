import { Platform } from "./platfrom"
import { Store } from "./store"
import { Tag } from "./tags"
import { Genre } from "./genre"
import { Image } from "./image"
    
export class Game {
    id: string
    gameName: string
    backgroundImage: string
    rating: string
    descriptionRaw: string
    suggestionCount: string
    reviewCount: string
    platforms: Platform[]
    stores: Store[]
    genres: Genre[]
    tags: Tag[]

    
  constructor(id: string, name: string, background_image: string, rating: string, description_raw:string, suggestion_count:string,review_count: string) {
    this.id = id;
    this.gameName = name;
    // this.released = released;
    this.backgroundImage = background_image;
    this.rating = rating;
    this.descriptionRaw = description_raw;
    this.suggestionCount = suggestion_count;
    this.reviewCount = review_count;
    // this.platforms = platforms;
    // this.stores = stores;
    // this.genres = genres;
    // this.tags = tags;
    // this.screenshots = screenshots;
}
}
