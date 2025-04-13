/**
 * File Name: files.js
 * Author: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *  Functions to get the content of stored files
 */

/**
 * Loads the file at the given url and returns it's text contents
 * Throws an error if a prolem occurs
 * @param {string} url 
 * @returns The text content of the file
 */
export async function loadFile(url) {
    const response = await fetch(url);

    if (response.ok) {
        return response.text();
    } else {
        throw `Could not load file: url`;
    }
}