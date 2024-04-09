function applyDnDFile(){
    const beforeUpload= document.querySelector("#before-upload");
    const afterUpload = document.querySelector("#after-upload");
    const inputFile = document.querySelector("#upload-image");
    const imagePreview = document.querySelector("#after-upload #image-drop");
    const clearBtn = document.querySelector("#after-upload #clear-btn");

    function showImagePreview(img){
        if(img){
            const blobUrl = URL.createObjectURL(img);
            imagePreview.src = blobUrl;
            afterUpload.style.display = "flex";
            beforeUpload.style.display = "none";
        }
    }

    beforeUpload.addEventListener("click", (e) => {
        e.preventDefault();
        inputFile.click();
    });

    beforeUpload.addEventListener("dragover", (e) => {
        e.preventDefault();

    });
    
    beforeUpload.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            showImagePreview(e.dataTransfer.files[0]);
        }
    });

    inputFile.addEventListener("change", (e) => {
        e.preventDefault();
        showImagePreview(e.target.files[0]);
    });

    clearBtn.addEventListener("click", (e) => {
        afterUpload.style.display = "none";
        beforeUpload.style.display = "flex";
    });

}

    
applyDnDFile();