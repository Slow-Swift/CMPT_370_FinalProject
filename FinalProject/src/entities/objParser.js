/**
 * File Name: objParser.js
 * Name: Finian Lugtigheid
 * Date: TODO
 * Description:
 *   Loads an OBJ file and creates an entity from it
 */

import { loadFile } from "../files.js";
import { loadTexture } from "./textures.js";
import { createModels } from "./models.js";

/**
 * Adapted from ThinMatrix's tutorial on writing an OBJ parser in Java:
 * https://www.youtube.com/watch?v=YKFYtekgnP8
 * @param {string} file 
 * @param {boolean} useMaterials 
 * @returns An entity build from the OBJ file
 */
export async function loadObj(file, useMaterials=true) {
    const objFile = await loadFile(file);
    const lines = objFile.split('\n');

    const objData = {
        // The data used to create the object
        indices: [],
        vertices: [],
        orderedTextureCoords: [],
        orderedNormals: [],
        
        // These are not necessarily ordered
        textureCoords: [],
        normals: [],
        
        // Materials
        components: [{
            vertexCount: 0,
            startIndex: 0,
            materialName: "Default"
        }],
        materialFile: "",
    }

    let currentComponent = objData.components[0];
    
    for (const line of lines) {
        const [prefix, ...data] = line.split(' ');

        switch (prefix) {
            case "mtllib":  // Set the material file
                objData.materialFile = data[0];
                break;
            case "v":   // Add the positions data for a vertex
                objData.vertices.push(Number(data[0]), Number(data[1]), Number(data[2]));
                break;
            case "vt":  // Add the texture coordinates for a vertex
                objData.textureCoords.push([Number(data[0]), Number(data[1])]);
                break;
            case "vn":  // Add the normal data for a vertex
                objData.normals.push([Number(data[0]), Number(data[1]), Number(data[2])]);
                break;
            case "usemtl":  // Start using a new material
                currentComponent = {
                    vertexCount: 0,
                    startIndex: objData.indices.length,
                    materialName: data[0]
                };
                objData.components.push(currentComponent);
                break;
            case "f":   // Process a face of the model
                processVertex(data[0].split('/'), objData);
                processVertex(data[1].split('/'), objData);
                processVertex(data[2].split('/'), objData);
                currentComponent.vertexCount += 3;
                break;
        }
    }

    // Delete the default component if it is empty
    if (objData.components[0].vertexCount == 0) {
        objData.components.shift();
    }

    // Load the materials
    let materials = [];
    if (objData.materialFile) {
        const materialFile = file.substring(0, file.lastIndexOf('/') + 1) + objData.materialFile;
        let materialNames;
        [materials, materialNames] = await parseMaterialFile(materialFile);
        for (const component of objData.components) {
            component.materialIndex = materialNames[component.materialName];
            delete component.materialName;
        }
    } 
    
    // Replace this with a call to your own create entity/model/object function
    return [createModels(
        objData.indices, 
        objData.vertices, 
        objData.orderedTextureCoords, 
        objData.orderedNormals, 
        objData.components
    ), materials];
}

/**
 * Process a vertex for a face by updating the indices, texture coordinates, and normals
 * @param vertex The data for the vertex
 * @param objData The data for the object
 */
function processVertex(vertex, objData) {
    // Get the indices for each of the data items
    const index = Number(vertex[0]) - 1;
    const textureIndex = Number(vertex[1]) - 1;
    const normalIndex = Number(vertex[2]) - 1;

    // Copy that data into the index, texture coordinate, and normal lists
    objData.indices.push(index);
    objData.orderedTextureCoords[2 * index] = objData.textureCoords[textureIndex][0];
    objData.orderedTextureCoords[2 * index + 1] = 1 - objData.textureCoords[textureIndex][1];
    objData.orderedNormals[3 * index] = objData.normals[normalIndex][0];
    objData.orderedNormals[3 * index + 1] = objData.normals[normalIndex][1];
    objData.orderedNormals[3 * index + 2] = objData.normals[normalIndex][2];
}

const IMAGE_FOLDER = "images/";

/**
 * Parse a material file and return a dictionary of the materials is contains
 * @param {string} file The path to the material file 
 * @returns A dictionary mapping material names to materials
 */
async function parseMaterialFile(file) {
    const objFile = await loadFile(file);
    const lines = objFile.split('\n');

    const materials = [];
    const materialNames = {};
    let currentMaterial;

    for (const line of lines) {
        const [prefix, ...data] = line.split(' ');

        switch (prefix) {
            case "newmtl":  // Add a new material
                currentMaterial = {
                    ambient: [1,1,1],
                    diffuse: [1,1,1],
                    specular: [1,1,1],
                    emissive: [0,0,0],
                    shininess: [0,0,0],
                    useTexture: false
                };
                materialNames[data[0]] = materials.length;
                materials.push(currentMaterial);
                break;
            case "Ka":      
                currentMaterial.ambient = [Number(data[0]), Number(data[1]), Number(data[2])];
                break  
            case "Kd": 
                currentMaterial.diffuse = [Number(data[0]), Number(data[1]), Number(data[2])];
                break  
            case "Kd":      
                currentMaterial.specular = [Number(data[0]), Number(data[1]), Number(data[2])];
                break  
            case "Ke":    
                currentMaterial.emissive = [Number(data[0]), Number(data[1]), Number(data[2])];
                break  
            case "Ns":     
                currentMaterial.shininess = Number(data[0]);
                break  
            case "map_Kd":  // Set the material texture 
                const filename = data[0].split('/').pop();
                // Replace this with a call to your load texture function
                currentMaterial.texture = loadTexture(IMAGE_FOLDER + filename); 
                currentMaterial.useTexture = true;
                break;
        }
    }

    return [materials, materialNames];
}