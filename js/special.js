export class Losowanko {
    constructor(num, t1, t2) {
        this.num = num
        this.t1 = t1
        this.t2 = t2
    }
}

export class Special {
    // use "*" for wildcard (if a special doesn't depend on the specific field of losowanko)
    constructor(num, t1, t2, audio_name, author) {
        this.num = num
        this.t1 = t1
        this.t2 = t2
        this.audio_name = audio_name
        this.author = author
    }

    check_match(losowanko) {
        return (this.num == "*" || this.num == losowanko.num) &&
               (this.t1 == "*" || this.num == losowanko.t1) &&
               (this.t2 == "*" || this.num == losowanko.t2)
    }
}

var specials = [
    new Special("*", "jednowątkowych", "*", "jaki-jestes-wiciu", "wiciu"),
    new Special("*", "*", "wiader", "kaszelek", "wiciu"),
]


// returns the object representing the special temacik, containing .audio_src and .author (strings)
export function get_special(losowanko) {
    for (const special of specials) {
        if (special.check_match(losowanko)) {
            return special
        }
    }

    return null
}