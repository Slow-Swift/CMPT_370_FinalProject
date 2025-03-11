async function loadFile(url) {
    const response = await fetch(url);

    if (response.ok) {
        return response.text();
    } else {
        throw `Could not load file: url`;
    }
}