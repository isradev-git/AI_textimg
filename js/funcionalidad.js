const apiKey = "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";

const maxImages = 4;
let selectedImageNumber = null;

//Función para generar un numero random entre min y max (incluidos)
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Función para deshabilitar el botón de generar durante el proceso
function disableGenerateButton(){
    document.getElementById("generate").disabled = true;
}
//Función para volver a poner el botón de generar después del proceso
function enableGenerateButton(){
    document.getElementById("generate").disabled = false;
}

//Función para limpiar el grid
function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

//Función para generar las imagenes
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for(let i = 0; maxImages; i++){
        //Generate a random number between 1 and 100 and apend it to the prompt
        const randomNumber = getRandomNumber(1, 100);
        const prompt = `${input} ${randomNumber}`;
        //We added random number to prompt to create different results
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",{
                method: "POST",
                headers: {
                    "content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({inputs: prompt}),
            }
        );

        if(!response.ok){
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null;
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    //Set filename based on the slected image
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}