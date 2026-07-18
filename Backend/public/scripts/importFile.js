const fileInput = document.getElementById('vcfInFile');
const fileDrag = document.getElementById('vcfDragFile');
const uploadBtn = document.getElementById('uploadBtn');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const statusText = document.getElementById('status');

let selectedFile = null;

const MaxSize = "20 MB";
const MaxFileSize = 1024 * 1024 * 20;

// Select File
fileInput.addEventListener('change', () => {

    const file = fileInput.files[0];

    if (!file) {
        console.log('no file selected');
        return;
    }

    if (!file.name.toLowerCase().endsWith('.json')) {
        statusText.innerText = "❌ Please select a valid .json file";
        return;
    }

    if (file.size > MaxFileSize) { // 20 MB
        statusText.innerText = `❌ Cannot upload file greater than ${MaxSize}`;
        return;
    }

    selectedFile = file;

    fileInfo.style.display = 'block';
    fileName.textContent = selectedFile.name;
    fileSize.textContent = formatSize(selectedFile.size);

    uploadBtn.innerText = "Upload File";
    uploadBtn.disabled = false;
    statusText.innerText = "";
});


// Drag & Drop File
fileDrag.addEventListener("dragover", (e) => {
    e.preventDefault();
});

fileDrag.addEventListener("drop", (e) => {
    e.preventDefault();

    let file = e.dataTransfer.files;

    if (!file) {
        console.log('no file selected');
        return;
    }

    if (file.length != '1') {
        statusText.innerText = "❌ Please drop only one file";
        console.warn('drop only one file, multiple files are not allowed.');
        return
    }

    file = file[0];

    if (!file.name.toLowerCase().endsWith('.json')) {
        statusText.innerText = "❌ Please select a valid .json file";
        return;
    }

    if (file.size > MaxFileSize) {
        statusText.innerText = `❌ Cannot upload file greater than ${MaxSize}`;
        return;
    }

    selectedFile = file;

    fileInfo.style.display = 'block';
    fileName.textContent = selectedFile.name;
    fileSize.textContent = formatSize(selectedFile.size);

    uploadBtn.innerText = "Upload File";
    uploadBtn.disabled = false;
    statusText.innerText = "";
});


// Upload File
uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    uploadBtn.innerText = "Uploading...";
    uploadBtn.disabled = true;

    let res;

    try {
        const response = await fetch(
            '/contacts/import',
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (response.ok) {

            statusText.innerText = "✅ File uploaded successfully!";

            statusText.innerHTML += `<br> 
                                    Server status: <strong>Updated:</strong> ${data.updated} | 
                                                   <strong>Created:</strong> ${data.created}`;

            // setTimeout(() => {
            //     window.location.href = data.redirectTo;
            // }, 1000);

        }
        else {
            statusText.innerText = "❌ Upload failed.";
            statusText.innerHTML += `<br>Reason: ${data.error}`;
            console.log(data);
        }

        res = response.ok;

    } catch (err) {
        statusText.innerText = "⚠️ Network error occurred";
        console.log("Error occured:");
        console.log(err);
    }

    uploadBtn.innerText = res ? "Uploaded" : "Try Again";
    uploadBtn.disabled = res;
});
