export function filterCharacters(characters, searchTerm, media) {
    const searchTermUpper = searchTerm.toUpperCase();
    const filtered = characters.filter(character => {
        return (media === '' || character.media === media || character.media2 === media) && 
            searchTermUpper.split(" ").every((keyword) => (character.name + character.media).toUpperCase().includes(keyword));
    }).sort(
        (character1, character2) => {
            const directNameSearch1 = character1.name.toUpperCase().startsWith(searchTermUpper);
            const directNameSearch2 = character2.name.toUpperCase().startsWith(searchTermUpper);
            if (directNameSearch1 && !directNameSearch2) {
                return -1;
            }
            else if (!directNameSearch1 && directNameSearch2) {
                return 1;
            }
            const directMediaSearch1 = character1.media.toUpperCase().startsWith(searchTermUpper);
            const directMediaSearch2 = character2.media.toUpperCase().startsWith(searchTermUpper);
            if (directMediaSearch1 && !directMediaSearch2) {
                return -1;
            }
            else if (!directMediaSearch1 && directMediaSearch2) {
                return 1;
            }
            return character1.name.replace("\"", "") > character2.name.replace("\"", "") ? 1:-1;
        }
    )
    return filtered;
}