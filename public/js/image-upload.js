function applyDnDFile(){
    const beforeUploadEl = document.querySelector("#before-upload");
    const afterUploadEl = document.querySelector("#after-upload");
    const inputFile = document.querySelector("#upload-image");
    const imagePreview = document.querySelector("#after-upload #image-drop");
    const clearBtn = document.querySelector("#after-upload #clear-btn");

    function showImagePreview(img){
        if(img){
            const blobUrl = URL.createObjectURL(img);
            imagePreview.src = blobUrl;
            afterUploadEl.style.display = "flex";
            beforeUploadEl.style.display = "none";
        }
    }

    beforeUploadEl.addEventListener("click", (e) => {
        e.preventDefault();
        inputFile.click();
    });

    inputFile.addEventListener("change", (e) => {
        e.preventDefault();
        showImagePreview(e.target.files[0]);
    });

    clearBtn.addEventListener("click", (e) => {

        afterUploadEl.style.display = "none";
        beforeUploadEl.style.display = "flex";
    });

}

    
const beforeUploadEl = document.querySelector("#before-upload");
const afterUploadEl = document.querySelector("#after-upload");
const inputFile = document.querySelector("#upload-image");
const imagePreview = document.querySelector("#after-upload #image-drop");
const clearBtn = document.querySelector("#after-upload #clear-btn");

applyDnDFile()