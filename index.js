const innerImage = document.querySelector('.inner-image')
const image = document.querySelector('#img')
const rangeInput = document.querySelector('#blur-range')
const downloadButton = document.querySelector('#download-button');
const fakeImg = document.querySelector('#fake-img')

rangeInput.addEventListener('input', () => {
    image.style.filter = `blur(${rangeInput.value}px)`
})

const addFileBtn = document.querySelector('.add__file-btn')

addFileBtn.addEventListener('change', () => {
    const files = addFileBtn.files
    const countFiles = files.length
    image.classList.add('after-upload')


    if(!countFiles) {
        alert('Не выбран файл!')
        return
    } else {
        rangeInput.classList.remove('none')
        downloadButton.classList.remove('none')
        innerImage.style.border = 'none'
        innerImage.style.boxShadow = 'none'
        document.querySelector('.svg-inner').classList.add('none')
    }

    const selectedFile = files[0]
    if (!/^image/.test(selectedFile.type)) {
        alert('Выбранный файл не является изображением!');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.addEventListener('load', (e) => {
      image.src = e.target.result;
      image.alt = selectedFile.name;

      fakeImg.src = e.target.result
      fakeImg.alt = selectedFile.name;
    });

    reader.addEventListener('error', () => {
        alert(`Произошла ошибка при чтении файла: ${selectedFile.name}`);
    });
})


downloadButton.addEventListener('click', () => {
    const originalWidth = fakeImg.width;
    const originalHeight = fakeImg.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    ctx.filter = `blur(${rangeInput.value}px)`;
    ctx.drawImage(image, 0, 0, originalWidth, originalHeight);
    const blurredImageDataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = blurredImageDataURL;
    downloadLink.download = 'blurred_image.png';
    downloadLink.click();
});