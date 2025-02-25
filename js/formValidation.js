import { ticketDisplay } from "./ticketGenerator.js"
const header = document.querySelector(".header")
const formContainer = document.querySelector(".formContainer")
const from = document.querySelector("form")
const dropZone = document.querySelector(".dropZone")
const fileInput = document.querySelector("#fileInput")
const emailInput = document.querySelector("#emailInput")
const nameInput = document.querySelector("#nameInput")
const GitHubName = document.querySelector("#GitHubName")
const emailError = document.querySelector("#emailError")
const fileError = document.querySelector("#fileError")
const uploadImg = document.querySelector("#uploadImg")
const dragZoneText = document.querySelector("#dragZoneText")
const removeBtn = document.querySelector("#removeImg")
const changeBtn = document.querySelector("#changeImg")
let uploadedImg
export let isImageUploaded = false
// uploadImgValidation
dropZone.addEventListener("click",()=>{fileInput.click()})
// dragDropHandel
let drags = ['dragover', 'dragleave']
drags.forEach(event => {
    dropZone.addEventListener(event, (e) => {
        e.preventDefault();
        dropZone.classList.toggle('dragover', event === 'dragover');
    });
});
dropZone.addEventListener('drop',(e)=>{
    e.preventDefault();
    dropZone.classList.remove('dregOver');
    const files = e.dataTransfer.files;
    if(files.length){
        handleFiles(files);
    }
})
// fileSelectionHandel
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});
function handleFiles(files) {
    const file = files[0]
    if (file) {
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 500 * 1024;
        if (!validTypes.includes(file.type) || file.size > maxSize) {
            fileError.classList.add("error")
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            // Get the Data URL of the selected image
            const imageUrl = e.target.result;
            uploadedImg = imageUrl
            uploadImg.src = uploadedImg;
        };
        isImageUploaded = true
        // Read the image as a Data URL
        reader.readAsDataURL(file);
        // FileReplacing
        uploadImg.style.display = 'block';
        if(isImageUploaded){
            dragZoneText.style.display = "none"
            document.querySelector(".dargZoneBtns").style.display = "block"
            removeBtn.addEventListener("click",(e)=>{
                e.preventDefault();
                uploadImg.src = "../assets/images/icon-upload.svg"
                dragZoneText.style.display = "block"
            document.querySelector(".dargZoneBtns").style.display = "none"
            })
            changeBtn.addEventListener("click",(e)=>{
                e.preventDefault();
                URL.revokeObjectURL(uploadImg.src)
                fileInput.click()
            })
        }
    }
}
// emailValidation
emailInput.addEventListener("input",validateEmail)
function validateEmail() {
    const email = emailInput.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(email === '' || !emailRegex.test(email) || isDisposableEmail(email)){
        emailError.style.display = "flex"
        emailError.classList.add("error")
        return false
    }
}
function isDisposableEmail(email) {
    const disposableDomains = [
        'tempmail.com',
        'mailinator.com',
        'guerrillamail.com',
        '10minutemail.com'
    ];
    const domain = email.split('@')[1];
    return disposableDomains.includes(domain);
}
// savingInformation
from.addEventListener("submit",(e)=>{
    e.preventDefault()
    const userImg = uploadedImg;
    const userName = nameInput.value;
    const userEmail = emailInput.value;
    const userGitHub = GitHubName.value;
    const userData = {
        profile:userImg,
        name:userName,
        email:userEmail,
        gitHubID:userGitHub
    }
    if (userName !== "" && userGitHub !== "") {
        localStorage.setItem('user',JSON.stringify(userData))
        header.style.display= "none"
        formContainer.style.display= "none"
        ticketDisplay()
    }
})